import { fileSystem, type FileSystemNode } from './filesystem.js';

export function resolvePath(path: string, currentPath: string): string {
	if (path === '~') {
		return '/';
	}

	if (path === '..') {
		return getParentPath(currentPath);
	}

	if (path.startsWith('../')) {
		const relativePath = path.replace('../', '');
		const parentPath = getParentPath(currentPath);
		return relativePath ? `${parentPath}/${relativePath}`.replace('//', '/') : parentPath;
	}

	if (path.startsWith('/')) {
		return path;
	}

	// For relative paths, append to current directory
	if (currentPath === '/') {
		return `/${path}`;
	} else {
		return `${currentPath}/${path}`;
	}
}

export function getParentPath(currentPath: string): string {
	return currentPath.split('/').slice(0, -1).join('/') || '/';
}

export function getCurrentDirectory(path: string): FileSystemNode | null {
	if (path === '/') return fileSystem['/'];
	
	const parts = path.split('/').filter(Boolean);
	let current = fileSystem['/'];
	
	for (const part of parts) {
		if (current.type === 'directory' && current.children && current.children[part]) {
			current = current.children[part];
		} else {
			return null;
		}
	}
	return current;
}