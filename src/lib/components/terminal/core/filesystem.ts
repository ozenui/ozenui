import type {
	FileSystem,
	FileSystemNode,
	Directory,
	File,
	NavigationResult,
	DirectoryListing,
	FileContent
} from '../types';

export class FileSystemService {
	private fileSystem: FileSystem;
	private contentLoader: import('../services/content-loader').ContentLoader;

	constructor(contentLoader: import('../services/content-loader').ContentLoader) {
		this.contentLoader = contentLoader;
		this.fileSystem = this.createRoot();
	}

	private createRoot(): FileSystem {
		return {
			type: 'directory',
			name: '',
			path: '/',
			children: {}
		};
	}

	async initialize(): Promise<void> {
		await this.contentLoader.initialize();
		await this.buildFileSystem();
	}

	private async buildFileSystem(): Promise<void> {
		const modules = import.meta.glob('/src/routes/**/content.md', {
			query: '?raw',
			import: 'default'
		});

		for (const [path, resolver] of Object.entries(modules)) {
			const moduleContent = await (resolver as any)();
			const content = moduleContent;

			const match = path.match(/\/src\/routes\/(.+)\/content\.md$/);
			if (!match) continue;

			const routePath = match[1];
			const segments = routePath.split('/');

			// Handle arbitrary nesting of directories
			let currentPath = '/';
			for (let i = 0; i < segments.length; i++) {
				const segment = segments[i];
				currentPath = this.joinPath(currentPath, segment);
				this.ensureDirectory(currentPath);
			}
			this.createFile(`${currentPath}/content.md`, content);
		}
	}

	private ensureDirectory(path: string): void {
		const segments = path.split('/').filter(Boolean);
		let currentNode = this.fileSystem;

		for (const segment of segments) {
			if (!currentNode.children[segment]) {
				const newDir: Directory = {
					type: 'directory',
					name: segment,
					path: this.joinPath(currentNode.path, segment),
					children: {}
				};
				currentNode.children[segment] = newDir;
			}
			currentNode = currentNode.children[segment] as Directory;
		}
	}

	private createFile(path: string, content: string): void {
		const parentPath = path.substring(0, path.lastIndexOf('/'));
		const fileName = path.substring(path.lastIndexOf('/') + 1);

		const parentDir = this.getNode(parentPath) as Directory;
		if (parentDir && parentDir.type === 'directory') {
			const file: File = {
				type: 'file',
				name: fileName,
				path: path,
				content: content,
				mimeType: 'text/plain'
			};
			parentDir.children[fileName] = file;
		}
	}

	private joinPath(basePath: string, segment: string): string {
		if (basePath === '/') return `/${segment}`;
		return `${basePath}/${segment}`;
	}

	navigate(currentPath: string, targetPath: string): NavigationResult {
		if (!targetPath || targetPath === '~' || targetPath === '/') {
			return { success: true, newPath: '/' };
		}

		const resolvedTargetPath = targetPath.startsWith('~/') ? targetPath.substring(1) : targetPath;
		const currentSegments = currentPath.split('/').filter(Boolean);
		const targetSegments = resolvedTargetPath.split('/').filter(Boolean);
		let newSegments = [...currentSegments];

		if (resolvedTargetPath.startsWith('/')) {
			newSegments = targetSegments;
		} else {
			for (const segment of targetSegments) {
				if (segment === '..') {
					newSegments.pop();
				} else if (segment !== '.') {
					newSegments.push(segment);
				}
			}
		}

		const newPath = '/' + newSegments.join('/');
		const targetNode = this.getNode(newPath);

		if (!targetNode) {
			return {
				success: false,
				error: `cd: no such file or directory: ${resolvedTargetPath}`
			};
		}

		if (targetNode.type !== 'directory') {
			return {
				success: false,
				error: `cd: not a directory: ${resolvedTargetPath}`
			};
		}

		return { success: true, newPath };
	}

	listDirectory(path: string): DirectoryListing {
		const node = this.getNode(path);

		if (!node) {
			throw new Error(`ls: cannot access '${path}': No such file or directory`);
		}

		if (node.type !== 'directory') {
			throw new Error(`ls: cannot access '${path}': Not a directory`);
		}

		const entries = Object.values((node as Directory).children);
		return { entries, path };
	}

	getFile(path: string): FileContent | null {
		const node = this.getNode(path);

		if (!node || node.type !== 'file') {
			return null;
		}

		const file = node as File;
		if (file.content) {
			return {
				content: file.content,
				mimeType: file.mimeType
			};
		}

		return null;
	}

	private getNode(path: string): FileSystemNode | null {
		if (path === '/') return this.fileSystem;

		const segments = path.split('/').filter(Boolean);
		let currentNode: FileSystemNode = this.fileSystem;

		for (const segment of segments) {
			if (currentNode.type !== 'directory') {
				return null;
			}

			const nextNode = (currentNode as Directory).children[segment];
			if (!nextNode) {
				return null;
			}

			currentNode = nextNode;
		}

		return currentNode;
	}

	getFileSystem(): FileSystem {
		return this.fileSystem;
	}

}