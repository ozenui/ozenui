<script lang="ts">
	import '../app.css';
	import { terminalState, terminalActions } from '$lib/components/terminal/stores/terminal';
	import Navbar from '$lib/components/navbar/navbar.svelte';
	import * as Terminal from '$lib/components/terminal';

	let { children } = $props();
	let terminalRoot: any = $state(undefined);

	// Initialize terminal on mount
	$effect(() => {
		terminalActions.initialize();
	});
</script>

<main class="relative h-screen w-screen overflow-hidden bg-black p-2 text-neutral-50">
	<content class="relative z-10 flex h-full w-full flex-col gap-2">
		<Navbar />
		<Terminal.Root bind:this={terminalRoot}>
			<ul>
				{#each $terminalState.history as entry}
					<Terminal.Row {entry} />
				{/each}
			</ul>

			{@render children()}

			<Terminal.Input {terminalRoot} />
		</Terminal.Root>
	</content>
</main>
