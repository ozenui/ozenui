<script lang="ts">
	import { history, type HistoryEntry } from './commands';
	import TerminalHero from './terminal-hero.svelte';

	let { entry }: { entry: HistoryEntry } = $props();
</script>

{#snippet commandLine()}
	<div class="relative flex w-full items-center gap-2">
		<span class="flex-shrink-0 text-[#48ff05]">→</span>
		<span class="max-w-[200px] flex-shrink-0 truncate text-[#afcfff]"> {entry.path} </span>
		<span class="min-w-0 flex-1 text-white"> {entry.value} </span>
	</div>
{/snippet}

{#if entry.value === 'neofetch'}
	{#if entry.type === 'input'}
		{#if $history.length > 2 && entry !== $history[0]}
			{@render commandLine()}
		{/if}
	{:else}
		<TerminalHero />
	{/if}
{:else}
	<li class="relative flex flex-shrink-0 flex-grow-0 items-start justify-start self-stretch pb-0">
		{#if entry.type === 'input'}
			{@render commandLine()}
		{:else}
			<pre class="text-[#e4e4e4]">
				{@html entry.value}
			</pre>
		{/if}
	</li>
{/if}
