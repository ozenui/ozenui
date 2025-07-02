import { writable } from 'svelte/store';

export interface HistoryEntry {
	path: string;
	value: string;
	type: 'input' | 'output';
}

export const history = writable<HistoryEntry[]>([]);

function logToHistory(path: string, command: string, output: string): string {
	path = path.replace('/', '');

	if (path === '') {
		path = '~';
	}

	history.update((currentHistory) => [
		...currentHistory,
		{ path, value: command, type: 'input' },
		{ path, value: output, type: 'output' }
	]);
	return output;
}

function runHelp(path: string, command: string): string {
	const output = 'Available commands: help, ls, cd, rm, clear';
	return logToHistory(path, command, output);
}

function runLs(path: string, command: string): string {
	const output = 'file1.txt  file2.txt  folder/';
	return logToHistory(path, command, output);
}

function runCd(path: string, command: string): string {
	const output = 'Changed directory (not really)';
	return logToHistory(path, command, output);
}

function runRm(path: string, command: string): string {
	const output = 'Deleted item (not really)';
	return logToHistory(path, command, output);
}

function runClear(): string {
	history.set([]);
	return '';
}

const commandMap: Record<string, (path: string, command: string) => string> = {
	help: runHelp,
	ls: runLs,
	cd: runCd,
	rm: runRm,
	clear: runClear
};

function run(command: string, options: { fromPath: string }): string {
	const [cmd] = command.trim().split(/\s+/);
	const exec = commandMap[cmd];
	if (!exec) {
		return logToHistory(options.fromPath, command, `Unknown command: ${cmd}`);
	}
	return exec(options.fromPath, command);
}

export const commands = {
	history,
	run
};
