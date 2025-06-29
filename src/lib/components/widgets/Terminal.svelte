<script lang="ts">
	import Avatar from '$lib/assets/image-avatar.webp';

	let { children } = $props();

	let textarea: HTMLTextAreaElement | undefined = $state(undefined);

	$effect(() => {
		if (textarea) {
			textarea.focus();
		}
	});

	function autoGrow() {
		if (!textarea) return;
		textarea.style.height = 'auto';
		textarea.style.height = textarea.scrollHeight + 'px';
	}
</script>

<main
	class="flex h-full w-full flex-col items-start justify-start gap-5 overflow-hidden rounded-[10px] border border-white/10 bg-white/5 p-4 text-left font-mono text-[13px] transition-all duration-300 ease-out"
>
	<section
		class="animate-mask-reveal relative inline-flex items-stretch gap-5 self-stretch overflow-hidden"
	>
		<!-- Image -->
		<div class="flex-shrink-0">
			<img class="aspect-square h-[300px] bg-[#1D1D1D] object-contain" src={Avatar} alt="Avatar" />
		</div>

		<!-- Info list -->
		<ul class="flex flex-1 flex-col justify-center gap-2">
			<li class="inline-flex items-center gap-2">
				<div class="font-normal text-[#ffefaf]">ozenui</div>
			</li>

			<li class="inline-flex items-center gap-2">
				<div class="font-normal text-[#ffefaf]">-------</div>
			</li>

			<li class="inline-flex items-center gap-2">
				<div class="font-normal text-[#ffefaf]">Name:</div>
				<div class="font-normal text-[#f7afff]">Enzo Romera</div>
			</li>

			<li class="inline-flex items-center gap-2">
				<div class="font-normal text-[#ffefaf]">Nickname:</div>
				<div class="font-normal text-[#f7afff]">ozenui</div>
			</li>

			<li class="inline-flex items-center gap-2">
				<div class="font-normal text-[#ffefaf]">Location:</div>
				<div class="font-normal text-[#f7afff]">France</div>
			</li>

			<li class="inline-flex items-center gap-2">
				<div class="font-normal text-[#ffefaf]">Languages:</div>
				<div class="font-normal text-[#f7afff]">fr, en</div>
			</li>

			<li class="inline-flex items-center gap-2">
				<div class="font-normal text-[#ffefaf]">Currently:</div>
				<div class="font-normal text-[#f7afff]">Design engineer @ FullEnrich</div>
			</li>

			<li class="inline-flex items-center gap-2">
				<div class="font-normal text-[#ffefaf]">Previously:</div>
				<div class="font-normal text-[#f7afff]">Design engineer @ Sesterce</div>
			</li>

			<li class="inline-flex items-center gap-2">
				<div class="font-normal text-[#ffefaf]">Side project:</div>
				<div class="font-normal text-[#f7afff]">Blurr (more soon)</div>
			</li>

			<li class="inline-flex items-center gap-2">
				<div class="font-normal text-[#ffefaf]">Freelance seats:</div>
				<div class="font-normal text-[#f7afff]">1/1</div>
			</li>

			<li class="inline-flex w-[400px] flex-wrap items-center pt-4">
				{#each ['#ff0000', '#ff9000', '#ffdd00', '#94ff00', '#26ff00', '#00ffa1', '#00fffa', '#00bbff', '#0050ff', '#4c00ff', '#8800ff', '#cc00ff', '#ff00d4', '#ff006e', 'white', '#e4e4e4', '#b0b0b0', '#434343', 'black'] as color}
					<div class="relative h-2 flex-1" style="background-color: {color}"></div>
				{/each}
			</li>
		</ul>
	</section>

	<section
		class="animate-fly-in relative flex flex-shrink-0 flex-grow-0 items-start justify-start gap-2 self-stretch"
	>
		<p class="flex-shrink-0 flex-grow-0 text-[#48ff05]">→</p>
		<p class="flex-shrink-0 flex-grow-0 text-[#afcfff]">ozenui</p>
		<textarea
			bind:this={textarea}
			rows="1"
			class="w-full resize-none border-0 bg-transparent outline-none hover:ring-0 hover:outline-none focus:ring-0 focus:outline-none"
			oninput={autoGrow}
		></textarea>
	</section>

	{@render children()}
</main>

<style>
	@keyframes maskReveal {
		0% {
			clip-path: inset(0 0 100% 0);
		}
		100% {
			clip-path: inset(0 0 0 0);
		}
	}

	.animate-mask-reveal {
		clip-path: inset(0 0 100% 0);
		animation: maskReveal 0.3s ease-out 0s forwards;
	}

	@keyframes flyIn {
		0% {
			transform: translateY(-400px);
			opacity: 0;
		}
		100% {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.animate-fly-in {
		animation: flyIn 0.3s ease-out 0s both;
	}
</style>
