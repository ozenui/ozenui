<script lang="ts">
	import { page } from '$app/state';
	import { terminalActions } from '$lib/components/terminal/stores/terminal';

	let manualModeCommandsRun = false;

	$effect(() => {
		if (page.url.searchParams.get('mode') === 'manual' && !manualModeCommandsRun) {
			terminalActions.executeCommand('clear', page.url.pathname);
			manualModeCommandsRun = true;
		}
		terminalActions.executeCommand('neofetch', page.url.pathname);
	});
</script>
