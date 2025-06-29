<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Terminal from '$lib/components/widgets/Terminal.svelte';

	let { children } = $props();
</script>

<main class="relative h-screen w-screen overflow-hidden bg-black p-2 text-neutral-50">
	<content class="relative z-10 flex h-full w-full flex-col gap-2">
		<Navbar />
		<Terminal>
			{@render children()}
		</Terminal>
	</content>
</main>
