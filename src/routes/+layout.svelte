<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import '../app.css';

	let { children } = $props();
</script>

{@render children()}

<main class="h-screen w-screen bg-black p-2 text-neutral-50">
	<Navbar></Navbar>
</main>
