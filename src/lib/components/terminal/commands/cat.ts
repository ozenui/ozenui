import { BaseCommand } from './base';
import type { CommandContext, CommandResult } from '../types';

export class CatCommand extends BaseCommand {
	name = 'cat';
	description = 'Display file contents';
	usage = 'cat <filename>';

	async execute(args: string[], context: CommandContext): Promise<CommandResult> {
		if (!this.validateArgs(args, 1, 1)) {
			return this.createErrorResult('CAT_ERROR', 'cat: missing operand');
		}

		const fileName = args[0];
		const filePath = context.currentPath === '/' ? `/${fileName}` : `${context.currentPath}/${fileName}`;
		
		const fileContent = context.fileSystemService.getFile(filePath);

		if (!fileContent) {
			return this.createErrorResult('CAT_ERROR', `cat: ${fileName}: No such file or directory`);
		}

		return this.createSuccessResult(fileContent.content);
	}
}