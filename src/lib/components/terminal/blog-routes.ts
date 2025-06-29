// Mapping of URL slugs to filenames
export const slugToFilename: Record<string, string> = {
	'linux-designers': 'linux-designers.txt'
};

export function getBlogFilename(pathname: string): string | null {
	const match = pathname.match(/^\/blog\/(.+)$/);
	if (!match) return null;
	
	const slug = match[1];
	return slugToFilename[slug] || null;
}