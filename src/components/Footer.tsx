import { getPlatformFromAssetUrl, type DownloadInfo, type PlatformKey } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query"
import { Github } from "lucide-react"
import { useMemo } from "preact/hooks";

export function Footer() {
    const { data: downloads } = useQuery({
        queryKey: ['latest-downloads'],
        queryFn: () => fetch("https://api.github.com/repos/lovelesscodes/storyforge/releases/latest").then(res => res.json() as Promise<DownloadInfo & { html_url: string}>),
    });

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

    const { data: redditStats } = useQuery({
        queryKey: ['reddit-stats'],
        queryFn: () => fetch('https://www.reddit.com/r/vintagestory/comments/1nngt2b.json')
            .then(res => res.json() as Promise<{data: {children: {data: {ups: number; upvote_ratio: number;}}[]}}[]>)
    })

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
                        <div className="flex space-y-4 flex-col">
                            <a href="https://github.com/lovelesscodes/storyforge" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="https://reddit.com/r/vintagestory/1nngt2b" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                                <svg role="img" className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <title>Reddit</title>
                                    <path fill="currentColor" d="M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z"/>
                                </svg>
                                · <span className="text-sm">{redditStats?.[0]?.data?.children[0]?.data?.ups ?? 0} Upvotes</span>
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
