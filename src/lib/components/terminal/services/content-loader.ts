import type { FileContent } from '../types';

export class ContentLoader {
	private cache = new Map<string, Promise<string>>();
	private contentMap: Record<string, Record<string, string>> = {};

	async initialize(): Promise<void> {
		const modules = import.meta.glob('/src/routes/**/content.txt', {
			query: '?raw',
			import: 'default'
		});

		for (const [path, importFn] of Object.entries(modules)) {
			const match = path.match(/\/src\/routes\/(.+)\/content\.txt$/);
			if (!match) continue;

			const routePath = match[1];
			const segments = routePath.split('/');

			if (segments.length === 1) {
				const directory = segments[0];
				if (!this.contentMap[`/${directory}`]) {
					this.contentMap[`/${directory}`] = {};
				}
				this.contentMap[`/${directory}`]['content.txt'] = (await importFn()) as string;
			} else if (segments.length >= 2) {
				const directory = segments[0];
				const slug = segments[1];

				if (!this.contentMap[`/${directory}`]) {
					this.contentMap[`/${directory}`] = {};
				}

				if (directory === 'blog') {
					const subPath = `/${directory}/${slug}`;
					if (!this.contentMap[subPath]) {
						this.contentMap[subPath] = {};
					}
					this.contentMap[subPath]['content.txt'] = (await importFn()) as string;
				} else {
					const filename = `${slug}.txt`;
					this.contentMap[`/${directory}`][filename] = (await importFn()) as string;
				}
			}
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