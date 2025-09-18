import { getPlatformFromAssetUrl, type DownloadInfo, type PlatformKey } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query"
import { Github } from "lucide-react"
import { useMemo } from "preact/hooks";

export function Footer() {
    const { data: downloads } = useQuery({
        queryKey: ['latest-downloads'],
        queryFn: () => fetch("https://api.github.com/repos/lovelesscodes/storyforge/releases/latest").then(res => res.json() as Promise<DownloadInfo & { html_url: string}>),
    })

    const assets = useMemo(() => {
        if (!downloads) return [];
        return downloads.assets.reduce((acc, asset) => {
            const platform = getPlatformFromAssetUrl(asset.browser_download_url);
            if (platform) {
                acc.push({ platform, url: asset.browser_download_url });
            }
            return acc;
        }, [] as { platform: PlatformKey; url: string }[]);
    }, [downloads]);

    return (
        <footer className="border-t border-border bg-card/30 text-foreground">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <img src="StoryForge.png" alt="Story Forge Logo" className="w-6 h-6" />
                            <span className="font-bold">Story Forge</span>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            The ultimate launcher for Vintage Story, built by the community for the community.
                        </p>
                        <p className="text-muted-foreground text-sm">
                            Story Forge is not affiliated with or endorsed by <a href="https://anegostudios.com/" className="underline hover:text-foreground transition-colors">Anego Studios</a> or <a href="https://vintagestory.at" className="underline hover:text-foreground transition-colors">Vintage Story</a>.
                        </p>
                        <p className="text-muted-foreground text-sm">
                            Made with ❤️ by <a href="https://github.com/lovelesscodes" className="underline hover:text-foreground transition-colors">LovelessCodes</a>
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Downloads</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <a href={assets.find(asset => asset.platform === "windows-x86_64")?.url} className="hover:text-foreground transition-colors">
                                    Windows
                                </a>
                            </li>
                            <li>
                                <a href={assets.find(asset => asset.platform === "darwin-aarch64")?.url} className="hover:text-foreground transition-colors">
                                    macOS (Apple Silicon)
                                </a>
                            </li>
                            <li>
                                <a href={assets.find(asset => asset.platform === "darwin-x86_64")?.url} className="hover:text-foreground transition-colors">
                                    macOS (Intel)
                                </a>
                            </li>
                            <li>
                                <a href={assets.find(asset => asset.platform === "linux-x86_64")?.url} className="hover:text-foreground transition-colors">
                                    Linux (x86_64)
                                </a>
                            </li>
                            <li>
                                <a href={assets.find(asset => asset.platform === "linux-aarch64")?.url} className="hover:text-foreground transition-colors">
                                    Linux (ARM64)
                                </a>
                            </li>
                            <li>
                                <a href={downloads?.html_url} className="hover:text-foreground transition-colors">
                                    Release Notes
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Connect</h3>
                        <div className="flex space-x-4">
                            <a href="https://github.com/lovelesscodes/storyforge" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; 2025 Story Forge. Open source software released under the GPLv3 License.</p>
                </div>
            </div>
        </footer>
    )
}
