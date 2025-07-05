<script lang="ts">
	import { page } from '$app/state';
	import { commands, history } from '$lib/components/terminal/commands';

	$effect(() => {
		if (page.url.searchParams.get('mode') === 'manual') {
			commands.run('clear', { fromPath: page.url.pathname });
			commands.run('neofetch', { fromPath: page.url.pathname });
		}

		if ($history.length === 0) {
			commands.run('neofetch', { fromPath: page.url.pathname });
		}
	});
</script>
