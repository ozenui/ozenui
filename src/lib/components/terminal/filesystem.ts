export async function getContentMaps() {
	// Get all available routes from Vite's glob import
	const modules = import.meta.glob('/src/routes/**/content.txt', {
		query: '?raw',
		import: 'default'
	});

	const contentMap: Record<string, Record<string, string>> = {};
	const fileSystemMap: Record<string, any> = {
		'/': {
			type: 'directory',
			children: {}
		}
	};

	for (const [path, importFn] of Object.entries(modules)) {
		const match = path.match(/\/src\/routes\/(.+)\/content\.txt$/);
		if (!match) continue;

		const routePath = match[1];
		const segments = routePath.split('/');

		if (segments.length === 1) {
			const directory = segments[0];

			// Initialize directory in content map
			if (!contentMap[`/${directory}`]) {
				contentMap[`/${directory}`] = {};
			}

			// Initialize directory in filesystem
			if (!fileSystemMap['/'].children[directory]) {
				fileSystemMap['/'].children[directory] = {
					type: 'directory',
					children: {}
				};
			}

			// Add content.txt file
			contentMap[`/${directory}`]['content.txt'] = (await importFn()) as string;
			fileSystemMap['/'].children[directory].children['content.txt'] = { type: 'file' };
		} else if (segments.length >= 2) {
			const directory = segments[0];
			const slug = segments[1];

			// Initialize directory in content map
			if (!contentMap[`/${directory}`]) {
				contentMap[`/${directory}`] = {};
			}

			// Initialize directory in filesystem
			if (!fileSystemMap['/'].children[directory]) {
				fileSystemMap['/'].children[directory] = {
					type: 'directory',
					children: {}
				};
			}

			if (directory === 'blog') {
				// Create blog post subdirectory
				fileSystemMap['/'].children[directory].children[slug] = {
					type: 'directory',
					children: {
						'content.txt': { type: 'file' }
					}
				};

				// Add content to the subdirectory path
				const subPath = `/${directory}/${slug}`;
				if (!contentMap[subPath]) {
					contentMap[subPath] = {};
				}
				contentMap[subPath]['content.txt'] = (await importFn()) as string;
			} else {
				const filename = `${slug}.txt`;
				contentMap[`/${directory}`][filename] = (await importFn()) as string;
				fileSystemMap['/'].children[directory].children[filename] = { type: 'file' };
			}
		}
	}

	return { contentMap, fileSystemMap };
}
