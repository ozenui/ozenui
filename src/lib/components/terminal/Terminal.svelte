<script lang="ts">
	import { commands } from './commands';
	import TerminalRow from './terminal-row.svelte';
	import TerminalInput from './terminal-input.svelte';
</script>

<main
	class="flex h-full w-full cursor-text flex-col items-start justify-start gap-2 overflow-auto rounded-[10px] border border-white/10 bg-white/5 p-4 text-left font-mono text-[13px] transition-all duration-300 ease-out"
>
	{#each commands.history as entry}
		<TerminalRow {entry}></TerminalRow>
	{/each}
	<TerminalInput></TerminalInput>
</main>
