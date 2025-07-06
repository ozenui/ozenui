import { writable } from 'svelte/store';
import type { TerminalState, TerminalConfig, HistoryEntry, CommandContext } from '../types';
import { FileSystemService } from '../core/filesystem';
import { ContentLoader } from '../services/content-loader';
import { createDefaultCommandRegistry } from '../commands/index';
import { goto } from '$app/navigation';

const defaultConfig: TerminalConfig = {
	maxHistorySize: 1000,
	autoScroll: true,
	promptSymbol: '→',
	defaultPath: '/'
};

const initialState: TerminalState = {
	history: [],
	currentPath: '/',
	fileSystem: null,
	loading: false,
	error: null
};

export const terminalState = writable<TerminalState>(initialState);

class TerminalService {
	private contentLoader: ContentLoader;
	private fileSystemService: FileSystemService;
	private commandRegistry: ReturnType<typeof createDefaultCommandRegistry>;
	private config: TerminalConfig;

	constructor(config: Partial<TerminalConfig> = {}) {
		this.config = { ...defaultConfig, ...config };
		this.contentLoader = new ContentLoader();
		this.fileSystemService = new FileSystemService(this.contentLoader);
		this.commandRegistry = createDefaultCommandRegistry();
	}

	async initialize(): Promise<void> {
		this.updateState({ loading: true });

		try {
			await this.contentLoader.initialize();
			await this.fileSystemService.initialize();

			this.updateState({
				fileSystem: this.fileSystemService.getFileSystem(),
				loading: false,
				error: null
			});
		} catch (error) {
			this.updateState({
				loading: false,
				error: error instanceof Error ? error.message : 'Failed to initialize terminal'
			});
		}
	}

	async executeCommand(input: string, currentPath: string): Promise<void> {
		const trimmedInput = input.trim();
		if (!trimmedInput) return;

		if (trimmedInput === 'clear') {
			this.clearHistory();
			return;
		}

		this.addToHistory({
			path: this.formatPath(currentPath),
			value: trimmedInput,
			type: 'input',
			timestamp: new Date()
		});

		try {
			const context: CommandContext = {
				currentPath,
				fileSystem: this.fileSystemService.getFileSystem(),
				contentLoader: this.contentLoader,
				history: this.getHistory(),
				fileSystemService: this.fileSystemService
			};

			// Handle command chaining
			const results = await this.commandRegistry.executeChain(trimmedInput, context);
			let hasNavigated = false;

			for (const result of results) {
				if (result.success && result.output) {
					this.addToHistory({
						path: this.formatPath(currentPath),
						value: result.output,
						type: 'output',
						timestamp: new Date()
					});
				} else if (!result.success && result.error) {
					this.addToHistory({
						path: this.formatPath(currentPath),
						value: result.error.message,
						type: 'output',
						timestamp: new Date()
					});
				}

				// Handle side effects
				if (result.sideEffects) {
					for (const sideEffect of result.sideEffects) {
						if (sideEffect.type === 'navigation' && sideEffect.data?.newPath) {
							currentPath = sideEffect.data.newPath;
							hasNavigated = true;
						} else if (sideEffect.type === 'history_clear') {
							this.clearHistory();
						}
					}
				}

				// Stop on first failure
				if (!result.success) break;
			}

			// Navigate if path changed
			if (hasNavigated) {
				this.updateState({ currentPath });
				await goto(currentPath);
			}
		} catch (error) {
			this.addToHistory({
				path: this.formatPath(currentPath),
				value: error instanceof Error ? error.message : 'Unknown error occurred',
				type: 'output',
				timestamp: new Date()
			});
		}
	}

	private formatPath(path: string): string {
		const segments = path.split('/').filter(Boolean);
		return segments.length > 0 ? segments[segments.length - 1] : '~';
	}

	private addToHistory(entry: HistoryEntry): void {
		this.updateState((state) => ({
			...state,
			history: [...state.history, entry].slice(-this.config.maxHistorySize)
		}));
	}

	private clearHistory(): void {
		this.updateState((state) => ({
			...state,
			history: []
		}));
	}

	private getHistory(): HistoryEntry[] {
		let currentState: TerminalState;
		terminalState.subscribe((state) => (currentState = state))();
		return currentState!.history;
	}

	private updateState(
		update: Partial<TerminalState> | ((state: TerminalState) => TerminalState)
	): void {
		terminalState.update((state) => {
			if (typeof update === 'function') {
				return update(state);
			}
			return { ...state, ...update };
		});
	}

	getFileSystemService(): FileSystemService {
		return this.fileSystemService;
	}

	getCommandRegistry() {
		return this.commandRegistry;
	}
}

export const terminalService = new TerminalService();

export const terminalActions = {
	initialize: () => terminalService.initialize(),
	executeCommand: (input: string, currentPath: string) =>
		terminalService.executeCommand(input, currentPath),
	clearHistory: () => {
		terminalService['clearHistory']();
	},
	getFileSystemService: () => terminalService.getFileSystemService()
};

