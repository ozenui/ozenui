import { BaseCommand } from './base';
import type { CommandContext, CommandResult } from '../types';

export class RemoveCommand extends BaseCommand {
	name = 'rm';
	description = 'Remove files (playful implementation)';
	usage = 'rm <filename>';

	async execute(args: string[], context: CommandContext): Promise<CommandResult> {
		return this.createSuccessResult('😨');
	}
}