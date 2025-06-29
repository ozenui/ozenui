export interface FileSystemNode {
	type: 'file' | 'directory';
	children?: Record<string, FileSystemNode>;
}

export const fileSystem: Record<string, FileSystemNode> = {
	'/': {
		type: 'directory',
		children: {
			about: {
				type: 'directory',
				children: {
					'info.txt': { type: 'file' }
				}
			},
			projects: {
				type: 'directory',
				children: {
					'portfolio.txt': { type: 'file' }
				}
			},
			blog: {
				type: 'directory',
				children: {
					'linux-designers.txt': { type: 'file' }
				}
			},
			contact: {
				type: 'directory',
				children: {
					'details.txt': { type: 'file' }
				}
			}
		}
	}
};