<script lang="ts">
	import '../app.css';
	import { commands } from '$lib/components/terminal/commands';
	import Navbar from '$lib/components/navbar/navbar.svelte';
	import * as Terminal from '$lib/components/terminal';

	let { children } = $props();
</script>

<main class="relative h-screen w-screen overflow-hidden bg-black p-2 text-neutral-50">
	<content class="relative z-10 flex h-full w-full flex-col gap-2">
		<Navbar />
		<Terminal.Root>
			{#each commands.history as entry}
				<Terminal.Row {entry}></Terminal.Row>
			{/each}
			{@render children()}
			<Terminal.Input></Terminal.Input>
		</Terminal.Root>
	</content>
</main>
