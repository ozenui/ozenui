import { BaseCommand } from './base';
import type { CommandContext, CommandResult } from '../types';

export class NeofetchCommand extends BaseCommand {
	name = 'neofetch';
	description = 'Show system information';
	usage = 'neofetch';

	async execute(args: string[], context: CommandContext): Promise<CommandResult> {
		return this.createSuccessResult('neofetch');
	}
}