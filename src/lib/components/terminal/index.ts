import Terminal from './Terminal.svelte';
import Row from './terminal-row.svelte';
import Input from './terminal-input.svelte';
import Hero from './terminal-hero.svelte';

export type * from './types';
export {
	terminalActions,
	terminalService,
	terminalState
} from './stores/terminal';
export { createDefaultCommandRegistry } from './commands/index';
export { FileSystemService } from './core/filesystem';
export { CommandRegistry } from './core/command-registry';
export { ContentLoader } from './services/content-loader';

export {
	Terminal,
	Hero,
	Row,
	Input,
	//
	Terminal as Root,
	Hero as TerminalHero,
	Row as TerminalRow,
	Input as TerminalInput
};
