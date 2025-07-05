<script lang="ts">
	import { page } from '$app/state';
	import { commands, logToHistory } from '$lib/components/terminal/commands';
	import Content from './content.txt?raw';

	$effect(() => {
		if (page.url.searchParams.get('mode') === 'manual') {
			commands.run('clear', { fromPath: page.url.pathname });
			const command = 'cd ~/contact && cat content.txt';
			const output = Content;
			logToHistory(page.url.pathname, command, output);
		}
	});
</script>
