<script lang="ts">
	import { page } from '$app/state';
	import { terminalActions } from './stores/terminal';

	let { terminalRoot } = $props<{ terminalRoot?: any }>();
	let inputElement: HTMLTextAreaElement | undefined = $state(undefined);
	let value = $state('');

	$effect(() => {
		if (inputElement && page.url.pathname) {
			setTimeout(() => {
				inputElement?.focus();
			}, 1);
		}
	});

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			terminalActions.executeCommand(value.trim(), page.url.pathname);
			value = '';
			autoGrow();
			scrollToBottom();
		}
	}

	function scrollToBottom() {
		setTimeout(() => {
			if (terminalRoot && terminalRoot.scrollToBottom) {
				terminalRoot.scrollToBottom();
			}
		}, 50);
	}

	function autoGrow() {
		if (!inputElement) return;
		inputElement.style.height = 'auto';
		inputElement.style.height = `${inputElement.scrollHeight}px`;
	}
</script>

<section class=" relative flex flex-shrink-0 flex-grow-0 items-start justify-start self-stretch">
	<div class="relative flex w-full items-center gap-2">
		<span class="flex-shrink-0 text-[#48ff05]">→</span>
		<span class="max-w-[200px] flex-shrink-0 truncate text-[#afcfff]"
			>{page.url.pathname === '/' ? '~' : page.url.pathname.split('/').pop()}</span
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
