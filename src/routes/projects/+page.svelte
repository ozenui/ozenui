<script lang="ts">
	import { page } from '$app/state';
	import { terminalActions } from '$lib/components/terminal/stores/terminal';

	let manualModeCommandsRun = false;

	$effect(() => {
		if (page.url.searchParams.get('mode') === 'manual' && !manualModeCommandsRun) {
			terminalActions.executeCommand('clear', page.url.pathname);
			const command = 'cd ~/projects && ls';
			terminalActions.executeCommand(command, page.url.pathname);
			manualModeCommandsRun = true;
		}
	});
</script>
