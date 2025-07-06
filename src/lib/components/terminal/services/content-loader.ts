import type { FileContent } from '../types';

export class ContentLoader {
	private cache = new Map<string, Promise<string>>();
	private contentMap: Record<string, Record<string, string>> = {};

	async initialize(): Promise<void> {
		const modules = import.meta.glob('/src/routes/**/content.md', {
			query: '?raw',
			import: 'default'
		});

		for (const [path, importFn] of Object.entries(modules)) {
			const match = path.match(new RegExp("\\/src\\/routes\\/(.+)\\/content\\.md$"));
			if (!match) continue;

			const routePath = match[1];
			const segments = routePath.split('/');

			let currentPath = '/';
			let currentMap = this.contentMap;

			for (let i = 0; i < segments.length; i++) {
				const segment = segments[i];
				currentPath = `${currentPath === '/' ? '' : currentPath}/${segment}`;
				if (!currentMap[currentPath]) {
					currentMap[currentPath] = {};
				}
				currentMap = currentMap[currentPath];
			}
			currentMap['content.md'] = (await importFn()) as string;
		}
	}

	async loadContent(path: string): Promise<string> {
		if (!this.cache.has(path)) {
			this.cache.set(path, this.fetchContent(path));
		}
		return this.cache.get(path)!;
	}

	private async fetchContent(path: string): Promise<string> {
		const dirName = path.substring(0, path.lastIndexOf('/')) || '/';
		const fileName = path.substring(path.lastIndexOf('/') + 1);

		if (this.contentMap[dirName] && this.contentMap[dirName][fileName]) {
			return this.contentMap[dirName][fileName].trim();
		}

		throw new Error(`Content not found: ${path}`);
	}

	getFileContent(path: string): FileContent | null {
		const dirName = path.substring(0, path.lastIndexOf('/')) || '/';
		const fileName = path.substring(path.lastIndexOf('/') + 1);

		if (this.contentMap[dirName] && this.contentMap[dirName][fileName]) {
			return {
				content: this.contentMap[dirName][fileName].trim(),
				mimeType: 'text/plain'
			};
		}

		return null;
	}

	clearCache(): void {
		this.cache.clear();
	}

	getContentMap(): Record<string, Record<string, string>> {
		return { ...this.contentMap };
	}
}