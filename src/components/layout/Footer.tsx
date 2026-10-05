import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Github } from "lucide-react";

import { DiscordIcon, RedditIcon } from "@/components/icons";
import { useLatestReleaseQuery } from "@/hooks/use-latest-release";
import { RELEASES_URL } from "@/lib/utils";

const currentYear = new Date().getFullYear();

const productLinks = [
	{ label: "Download", to: "/" },
	{ label: "Modpacks", to: "/modpacks" },
	{ label: "Mod Browser", to: "/mods" },
	{ label: "Map Viewer", to: "/map" },
] as const;

export function Footer() {
	const { data: release } = useLatestReleaseQuery();

	return (
		<footer className="border-border bg-surface/40 border-t">
			<div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
				{/* Brand */}
				<div className="grid max-w-xs content-start gap-4">
					<div className="flex items-center gap-2.5">
						<img alt="Story Forge" className="size-7 object-contain" src="/StoryForge.svg" />
						<span className="leading-tight">
							<span className="block text-[13px] font-bold tracking-wide">STORY FORGE</span>
							<span className="text-accent-amber block text-[9px] font-medium tracking-widest uppercase">
								Vintage Story Launcher
							</span>
						</span>
					</div>
					<p className="text-muted-foreground text-xs/relaxed">
						An open-source Vintage Story launcher and mod manager, built by the community for the
						community.
					</p>
					<div className="flex items-center gap-1">
						<a
							aria-label="GitHub"
							href="https://github.com/lovelesscodes/storyforge"
							rel="noopener noreferrer"
							target="_blank"
						>
							<span className="border-border text-muted-foreground hover:border-accent-primary/50 hover:text-foreground grid size-7 place-items-center border transition-colors">
								<Github className="size-3.5" />
							</span>
						</a>
						<a
							aria-label="Discord"
							href="https://discord.gg/gByx63peUC"
							rel="noopener noreferrer"
							target="_blank"
						>
							<span className="border-border text-muted-foreground hover:border-accent-primary/50 hover:text-foreground grid size-7 place-items-center border transition-colors">
								<DiscordIcon className="size-3.5" />
							</span>
						</a>
						<a
							aria-label="Reddit"
							href="https://www.reddit.com/r/VintageStory/comments/1nngt2b/introducing_story_forge_a_fast_modern_vintage/"
							rel="noopener noreferrer"
							target="_blank"
						>
							<span className="border-border text-muted-foreground hover:border-accent-primary/50 hover:text-foreground grid size-7 place-items-center border transition-colors">
								<RedditIcon className="size-3.5" />
							</span>
						</a>
					</div>
					<div className="text-muted-foreground flex items-center gap-2 text-[10px]">
						<RedditIcon className="size-3" />
						<a
							className="hover:text-foreground underline-offset-2 transition-colors hover:underline"
							href="https://www.reddit.com/r/VintageStory/comments/1nngt2b/introducing_story_forge_a_fast_modern_vintage/"
							rel="noopener noreferrer"
							target="_blank"
						>
							Read our intro on r/VintageStory
						</a>
					</div>
				</div>

				{/* Product */}
				<div className="grid content-start gap-3">
					<h3 className="text-muted-foreground text-[10px] font-medium tracking-widest uppercase">
						Product
					</h3>
					<ul className="grid gap-2">
						{productLinks.map((link) => (
							<li key={link.label}>
								<Link
									className="text-muted-foreground hover:text-foreground text-xs transition-colors"
									to={link.to}
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</div>

				{/* Resources */}
				<div className="grid content-start gap-3">
					<h3 className="text-muted-foreground text-[10px] font-medium tracking-widest uppercase">
						Resources
					</h3>
					<ul className="grid gap-2">
						<li>
							<Link
								className="text-muted-foreground hover:text-foreground text-xs transition-colors"
								to="/guide"
							>
								Guides
							</Link>
						</li>
						<li>
							<Link
								className="text-muted-foreground hover:text-foreground text-xs transition-colors"
								to="/faq"
							>
								FAQ
							</Link>
						</li>
						<li>
							<a
								className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs transition-colors"
								href="https://github.com/lovelesscodes/storyforge/blob/release/CONTRIBUTING.md"
								rel="noopener noreferrer"
								target="_blank"
							>
								Contributing <ArrowUpRight className="size-3" />
							</a>
						</li>
						<li>
							<a
								className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs transition-colors"
								href="https://github.com/lovelesscodes/storyforge/issues"
								rel="noopener noreferrer"
								target="_blank"
							>
								Report an issue <ArrowUpRight className="size-3" />
							</a>
						</li>
					</ul>
				</div>

				{/* Latest release */}
				<div className="grid content-start gap-3">
					<h3 className="text-muted-foreground text-[10px] font-medium tracking-widest uppercase">
						Latest release
					</h3>
					<p className="text-muted-foreground text-xs">{release?.version ?? "Fetching release…"}</p>
					<ul className="grid gap-2">
						<li>
							<a
								className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs transition-colors"
								href={release?.url ?? RELEASES_URL}
								rel="noopener noreferrer"
								target="_blank"
							>
								Release notes <ArrowUpRight className="size-3" />
							</a>
						</li>
						<li>
							<a
								className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs transition-colors"
								href="https://github.com/lovelesscodes/storyforge/releases"
								rel="noopener noreferrer"
								target="_blank"
							>
								All releases <ArrowUpRight className="size-3" />
							</a>
						</li>
					</ul>
				</div>
			</div>

			<div className="border-border border-t">
				<div className="text-muted-foreground mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-[10px] sm:flex-row sm:items-center sm:justify-between sm:px-6">
					<p>© {currentYear} Story Forge · Open source under the GPLv3 license</p>
					<p>
						Not affiliated with or endorsed by{" "}
						<a
							className="hover:text-foreground underline underline-offset-2 transition-colors"
							href="https://anegostudios.com/"
							rel="noopener noreferrer"
							target="_blank"
						>
							Anego Studios
						</a>{" "}
						or{" "}
						<a
							className="hover:text-foreground underline underline-offset-2 transition-colors"
							href="https://vintagestory.at"
							rel="noopener noreferrer"
							target="_blank"
						>
							Vintage Story
						</a>
					</p>
				</div>
			</div>
		</footer>
	);
}
