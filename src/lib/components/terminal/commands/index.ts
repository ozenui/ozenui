export { BaseCommand } from './base';
export { ListCommand } from './ls';
export { ChangeDirectoryCommand } from './cd';
export { CatCommand } from './cat';
export { HelpCommand } from './help';
export { NeofetchCommand } from './neofetch';
export { RemoveCommand } from './rm';
export { ClearCommand } from './clear';

import { CommandRegistry } from '../core/command-registry';
import { ListCommand } from './ls';
import { ChangeDirectoryCommand } from './cd';
import { CatCommand } from './cat';
import { HelpCommand } from './help';
import { NeofetchCommand } from './neofetch';
import { RemoveCommand } from './rm';
import { ClearCommand } from './clear';

export function createDefaultCommandRegistry(): CommandRegistry {
	const registry = new CommandRegistry();

	registry.register(new HelpCommand());
	registry.register(new ListCommand());
	registry.register(new ChangeDirectoryCommand());
	registry.register(new CatCommand());
	registry.register(new NeofetchCommand());
	registry.register(new RemoveCommand());
	registry.register(new ClearCommand());

	return registry;
}