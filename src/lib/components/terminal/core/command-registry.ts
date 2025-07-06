import type { Command, CommandContext, CommandResult, CommandRegistry as ICommandRegistry, ParsedCommand } from '../types';

export class CommandRegistry implements ICommandRegistry {
	private commands = new Map<string, Command>();

	register(command: Command): void {
		this.commands.set(command.name, command);
	}

	unregister(name: string): void {
		this.commands.delete(name);
	}

	async execute(input: string, context: CommandContext): Promise<CommandResult> {
		const parsed = this.parseCommand(input);
		
		if (!parsed) {
			return {
				success: false,
				error: {
					code: 'EMPTY_COMMAND',
					message: 'No command provided'
				}
			};
		}

		const command = this.commands.get(parsed.name);
		
		if (!command) {
			return {
				success: false,
				error: {
					code: 'UNKNOWN_COMMAND',
					message: `Unknown command: ${parsed.name}`
				}
			};
		}

		try {
			return await command.execute(parsed.args, context);
		} catch (error) {
			return {
				success: false,
				error: {
					code: 'COMMAND_ERROR',
					message: error instanceof Error ? error.message : 'Unknown error occurred',
					details: error
				}
			};
		}
	}

	getCommand(name: string): Command | undefined {
		return this.commands.get(name);
	}

	listCommands(): Command[] {
		return Array.from(this.commands.values());
	}

	private parseCommand(input: string): ParsedCommand | null {
		const trimmed = input.trim();
		if (!trimmed) return null;

		const parts = trimmed.split(/\s+/);
		const name = parts[0];
		const args = parts.slice(1);

		return {
			name,
			args,
			rawInput: input
		};
	}

	// Support for command chaining with &&
	async executeChain(input: string, context: CommandContext): Promise<CommandResult[]> {
		const commands = input.split('&&').map(cmd => cmd.trim()).filter(cmd => cmd);
		const results: CommandResult[] = [];

		for (const commandStr of commands) {
			const result = await this.execute(commandStr, context);
			results.push(result);

			// Stop execution if a command fails
			if (!result.success) {
				break;
			}

			// Apply side effects before next command
			if (result.sideEffects) {
				for (const sideEffect of result.sideEffects) {
					if (sideEffect.type === 'navigation' && sideEffect.data?.newPath) {
						context.currentPath = sideEffect.data.newPath;
					}
				}
			}
		}

		return results;
	}
}