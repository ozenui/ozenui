<script lang="ts">
	import { page } from '$app/state';
	import { commands } from '$lib/components/terminal/commands';

	let manualModeCommandsRun = false;

	$effect(() => {
		if (page.url.searchParams.get('mode') === 'manual' && !manualModeCommandsRun) {
			commands.run('clear', { fromPath: page.url.pathname });
			manualModeCommandsRun = true;
		}
		commands.run('neofetch', { fromPath: page.url.pathname });
	});
</script>
