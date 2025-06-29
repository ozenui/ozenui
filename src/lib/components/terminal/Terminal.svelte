<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Avatar from '$lib/assets/image-avatar.webp';
	import { runHelp, runRm } from './commands.js';
	import { discoverContent } from './content-discovery.js';
	import { onMount } from 'svelte';

	let { children } = $props();
	let textarea: HTMLTextAreaElement | undefined = $state(undefined);
	let userInput = $state('');
	let history = $state<
		Array<{
			command: string;
			output?: string;
			timestamp: Date;
			pathname: string;
			isNeofetch?: boolean;
		}>
	>([]);

	let dynamicContent = $state<Record<string, Record<string, string>>>({});
	let dynamicFileSystem = $state<any>({});
	let hasBeenCleared = $state(false);

	const infoItems = [
		{ label: '', value: 'ozenui' },
		{ label: '', value: '-------' },
		{ label: 'Name:', value: 'Enzo Romera' },
		{ label: 'Nickname:', value: 'ozenui' },
		{ label: 'Location:', value: 'France' },
		{ label: 'Languages:', value: 'fr, en' },
		{ label: 'Position:', value: 'Design engineer' },
		{ label: 'Currently at:', value: 'FullEnrich' },
		{ label: 'Previously at:', value: 'Sesterce' },
		{ label: 'Freelance seats:', value: '1/1' }
	];

	const colorBar = [
		'#ff0000',
		'#ff9000',
		'#ffdd00',
		'#94ff00',
		'#26ff00',
		'#00ffa1',
		'#00fffa',
		'#00bbff',
		'#0050ff',
		'#4c00ff',
		'#8800ff',
		'#cc00ff',
		'#ff00d4',
		'#ff006e',
		'white',
		'#e4e4e4',
		'#b0b0b0',
		'#434343',
		'black'
	];

	// Load dynamic content on mount
	onMount(async () => {
		const { contentMap, fileSystemMap } = await discoverContent();
		dynamicContent = contentMap;
		dynamicFileSystem = fileSystemMap;
	});

	$effect(() => {
		if (textarea) {
			textarea.focus();
		}
	});

	$effect(() => {
		const pathname = page.url.pathname;
		const searchParams = page.url.searchParams;
		const isManualNavigation = searchParams.get('mode') === 'manual';
		const isNavbarNavigation = searchParams.get('source') === 'navbar';
		userInput = '';

		// Auto-clear terminal when navigating from navbar, but allow auto-navigation afterward
		if (isNavbarNavigation) {
			setTimeout(() => {
				clearTerminal();
				// Reset the cleared flag to allow auto-navigation for navbar navigation
				hasBeenCleared = false;
				// Clean up the navbar parameter
				const url = new URL(page.url);
				url.searchParams.delete('source');
				goto(url.pathname + url.search, { replaceState: true });
			}, 50);
			return; // Exit early to let the next effect cycle handle auto-navigation
		}

		// Auto-navigate for routes with content (direct URL access or after navbar clear)
		const shouldAutoNavigate = !isManualNavigation && !hasBeenCleared;

		// Handle blog post pages
		const blogPostMatch = pathname.match(/^\/blog\/(.+)$/);
		if (blogPostMatch && shouldAutoNavigate) {
			const slug = blogPostMatch[1];
			const autoCommand = `cd ~/blog/${slug} && cat content.txt`;
			const hasAutoCommand = history.some((entry) => entry.command === autoCommand);

			if (!hasAutoCommand) {
				setTimeout(() => {
					addToHistory(autoCommand, runCatDynamic('content.txt', `/blog/${slug}`), `/blog/${slug}`);
				}, 100);
			}
		}
		// Handle blog directory page
		else if (pathname === '/blog' && shouldAutoNavigate) {
			const autoCommand = `cd ~/blog && ls`;
			const hasAutoCommand = history.some((entry) => entry.command === autoCommand);

			if (!hasAutoCommand) {
				setTimeout(() => {
					const lsResult = runLsDynamic('/blog');
					if (typeof lsResult === 'string') {
						addToHistory(autoCommand, lsResult, '/blog');
					} else {
						addToHistoryWithLsOutput(autoCommand, lsResult, '/blog');
					}
				}, 100);
			}
		}
		// Handle single-level routes (about, contact, projects)
		else if (pathname.match(/^\/(about|contact|projects)$/) && shouldAutoNavigate) {
			const routeName = pathname.replace('/', '');
			const autoCommand = `cd ~/${routeName} && cat content.txt`;
			const hasAutoCommand = history.some((entry) => entry.command === autoCommand);

			if (!hasAutoCommand) {
				setTimeout(() => {
					addToHistory(autoCommand, runCatDynamic('content.txt', pathname), pathname);
				}, 100);
			}
		}
		// Handle home page
		else if (pathname === '/' && !isNavbarNavigation) {
			// Show neofetch if at root (but not if coming from navbar since we cleared)
			setTimeout(() => {
				showNeofetchIfAtRoot();
			}, 100);
		}

		// Note: We don't clean up the URL parameter to avoid timing issues
		// It will be naturally cleared on the next navigation

		setTimeout(() => {
			textarea?.focus();
		}, 100);
	});

	function autoGrow() {
		if (!textarea) return;
		textarea.style.height = 'auto';
		textarea.style.height = textarea.scrollHeight + 'px';
	}

	function handleKeyDown(event: KeyboardEvent) {
		const target = event.target as HTMLTextAreaElement;

		if (event.key === 'Enter') {
			event.preventDefault();
			handleCommand(userInput.trim());
			autoGrow();
		}

		if (event.key === 'Home' || (event.ctrlKey && event.key === 'a')) {
			event.preventDefault();
			target.setSelectionRange(0, target.value.length);
		}
	}

	function handleCommand(command: string) {
		if (!command) {
			clearInputAndFocus();
			return;
		}

		const parts = command.split(/\s+/);
		const [commandName, ...args] = parts;

		switch (commandName) {
			case 'help':
				addToHistory(command, runHelp());
				break;
			case 'cd':
				if (args.length >= 1) {
					const result = runCdDynamic(args.join(' '), page.url.pathname);
					if (result) {
						addToHistory(command, result);
					} else {
						addToHistory(command);
					}
				} else {
					addToHistory(command, 'cd: missing argument');
				}
				break;
			case 'rm':
				addToHistory(command, runRm());
				break;
			case 'ls':
				const lsResult = runLsDynamic(page.url.pathname);
				if (typeof lsResult === 'string') {
					addToHistory(command, lsResult);
				} else {
					addToHistoryWithLsOutput(command, lsResult, page.url.pathname);
				}
				break;
			case 'cat':
				if (args.length >= 1) {
					const filename = args[0];
					const result = runCatDynamic(filename, page.url.pathname);
					addToHistory(command, result);

					// If this is content.txt in a blog post directory, navigate to the URL
					if (filename === 'content.txt' && page.url.pathname.startsWith('/blog/')) {
						const slug = page.url.pathname.replace('/blog/', '');
						if (slug && slug !== 'blog') {
							goto(`/blog/${slug}?mode=manual`);
						}
					}
				} else {
					addToHistory(command, 'cat: missing file argument');
				}
				break;
			case 'neofetch':
				history.push(createNeofetchEntry());
				break;
			case 'clear':
				clearTerminal();
				return;
			default:
				addToHistory(command, `Command not found: ${command}`);
				break;
		}
		clearInputAndFocus();
	}

	function addToHistory(command: string, output?: string, customPathname?: string) {
		history.push({
			command,
			output,
			timestamp: new Date(),
			pathname: customPathname || page.url.pathname,
			isNeofetch: false
		});
	}

	function addToHistoryWithLsOutput(
		command: string,
		lsOutput: { type: 'ls-output'; items: Array<{ name: string; isDirectory: boolean }> },
		pathname: string
	) {
		history.push({
			command,
			timestamp: new Date(),
			pathname,
			isNeofetch: false,
			lsOutput
		});
	}

	function clearTerminal() {
		history = [];
		hasBeenCleared = true;
		clearInputAndFocus();
	}

	function createNeofetchEntry() {
		return {
			command: 'neofetch',
			output: undefined, // We'll render this specially
			timestamp: new Date(),
			pathname: '/',
			isNeofetch: true
		};
	}

	function showNeofetchIfAtRoot() {
		if (page.url.pathname === '/' && !history.some((entry) => entry.isNeofetch)) {
			history.push(createNeofetchEntry());
		}
	}

	function getCurrentDirectoryDynamic(path: string) {
		if (!dynamicFileSystem['/']) return null;
		if (path === '/') return dynamicFileSystem['/'];

		const parts = path.split('/').filter(Boolean);
		let current = dynamicFileSystem['/'];

		for (const part of parts) {
			if (current.type === 'directory' && current.children && current.children[part]) {
				current = current.children[part];
			} else {
				return null;
			}
		}
		return current;
	}

	function runLsDynamic(
		currentPath: string
	): string | { type: 'ls-output'; items: Array<{ name: string; isDirectory: boolean }> } {
		const currentDir = getCurrentDirectoryDynamic(currentPath);

		if (!currentDir || currentDir.type !== 'directory') {
			return 'ls: cannot access: No such directory';
		}

		if (!currentDir.children) {
			return { type: 'ls-output', items: [] };
		}

		const items = Object.entries(currentDir.children).map(([name, item]) => ({
			name,
			isDirectory: item.type === 'directory'
		}));

		return { type: 'ls-output', items };
	}

	function runCatDynamic(filename: string, currentPath: string): string {
		const currentDir = getCurrentDirectoryDynamic(currentPath);

		if (!currentDir || currentDir.type !== 'directory' || !currentDir.children) {
			return `cat: ${filename}: No such file or directory`;
		}

		const file = currentDir.children[filename];
		if (!file) {
			return `cat: ${filename}: No such file or directory`;
		}

		if (file.type !== 'file') {
			return `cat: ${filename}: Is a directory`;
		}

		// Navigation will be handled separately for manual commands

		const content = dynamicContent[currentPath]?.[filename];
		return content || `${filename}: File contents not available`;
	}

	function handleLsClick(itemName: string, isDirectory: boolean, fromPath: string) {
		if (isDirectory) {
			const newPath = fromPath === '/' ? `/${itemName}` : `${fromPath}/${itemName}`;
			goto(`${newPath}?mode=manual`);
		} else {
			userInput = `cat ${itemName}`;
			handleCommand();
		}
	}

	function resolvePath(path: string, currentPath: string): string {
		if (path === '~') {
			return '/';
		}

		if (path === '..') {
			return getParentPath(currentPath);
		}

		if (path.startsWith('../')) {
			const relativePath = path.replace('../', '');
			const parentPath = getParentPath(currentPath);
			return relativePath ? `${parentPath}/${relativePath}`.replace('//', '/') : parentPath;
		}

		if (path.startsWith('/')) {
			return path;
		}

		// For relative paths, append to current directory
		if (currentPath === '/') {
			return `/${path}`;
		} else {
			return `${currentPath}/${path}`;
		}
	}

	function getParentPath(currentPath: string): string {
		return currentPath.split('/').slice(0, -1).join('/') || '/';
	}

	function runCdDynamic(path: string, currentPath: string): string | null {
		const resolvedPath = resolvePath(path, currentPath);
		const targetDir = getCurrentDirectoryDynamic(resolvedPath);

		if (!targetDir) {
			return `cd: No such file or directory: ${path}`;
		}

		if (targetDir.type !== 'directory') {
			return `cd: Not a directory: ${path}`;
		}

		// Add manual mode parameter to prevent auto-navigation
		const urlWithParam = `${resolvedPath}?mode=manual`;
		goto(urlWithParam);
		return null;
	}

	function clearInputAndFocus() {
		userInput = '';
		textarea?.focus();
	}
</script>

<main
	class="flex h-full w-full cursor-text flex-col items-start justify-start gap-2 overflow-auto rounded-[10px] border border-white/10 bg-white/5 p-4 text-left font-mono text-[13px] transition-all duration-300 ease-out"
>
	<!-- Terminal History -->
	{#each history as entry}
		{#if entry.isNeofetch}
			<!-- Neofetch Display -->
			<section class="animate-mask-reveal relative mb-2 inline-flex gap-4">
				<img
					class="aspect-square h-[300px] bg-[#1D1D1D] object-contain"
					src={Avatar}
					alt="Avatar"
				/>
				<ul class="flex flex-1 flex-col justify-center gap-2">
					{#each infoItems as item}
						<li class="inline-flex items-center gap-2">
							{#if item.label}
								<div class="font-normal text-[#ffefaf]">{item.label}</div>
								<div class="font-normal text-[#f7afff]">{item.value}</div>
							{:else}
								<div class="font-normal text-[#ffefaf]">{item.value}</div>
							{/if}
						</li>
					{/each}
					<li class="inline-flex w-[400px] flex-wrap items-center pt-4">
						{#each colorBar as color}
							<div class="relative h-2 flex-1" style="background-color: {color}"></div>
						{/each}
					</li>
				</ul>
			</section>
		{:else}
			<!-- Regular Command -->
			<section
				class="relative flex flex-shrink-0 flex-grow-0 items-start justify-start self-stretch"
			>
				<div class="relative flex w-full items-center gap-2">
					<span class="flex-shrink-0 text-[#48ff05]">→</span>
					<span class="max-w-[200px] flex-shrink-0 truncate text-[#afcfff]"
						>{entry.pathname === '/' ? '~' : entry.pathname.replace('/', '')}</span
					>
					<span class="min-w-0 flex-1 text-white">{entry.command}</span>
				</div>
			</section>
			{#if entry.output}
				<section
					class="relative flex flex-shrink-0 flex-grow-0 items-start justify-start self-stretch pl-6"
				>
					<pre class="whitespace-pre-wrap text-[#e4e4e4]">{entry.output}</pre>
				</section>
			{:else if entry.lsOutput}
				<section
					class="relative flex flex-shrink-0 flex-grow-0 items-start justify-start self-stretch pl-6"
				>
					<div class="flex flex-col gap-1">
						{#each entry.lsOutput.items as item}
							<span
								class="cursor-pointer text-[#e4e4e4] hover:text-[#48ff05] hover:underline"
								onclick={() => handleLsClick(item.name, item.isDirectory, entry.pathname)}
							>
								{item.name}{item.isDirectory ? '/' : ''}
							</span>
						{/each}
					</div>
				</section>
			{/if}
		{/if}
	{/each}

	<!-- Current Input -->
	<section
		class="animate-fly-in relative flex flex-shrink-0 flex-grow-0 items-start justify-start self-stretch"
	>
		<div class="relative flex w-full items-center gap-2">
			<span class="flex-shrink-0 text-[#48ff05]">→</span>
			<span class="max-w-[200px] flex-shrink-0 truncate text-[#afcfff]"
				>{page.url.pathname === '/' ? '~' : page.url.pathname.replace('/', '')}</span
			>

			<textarea
				bind:this={textarea}
				bind:value={userInput}
				rows="1"
				class="min-w-0 flex-1 resize-none border-0 bg-transparent text-white outline-none hover:ring-0 hover:outline-none focus:ring-0 focus:outline-none"
				onkeydown={handleKeyDown}
				placeholder={`Type "help" for help`}
			></textarea>
		</div>
	</section>

	{@render children()}
</main>

<style>
	@keyframes maskReveal {
		0% {
			clip-path: inset(0 0 100% 0);
		}
		100% {
			clip-path: inset(0 0 0 0);
		}
	}
	.animate-mask-reveal {
		clip-path: inset(0 0 100% 0);
		animation: maskReveal 0.3s ease-out 0s forwards;
	}
	@keyframes flyIn {
		0% {
			transform: translateY(-400px);
			opacity: 0;
		}
		100% {
			transform: translateY(0);
			opacity: 1;
		}
	}
	.animate-fly-in {
		animation: flyIn 0.3s ease-out 0s both;
	}
</style>
