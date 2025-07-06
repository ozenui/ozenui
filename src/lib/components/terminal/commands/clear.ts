import { BaseCommand } from './base';
import type { CommandContext, CommandResult } from '../types';

export class ClearCommand extends BaseCommand {
	name = 'clear';
	description = 'Clear terminal history';
	usage = 'clear';

	async execute(args: string[], context: CommandContext): Promise<CommandResult> {
		return this.createSuccessResult('', [
			{
				type: 'history_clear',
				data: null
			}
		]);
	}
}