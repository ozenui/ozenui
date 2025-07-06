import { BaseCommand } from './base';
import type { CommandContext, CommandResult } from '../types';

export class ChangeDirectoryCommand extends BaseCommand {
	name = 'cd';
	description = 'Change directory';
	usage = 'cd [directory]';

	async execute(args: string[], context: CommandContext): Promise<CommandResult> {
		const targetPath = args[0] || '/';
		const result = context.fileSystemService.navigate(context.currentPath, targetPath);

		if (!result.success) {
			return this.createErrorResult('CD_ERROR', result.error!);
		}

		return this.createSuccessResult('', [
			{
				type: 'navigation',
				data: { newPath: result.newPath }
			}
		]);
	}
}