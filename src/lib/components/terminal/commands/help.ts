import { BaseCommand } from './base';
import type { CommandContext, CommandResult } from '../types';

export class HelpCommand extends BaseCommand {
	name = 'help';
	description = 'Show available commands';
	usage = 'help';

	async execute(args: string[], context: CommandContext): Promise<CommandResult> {
		const output = `
Available commands:

  help      - Show this help message
  cd        - Change directory
  ls        - List files
  cat       - Display file contents
  neofetch  - Show system information
  rm        - Remove files
  clear     - Clear terminal
  `;

		return this.createSuccessResult(output);
	}
}