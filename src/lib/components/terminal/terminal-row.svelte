<script lang="ts">
	import { type HistoryEntry } from './types';
	import TerminalHero from './terminal-hero.svelte';
	import { marked } from 'marked';

	let { entry }: { entry: HistoryEntry } = $props();

	function isMarkdownContent(value: string): boolean {
		return /#{1,6}\s|\[.*\]\(.*\)|`.*`|\*\*.*\*\*|_.*_|^\*|^-|^>/.test(value);
	}

	function processContent(value: string): string {
		if (isMarkdownContent(value)) {
			const html = marked.parse(value, {
				breaks: true,
				gfm: true
			}) as string;
			return html
				.replace(/<p>/g, '')
				.replace(/<\/p>/g, '<br>')
				.replace(/<br><br>/g, '<br>');
		}
		return value;
	}
</script>

{#snippet commandLine()}
	<div class="relative flex w-full items-start gap-2">
		<span class="flex-shrink-0 text-[#48ff05]">→</span>
		<span class="max-w-[200px] flex-shrink-0 truncate text-[#afcfff]"> {entry.path} </span>
		<span class="min-w-0 flex-1 text-white"> {entry.value} </span>
	</div>
{/snippet}

{#if entry.value === 'neofetch'}
	{#if entry.type === 'output'}
		<TerminalHero />
	{/if}
{:else}
	<li class="relative flex flex-shrink-0 flex-grow-0 items-start justify-start self-stretch pb-0">
		{#if entry.type === 'input'}
			{@render commandLine()}
		{:else}
			<div
				class="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-[#e4e4e4] [img]:h-auto [img]:w-full [img]:max-w-[100px]"
			>
				{@html processContent(entry.value)}
			</div>
		{/if}
	</li>
{/if}
