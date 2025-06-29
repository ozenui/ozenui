<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Terminal from '$lib/components/widgets/Terminal.svelte';
	import Wallpaper from '$lib/assets/image-background.svg';
	import Avatar from '$lib/assets/image-avatar.webp';

	let { children } = $props();
</script>

<main class="relative h-screen w-screen overflow-hidden bg-black p-2 text-neutral-50">
	<content class="relative z-10 flex h-full w-full flex-col">
		<Navbar />

		<div class="flex h-full w-full gap-2 overflow-hidden">
			<Terminal>
				{@render children()}
			</Terminal>
		</div>
	</content>

	<img
		src={Wallpaper}
		alt="Gradient aurora wallpaper"
		class="fade-in absolute top-0 left-0 z-0 h-screen w-screen object-cover"
	/>

	<img
		src={Avatar}
		alt="Retro futuristic character with a Daft Punk helmet with a read heart painted on it."
		class="absolute right-4 bottom-0 z-0 w-[180px]"
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
