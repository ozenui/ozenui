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
	}

	const navEntries: NavEntry[] = [
		{
			label: 'ozenui',
			href: '/'
		},
		{
			label: 'About',
			href: '/about'
		},
		{
			label: 'Projects',
			href: '/projects'
		},
		{
			label: 'Blog',
			href: '/blog'
		},
		{
			label: 'Contact',
			href: '/contact'
		}
	];
</script>

<nav class="z-10 flex items-center justify-between p-2 text-[13px]">
	<div class="flex items-center gap-2">
		<a href="/?source=navbar">
			<img src={AppleIcon} alt="Home" />
		</a>

		{#each navEntries as entry}
			<a
				href={`${entry.href}?source=navbar`}
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
