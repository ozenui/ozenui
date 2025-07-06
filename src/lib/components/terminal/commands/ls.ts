import { BaseCommand } from './base';
import type { CommandContext, CommandResult, FileSystemNode } from '../types';

export class ListCommand extends BaseCommand {
	name = 'ls';
	description = 'List files and directories';
	usage = 'ls [directory]';

	async execute(args: string[], context: CommandContext): Promise<CommandResult> {
		try {
			const targetPath = args[0] || context.currentPath;
			const listing = context.fileSystemService.listDirectory(targetPath);

			const output = listing.entries
				.map((entry: FileSystemNode) => {
					const isDir = entry.type === 'directory';
					const name = isDir ? `${entry.name}/` : entry.name;
					const fullPath = targetPath === '/' ? `/${entry.name}` : `${targetPath}/${entry.name}`;
					const href = `${isDir ? fullPath : fullPath.replace('content.md', '')}?mode=manual`;
					return `↪ <a href="${href}">${name}</a>`;
				})
				.join('\n');

			return this.createSuccessResult(output);
		} catch (error) {
			return this.createErrorResult(
				'LS_ERROR',
				error instanceof Error ? error.message : 'Failed to list directory'
			);
		}
	}
}
