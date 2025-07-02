<script lang="ts">
	import { page } from '$app/state';
	import { commands } from './commands';

	let inputElement: HTMLTextAreaElement | undefined = $state(undefined);
	let value = $state('');

	$effect(() => {
		if (inputElement && page.url.pathname) {
			inputElement?.focus();
		}
	});

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			commands.run(value.trim(), { fromPath: page.url.pathname });
			value = '';
			autoGrow();
		}
	}

	function autoGrow() {
		if (!inputElement) return;
		inputElement.style.height = 'auto';
		inputElement.style.height = `${inputElement.scrollHeight}px`;
	}
</script>

<section
	class="animate-fly-in relative flex flex-shrink-0 flex-grow-0 items-start justify-start self-stretch"
>
	<div class="relative flex w-full items-center gap-2">
		<span class="flex-shrink-0 text-[#48ff05]">→</span>
		<span class="max-w-[200px] flex-shrink-0 truncate text-[#afcfff]"
			>{page.url.pathname === '/' ? '~' : page.url.pathname.replace('/', '')}</span
		>

		<textarea
			bind:this={inputElement}
			bind:value
			rows="1"
			class="min-w-0 flex-1 resize-none border-0 bg-transparent text-white outline-none hover:ring-0 hover:outline-none focus:ring-0 focus:outline-none"
			onkeydown={handleKeyDown}
			oninput={autoGrow}
			placeholder={`Type "help" for help`}
		></textarea>
	</div>
</section>
