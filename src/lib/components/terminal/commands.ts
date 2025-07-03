import { writable } from 'svelte/store';

export interface HistoryEntry {
	path: string;
	value: string;
	type: 'input' | 'output';
}

export const history = writable<HistoryEntry[]>([]);

export function logToHistory(path: string, command: string, output: string | undefined): void {
	path = path.replace('/', '');

	if (path === '') {
		path = '~';
	}

	history.update((currentHistory) => [...currentHistory, { path, value: command, type: 'input' }]);

	if (output) {
		history.update((currentHistory) => [
			...currentHistory,
			{ path, value: output, type: 'output' }
		]);
	}

	return;
}

function runHelp(path: string, command: string): void {
	const output = 'Available commands: help, ls, cd, rm, clear';
	logToHistory(path, command, output);
	return;
}

function runLs(path: string, command: string): void {
	const output = 'file1.txt  file2.txt  folder/';
	logToHistory(path, command, output);
	return;
}

function runCd(path: string, command: string): void {
	logToHistory(path, command, undefined);
	return;
}

function runRm(path: string, command: string): void {
	const output = 'Deleted item (not really)';
	logToHistory(path, command, output);
	return;
}

function runClear(): void {
	history.set([]);
	return;
}

const commandMap: Record<string, (path: string, command: string) => string | void> = {
	help: runHelp,
	ls: runLs,
	cd: runCd,
	rm: runRm,
	clear: runClear
};

function run(command: string, options: { fromPath: string }): string | void {
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
