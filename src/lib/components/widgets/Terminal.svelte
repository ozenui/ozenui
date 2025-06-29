<script lang="ts">
	import Avatar from '$lib/assets/image-avatar.webp';
	let { children } = $props();
	let textarea: HTMLTextAreaElement | undefined = $state(undefined);
	let userInput = $state('');

	const infoItems = [
		{ label: '', value: 'ozenui' },
		{ label: '', value: '-------' },
		{ label: 'Name:', value: 'Enzo Romera' },
		{ label: 'Nickname:', value: 'ozenui' },
		{ label: 'Location:', value: 'France' },
		{ label: 'Languages:', value: 'fr, en' },
		{ label: 'Position:', value: 'Design engineer' },
		{ label: 'Current company:', value: 'FullEnrich' },
		{ label: 'Previou company:', value: 'Sesterce' },
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

	$effect(() => {
		if (textarea) {
			textarea.focus();
		}
	});

	function autoGrow() {
		if (!textarea) return;
		textarea.style.height = 'auto';
		textarea.style.height = textarea.scrollHeight + 'px';
	}

	function handleInput(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		userInput = target.value;
		autoGrow();
	}

	function handleKeyDown(event: KeyboardEvent) {
		const target = event.target as HTMLTextAreaElement;

		if (
			(event.key === 'Backspace' || event.key === 'Delete') &&
			(target.selectionStart === 0 || target.selectionEnd === 0)
		) {
			event.preventDefault();
			return;
		}

		if (event.key === 'Enter') {
			event.preventDefault();
			userInput = '';
			autoGrow();
		}

		if (event.key === 'Home' || (event.ctrlKey && event.key === 'a')) {
			event.preventDefault();
			target.setSelectionRange(0, target.value.length);
		}
	}

	function handlePaste(event: ClipboardEvent) {
		const target = event.target as HTMLTextAreaElement;
		if (target.selectionStart === 0 && target.selectionEnd === 0) {
			setTimeout(() => {
				target.setSelectionRange(0, 0);
			}, 0);
		}
	}
</script>

<main
	class="flex h-full w-full cursor-text flex-col items-start justify-start gap-5 overflow-hidden rounded-[10px] border border-white/10 bg-white/5 p-4 text-left font-mono text-[13px] transition-all duration-300 ease-out"
>
	<section
		class="animate-mask-reveal relative inline-flex items-stretch gap-5 self-stretch overflow-hidden"
	>
		<img class="aspect-square h-[300px] bg-[#1D1D1D] object-contain" src={Avatar} alt="Avatar" />
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

	<section
		class="animate-fly-in relative flex flex-shrink-0 flex-grow-0 items-start justify-start self-stretch"
	>
		<div class="relative w-full">
			<div class="pointer-events-none absolute top-0 left-0 z-10 flex items-start space-x-2">
				<span class="text-[#48ff05]">→</span>
				<span class="text-[#afcfff]">ozenui</span>
				<span class="text-white">$</span>
			</div>

			<textarea
				bind:this={textarea}
				bind:value={userInput}
				rows="1"
				class="w-full resize-none border-0 bg-transparent text-white outline-none hover:ring-0 hover:outline-none focus:ring-0 focus:outline-none"
				oninput={handleInput}
				onkeydown={handleKeyDown}
				onpaste={handlePaste}
				placeholder={`Type "help" for help`}
				style="padding-left: 88px;"
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
