import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, Github } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";

import { DiscordIcon, RedditIcon } from "@/components/icons";
import { usePageScroll } from "@/components/layout/PageScroll";
import { useLatestReleaseQuery } from "@/hooks/use-latest-release";
import { RELEASES_URL } from "@/lib/utils";

const currentYear = new Date().getFullYear();

const productLinks = [
	{ key: "footer.download", scrollTo: "download", to: "/" as const },
	{ key: "nav.modpacks", to: "/modpacks" as const },
	{ key: "footer.modBrowser", to: "/mods" as const },
	{ key: "footer.mapViewer", to: "/map" as const },
] as const;

export function Footer() {
	const { t } = useTranslation();
	const { data: release } = useLatestReleaseQuery();
	const { scrollToId } = usePageScroll();
	const navigate = useNavigate();
	const pathname = useLocation({ select: (s) => s.pathname });

	const goToDownload = () => {
		if (pathname === "/") {
			scrollToId("download");
			return;
		}
		void navigate({ to: "/" }).then(() => {
			// The home route is code-split: wait for the section to mount, after
			// the route transition's scroll-to-top reset has settled.
			const tryScroll = (attempt: number) => {
				if (document.getElementById("download")) {
					scrollToId("download");
					return;
				}
				if (attempt < 40) window.setTimeout(() => tryScroll(attempt + 1), 25);
			};
			window.setTimeout(() => tryScroll(0), 250);
		});
	};

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
								{t("common.tagline")}
							</span>
						</span>
					</div>
					<p className="text-muted-foreground text-xs/relaxed">{t("footer.blurb")}</p>
					<div className="flex items-center gap-1">
						<a
							aria-label={t("common.github")}
							href="https://github.com/lovelesscodes/storyforge"
							rel="noopener noreferrer"
							target="_blank"
						>
							<span className="border-border text-muted-foreground hover:border-accent-primary/50 hover:text-foreground grid size-7 place-items-center border transition-colors">
								<Github className="size-3.5" />
							</span>
						</a>
						<a
							aria-label={t("common.discord")}
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
							{t("footer.reddit")}
						</a>
					</div>
				</div>

				{/* Product */}
				<div className="grid content-start gap-3">
					<h3 className="text-muted-foreground text-[10px] font-medium tracking-widest uppercase">
						{t("footer.product")}
					</h3>
					<ul className="grid gap-2">
						{productLinks.map((link) => (
							<li key={link.key}>
								{"scrollTo" in link ? (
									<button
										className="text-muted-foreground hover:text-foreground text-xs transition-colors"
										onClick={goToDownload}
										type="button"
									>
										{t(link.key)}
									</button>
								) : (
									<Link
										className="text-muted-foreground hover:text-foreground text-xs transition-colors"
										to={link.to}
									>
										{t(link.key)}
									</Link>
								)}
							</li>
						))}
					</ul>
				</div>

				{/* Resources */}
				<div className="grid content-start gap-3">
					<h3 className="text-muted-foreground text-[10px] font-medium tracking-widest uppercase">
						{t("footer.resources")}
					</h3>
					<ul className="grid gap-2">
						<li>
							<Link
								className="text-muted-foreground hover:text-foreground text-xs transition-colors"
								to="/guide"
							>
								{t("footer.guides")}
							</Link>
						</li>
						<li>
							<Link
								className="text-muted-foreground hover:text-foreground text-xs transition-colors"
								to="/faq"
							>
								{t("footer.faq")}
							</Link>
						</li>
						<li>
							<a
								className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs transition-colors"
								href="https://github.com/lovelesscodes/storyforge/blob/release/CONTRIBUTING.md"
								rel="noopener noreferrer"
								target="_blank"
							>
								{t("footer.contributing")} <ArrowUpRight className="size-3" />
							</a>
						</li>
						<li>
							<a
								className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs transition-colors"
								href="https://github.com/lovelesscodes/storyforge/issues"
								rel="noopener noreferrer"
								target="_blank"
							>
								{t("footer.reportIssue")} <ArrowUpRight className="size-3" />
							</a>
						</li>
					</ul>
				</div>

				{/* Latest release */}
				<div className="grid content-start gap-3">
					<h3 className="text-muted-foreground text-[10px] font-medium tracking-widest uppercase">
						{t("footer.latestRelease")}
					</h3>
					<p className="text-muted-foreground text-xs">
						{release?.version ?? t("footer.fetchingRelease")}
					</p>
					<ul className="grid gap-2">
						<li>
							<a
								className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs transition-colors"
								href={release?.url ?? RELEASES_URL}
								rel="noopener noreferrer"
								target="_blank"
							>
								{t("footer.releaseNotes")} <ArrowUpRight className="size-3" />
							</a>
						</li>
						<li>
							<a
								className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs transition-colors"
								href="https://github.com/lovelesscodes/storyforge/releases"
								rel="noopener noreferrer"
								target="_blank"
							>
								{t("footer.allReleases")} <ArrowUpRight className="size-3" />
							</a>
						</li>
					</ul>
				</div>
			</div>

			<div className="border-border border-t">
				<div className="text-muted-foreground mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-[10px] sm:flex-row sm:items-center sm:justify-between sm:px-6">
					<p>{t("footer.copyright", { year: currentYear })}</p>
					<p>
						<Trans
							components={{
								anego: (
									<a
										className="hover:text-foreground underline underline-offset-2 transition-colors"
										href="https://anegostudios.com/"
										rel="noopener noreferrer"
										target="_blank"
									/>
								),
								vintage: (
									<a
										className="hover:text-foreground underline underline-offset-2 transition-colors"
										href="https://vintagestory.at"
										rel="noopener noreferrer"
										target="_blank"
									/>
								),
							}}
							i18nKey="footer.disclaimer"
						/>
					</p>
				</div>
			</div>
		</footer>
	);
}
