import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export type PlatformKey =
	| "darwin-aarch64"
	| "linux-x86_64"
	| "darwin-x86_64"
	| "linux-aarch64"
	| "windows-x86_64";

export const getPlatformFromAssetUrl = (url: string): PlatformKey | null => {
	if (url.endsWith("_aarch64.dmg")) return "darwin-aarch64";
	if (url.endsWith("_aarch64_darwin.dmg")) return "darwin-aarch64";
	if (url.endsWith("_amd64.AppImage")) return "linux-x86_64";
	if (url.endsWith("_amd64_linux.AppImage")) return "linux-x86_64";
	if (url.endsWith("_x64.dmg")) return "darwin-x86_64";
	if (url.endsWith("_x64_darwin.dmg")) return "darwin-x86_64";
	if (url.endsWith("_aarch64.AppImage")) return "linux-aarch64";
	if (url.endsWith("_aarch64_linux.AppImage")) return "linux-aarch64";
	if (url.endsWith("_x64_en-US.msi")) return "windows-x86_64";
	if (url.endsWith("_x64_en-US_windows.msi")) return "windows-x86_64";
	return null;
};

export type DownloadInfo = {
	html_url: string;
	assets: {
		browser_download_url: string;
	}[];
};
