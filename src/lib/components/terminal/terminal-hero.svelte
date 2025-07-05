<script lang="ts">
	import Avatar from '$lib/assets/image-avatar.webp';

	const infoItems = [
		{ label: '', value: 'ozenui' },
		{ label: '', value: '-------' },
		{ label: 'Name:', value: 'Enzo Romera' },
		{ label: 'Nickname:', value: 'ozenui' },
		{ label: 'Location:', value: 'France' },
		{ label: 'Languages:', value: 'fr, en' },
		{ label: 'Position:', value: 'Design engineer' },
		{ label: 'Currently at:', value: 'FullEnrich' },
		{ label: 'Previously at:', value: 'Sesterce' },
		{ label: 'Freelance seats:', value: '1/1' }
	];

	const colorBar = [
		'#ff0000',
		'#ff9000',
		'#ffdd00',
		'#94ff00',
		'#26ff00',
		'#00ffa1',
		'#00fffa',
		'#00bbff',
		'#0050ff',
		'#4c00ff',
		'#8800ff',
		'#cc00ff',
		'#ff00d4',
		'#ff006e',
		'white',
		'#e4e4e4',
		'#b0b0b0',
		'#434343',
		'black'
	];
</script>

<section class="animate-mask-reveal relative mb-2 inline-flex gap-4">
	<img class="aspect-square h-[300px] bg-[#1D1D1D] object-contain" src={Avatar} alt="Avatar" />
	<ul class="flex flex-1 flex-col justify-center gap-2">
		{#each infoItems as item}
			<li class="inline-flex items-center gap-2">
				{#if item.label}
					<div class="font-normal text-[#ffefaf]">{item.label}</div>
					<div class="font-normal text-[#f7afff]">{item.value}</div>
				{:else}
					<div class="font-normal text-[#ffefaf]">{item.value}</div>
				{/if}
			</li>
		{/each}
		<li class="inline-flex w-[400px] flex-wrap items-center pt-4">
			{#each colorBar as color}
				<div class="relative h-2 flex-1" style="background-color: {color}"></div>
			{/each}
		</li>
	</ul>
</section>
