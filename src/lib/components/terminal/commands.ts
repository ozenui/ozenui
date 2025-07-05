import { writable } from 'svelte/store';
import { getContentMaps } from './filesystem';
import { goto } from '$app/navigation';

export interface HistoryEntry {
	path: string;
	value: string;
	type: 'input' | 'output';
}

export const history = writable<HistoryEntry[]>([]);

let fileSystemMap: Record<string, any> = {};
let contentMap: Record<string, Record<string, string>> = {};

getContentMaps().then((maps) => {
	fileSystemMap = maps.fileSystemMap;
	contentMap = maps.contentMap;
});

function logHistory(path: string, command: string, output: string | undefined): void {
	const displayPath = path === '/' ? '~' : path.substring(1);

	history.update((currentHistory) => [...currentHistory, { path: displayPath, value: command, type: 'input' }]);

	if (output) {
		history.update((currentHistory) => [
			...currentHistory,
			{ path: displayPath, value: output, type: 'output' }
		]);
	}
}

function runHelp(): string {
	return `
Available commands:

  help      - Show this help message
  cd        - Change directory
  ls        - List files
  cat       - Display file contents
  neofetch  - Show system information
  rm        - Remove files
  clear     - Clear terminal`;
}

function runNeofetch(): string {
	return 'neofetch';
}

function runLs(path: string): string {
	const segments = path.split('/').filter(Boolean);
	let currentNode = fileSystemMap['/'];

	if (!currentNode) {
		return `ls: cannot access '${path}': Filesystem not loaded`;
	}

	for (const segment of segments) {
		if (currentNode && currentNode.type === 'directory' && currentNode.children[segment]) {
			currentNode = currentNode.children[segment];
		} else {
			return `ls: cannot access '${path}': No such file or directory`;
		}
	}

	if (currentNode.type !== 'directory') {
		return `ls: cannot access '${path}': Not a directory`;
	}

	return (
		'\n' +
		Object.keys(currentNode.children)
			.map((key) => {
				const name = currentNode.children[key].type === 'directory' ? `${key}/` : key;
				return `  ${name}`;
			})
			.join('\n')
	);
}

function executeCd(
	path: string,
	command: string,
	fsMap: Record<string, any>
): { newPath: string | null; error: string | null } {
	const targetPath = command.split(' ')[1];

	if (!targetPath || targetPath === '~' || targetPath === '/') {
		return { newPath: '/', error: null };
	}

	const resolvedTargetPath = targetPath.startsWith('~/') ? targetPath.substring(1) : targetPath;
	const currentSegments = path.split('/').filter(Boolean);
	const targetSegments = resolvedTargetPath.split('/').filter(Boolean);
	let newSegments = [...currentSegments];

	if (resolvedTargetPath.startsWith('/')) {
		newSegments = targetSegments;
	} else {
		for (const segment of targetSegments) {
			if (segment === '..') {
				newSegments.pop();
			} else if (segment !== '.') {
				newSegments.push(segment);
			}
		}
	}

	const newPath = '/' + newSegments.join('/');

	let currentNode = fsMap['/'];
	for (const segment of newSegments) {
		if (currentNode && currentNode.type === 'directory' && currentNode.children[segment]) {
			currentNode = currentNode.children[segment];
		} else {
			return { newPath: null, error: `cd: no such file or directory: ${resolvedTargetPath}` };
		}
	}

	if (currentNode.type === 'directory') {
		return { newPath, error: null };
	} else {
		return { newPath: null, error: `cd: not a directory: ${resolvedTargetPath}` };
	}
}

function runCat(path: string, command: string): string {
	const filePath = command.split(' ')[1];
	if (!filePath) {
		return 'cat: missing operand';
	}

	const fullPath = path === '/' ? `/${filePath}` : `${path}/${filePath}`;
	const dirName = fullPath.substring(0, fullPath.lastIndexOf('/')) || '/';
	const fileName = fullPath.substring(fullPath.lastIndexOf('/') + 1);

	if (contentMap[dirName] && contentMap[dirName][fileName]) {
		return contentMap[dirName][fileName];
	} else {
		return `cat: ${filePath}: No such file or directory`;
	}
}

function runRm(): string {
	return 'Deleted item (not really)';
}

function runClear(): string {
	history.set([]);
	return '';
}

const commandMap: Record<string, (path: string, command: string) => string> = {
	help: (_path, _command) => runHelp(),
	neofetch: (_path, _command) => runNeofetch(),
	ls: runLs,
	cat: runCat,
	rm: (_path, _command) => runRm(),
	clear: (_path, _command) => runClear()
};

async function run(command: string, options: { fromPath: string }): Promise<void> {
	const fullCommand = command.trim();

	if (fullCommand === 'clear') {
		history.set([]);
		return;
	}

	let currentPath = options.fromPath;
	let output = '';
	let pathHasChanged = false;

	const commandsToRun = fullCommand
		.split('&&')
		.map((c) => c.trim())
		.filter((c) => c);

	for (const cmdStr of commandsToRun) {
		const [cmdName] = cmdStr.split(/\s+/);

		if (cmdName === 'cd') {
			const { newPath, error } = executeCd(currentPath, cmdStr, fileSystemMap);
			if (newPath !== null) {
				currentPath = newPath;
				pathHasChanged = true;
			} else {
				output = error || 'An unknown error occurred with cd.';
				// On failure, log and stop.
				logHistory(options.fromPath, fullCommand, output);
				// if path changed before failure, update url
				if (pathHasChanged) await goto(currentPath);
				return;
			}
		} else {
			const exec = commandMap[cmdName];
			if (exec) {
				output = exec(currentPath, cmdStr);
			} else {
				output = `Unknown command: ${cmdName}`;
				logHistory(options.fromPath, fullCommand, output);
				if (pathHasChanged) await goto(currentPath);
				return;
			}
		}
	}

	logHistory(options.fromPath, fullCommand, output);

	if (pathHasChanged) {
		await goto(currentPath);
	}
}

export const commands = {
	history,
	run
};