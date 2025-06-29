<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Wallpaper from '$lib/assets/image-background.svg';

	let { children } = $props();
</script>

<main class="relative h-screen w-screen bg-black p-2 text-neutral-50">
	<content class="relative z-10">
		<Navbar />
		{@render children()}
	</content>

	<img
		src={Wallpaper}
		alt="Gradient aurora wallpaper"
		class="fade-in absolute top-0 left-0 z-0 h-screen w-screen object-cover"
	/>
</main>

<style>
	@keyframes fadeInDelayed {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.fade-in {
		opacity: 0;
		animation: fadeInDelayed 2s ease-in-out 0s forwards;
	}
</style>
