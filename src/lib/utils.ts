import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type PlatformKey = "darwin-aarch64" | "linux-x86_64" | "darwin-x86_64" | "linux-aarch64" | "windows-x86_64";

export const getPlatformFromAssetUrl = (url: string): PlatformKey | null => {
    if (url.endsWith("_aarch64.dmg")) return "darwin-aarch64";
    if (url.endsWith("_amd64.AppImage")) return "linux-x86_64";
    if (url.endsWith("_x64.dmg")) return "darwin-x86_64";
    if (url.endsWith("_aarch64.AppImage")) return "linux-aarch64";
    if (url.endsWith("_x64_en-US.msi")) return "windows-x86_64";
    return null;
}

export type DownloadInfo = {
    assets: {
        browser_download_url: string;
    }[]
}