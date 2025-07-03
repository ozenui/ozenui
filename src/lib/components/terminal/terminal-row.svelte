<script lang="ts">
	import type { HistoryEntry } from './commands';

	let { entry }: { entry: HistoryEntry } = $props();
</script>

<li class="relative flex flex-shrink-0 flex-grow-0 items-start justify-start self-stretch pb-0">
	{#if entry.type === 'input'}
		<div class="relative flex w-full items-center gap-2">
			<span class="flex-shrink-0 text-[#48ff05]">→</span>
			<span class="max-w-[200px] flex-shrink-0 truncate text-[#afcfff]"> {entry.path} </span>
			<span class="min-w-0 flex-1 text-white"> {entry.value} </span>
		</div>
	{:else}
		<pre class="text-[#e4e4e4]">
			{@html entry.value
				.replace(/\t/g, '')
				.replace(/\s*\n\s*/g, '')
				.replace(/\s{2,}/g, ' ')}
		</pre>
	{/if}
</li>
