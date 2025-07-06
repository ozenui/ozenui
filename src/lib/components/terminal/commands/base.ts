import type { Command, CommandContext, CommandResult } from '../types';

export abstract class BaseCommand implements Command {
	abstract name: string;
	abstract description: string;
	usage?: string;

	abstract execute(args: string[], context: CommandContext): Promise<CommandResult>;

	protected createSuccessResult(output: string, sideEffects?: any[]): CommandResult {
		return {
			success: true,
			output,
			sideEffects
		};
	}

	protected createErrorResult(code: string, message: string, details?: unknown): CommandResult {
		return {
			success: false,
			error: {
				code,
				message,
				details
			}
		};
	}

	protected validateArgs(args: string[], minArgs: number, maxArgs?: number): boolean {
		if (args.length < minArgs) {
			return false;
		}
		if (maxArgs !== undefined && args.length > maxArgs) {
			return false;
		}
		return true;
	}
}