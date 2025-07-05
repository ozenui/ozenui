<script lang="ts">
	import { page } from '$app/state';
	import { commands, history } from '$lib/components/terminal/commands';

	let neofetchRunForEmptyHistory = false;
	let manualModeCommandsRun = false;

	$effect(() => {
		// Handle 'manual' mode
		if (page.url.searchParams.get('mode') === 'manual' && !manualModeCommandsRun) {
			commands.run('clear', { fromPath: page.url.pathname });
			commands.run('neofetch', { fromPath: page.url.pathname });
			manualModeCommandsRun = true; // Mark as run
		}

		// Handle empty history
		if ($history.length === 0 && !neofetchRunForEmptyHistory) {
			commands.run('neofetch', { fromPath: page.url.pathname });
			neofetchRunForEmptyHistory = true; // Mark as run
		}
	});
</script>
