<script lang="ts">
	const { children } = $props();
	
	let terminalContainer: HTMLElement | undefined = $state(undefined);
	
	export function scrollToBottom() {
		if (terminalContainer) {
			terminalContainer.scrollTop = terminalContainer.scrollHeight;
		}
	}
</script>

<main
	bind:this={terminalContainer}
	class="flex h-full w-full cursor-text flex-col items-start justify-start gap-0 overflow-auto rounded-[10px] border border-white/10 bg-white/5 p-4 text-left font-mono text-[13px] transition-all duration-300 ease-out"
>
	{@render children()}
</main>
