<script lang="ts">
	import { page } from '$app/state';
	import AppleIcon from '$lib/assets/icon-apple.svg';
	import BlueskyIcon from '$lib/assets/icon-bluesky.svg';
	import GithubIcon from '$lib/assets/icon-github.svg';
	import ContraIcon from '$lib/assets/icon-contra.svg';

	const currentDate = new Date();

	const formattedDate = currentDate
		.toLocaleString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		})
		.replace(/,/, '')
		.replace(/,/, ' ');

	interface NavEntry {
		label: string;
		href: string;
		params: string;
	}

	const navEntries: NavEntry[] = [
		{
			label: 'About',
			href: '/about',
			params: '?mode=manual'
		},
		{
			label: 'Gallery',
			href: '/gallery',
			params: '?mode=manual'
		},
		{
			label: 'Projects',
			href: '/projects',
			params: '?mode=manual'
		},
		{
			label: 'Blog',
			href: '/blog',
			params: '?mode=manual'
		},
		{
			label: 'Contact',
			href: '/contact',
			params: '?mode=manual'
		}
	];
</script>

<nav class="z-10 flex items-center justify-between p-2 text-[13px] max-sm:flex-col">
	<div class="flex items-center gap-2">
		<a href="/?mode=manual">
			<img src={AppleIcon} alt="Home" />
		</a>

		{#each navEntries as entry}
			<a
				href={entry.href + entry.params}
				class={`font-medium text-neutral-400 ${page.url.pathname === entry.href ? 'font-bold text-white' : ''}`}
			>
				{entry.label}
			</a>
		{/each}
	</div>
	<div class="flex items-center gap-1">
		<a href="https://bsky.app/profile/ozenui.com" target="_blank">
			<img src={BlueskyIcon} alt="Bluesky" />
		</a>
		<a href="https://github.com/ozenui/ozenui" target="_blank">
			<img src={GithubIcon} alt="GitHub" />
		</a>
		<a href="https://contra.com/ozenuidesign" target="_blank">
			<img src={ContraIcon} alt="Contra" />
		</a>

		<p class="ml-1 cursor-default font-semibold whitespace-pre text-white">
			{formattedDate}
		</p>
	</div>
</nav>

<style>
	a {
		cursor: default;
		padding: 4px;
	}
</style>
