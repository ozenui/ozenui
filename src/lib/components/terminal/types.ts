// File System Types
export interface FileSystemNode {
	type: 'file' | 'directory';
	name: string;
	path: string;
	metadata?: NodeMetadata;
}

export interface Directory extends FileSystemNode {
	type: 'directory';
	children: Record<string, FileSystemNode>;
}

export interface File extends FileSystemNode {
	type: 'file';
	content: string;
	mimeType?: string;
}

export interface NodeMetadata {
	size?: number;
	created?: Date;
	modified?: Date;
	permissions?: string;
}

export type FileSystem = Directory;

export interface NavigationResult {
	success: boolean;
	newPath?: string;
	error?: string;
}

export interface DirectoryListing {
	entries: FileSystemNode[];
	path: string;
}

export interface FileContent {
	content: string;
	mimeType?: string;
}

// Command Types
export interface HistoryEntry {
	path: string;
	value: string;
	type: 'input' | 'output';
	timestamp?: Date;
}

export interface CommandContext {
	currentPath: string;
	fileSystem: FileSystem;
	contentLoader: any;
	history: HistoryEntry[];
	fileSystemService: any;
}

export interface CommandResult {
	success: boolean;
	output?: string;
	error?: CommandError;
	sideEffects?: SideEffect[];
}

export interface CommandError {
	code: string;
	message: string;
	details?: unknown;
}

export interface SideEffect {
	type: 'navigation' | 'history_clear' | 'content_load';
	data?: any;
}

export interface Command {
	name: string;
	description: string;
	usage?: string;
	execute(args: string[], context: CommandContext): Promise<CommandResult>;
}

export interface CommandRegistry {
	register(command: Command): void;
	unregister(name: string): void;
	execute(input: string, context: CommandContext): Promise<CommandResult>;
	getCommand(name: string): Command | undefined;
	listCommands(): Command[];
}

export interface ParsedCommand {
	name: string;
	args: string[];
	rawInput: string;
}

// Terminal State Types
export interface TerminalState {
	history: HistoryEntry[];
	currentPath: string;
	fileSystem: FileSystem | null;
	loading: boolean;
	error: string | null;
}

export interface TerminalConfig {
	maxHistorySize: number;
	autoScroll: boolean;
	promptSymbol: string;
	defaultPath: string;
}
