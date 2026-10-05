import { Link } from "@tanstack/react-router";
import { Download, Github, Package, Server, Sparkles } from "lucide-react";
import type { Variants } from "motion/react";
import { motion, useReducedMotion } from "motion/react";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { NumberTicker } from "@/components/ui/number-ticker";
import { useGithubStatsQuery } from "@/hooks/use-github-stats";
import { useLatestReleaseQuery } from "@/hooks/use-latest-release";
import { useModpacks } from "@/hooks/use-modpacks";
import { getPlatformFromAssetUrl, type PlatformKey, RELEASES_URL } from "@/lib/utils";

function detectPlatform(): PlatformKey {
	const ua = navigator.userAgent;
	if (/mac/i.test(ua)) {
		return /arm64|aarch64/i.test(navigator.platform) ? "darwin-aarch64" : "darwin-x86_64";
	}
	if (/win/i.test(ua)) return "windows-x86_64";
	return /arm64|aarch64/i.test(navigator.platform) ? "linux-aarch64" : "linux-x86_64";
}

const platformLabels: Record<PlatformKey, string> = {
	"darwin-aarch64": "macOS · Apple Silicon",
	"darwin-x86_64": "macOS · Intel",
	"linux-aarch64": "Linux · ARM64",
	"linux-x86_64": "Linux · x64",
	"windows-x86_64": "Windows · x64",
};

export function Hero() {
	const reduceMotion = useReducedMotion();
	const { data: release } = useLatestReleaseQuery();
	const { data: modpacksData } = useModpacks();
	const { data: stats } = useGithubStatsQuery();
	const stars = stats?.stars ?? 0;
	const downloads = stats?.downloads ?? 0;

	const { downloadUrl, version } = useMemo(() => {
		const assets = release?.assets ?? [];
		const platform = detectPlatform();
		const match =
			assets.find((asset) => getPlatformFromAssetUrl(asset.url) === platform) ??
			assets.find((asset) =>
				["windows-x86_64", "darwin-aarch64", "darwin-x86_64", "linux-x86_64"].includes(
					getPlatformFromAssetUrl(asset.url) ?? "",
				),
			);
		return {
			downloadUrl: match?.url ?? release?.url ?? RELEASES_URL,
			version: release?.version ?? "latest",
		};
	}, [release]);

	const modpackCount = modpacksData?.totalCount ?? 0;

	const container: Variants = {
		hidden: {},
		show: { transition: { staggerChildren: 0.09 } },
	};
	const item: Variants = reduceMotion
		? {}
		: {
				hidden: { opacity: 0, y: 18 },
				show: {
					opacity: 1,
					transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
					y: 0,
				},
			};

	return (
		<section className="border-border relative overflow-hidden border-b">
			{/* Backdrop */}
			<div className="pointer-events-none absolute inset-0">
				<div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)] opacity-60" />
				<div className="animate-pulse-glow bg-accent-primary/15 absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full blur-[140px]" />
				<div className="animate-pulse-glow bg-accent-amber/10 absolute top-24 -right-40 h-[360px] w-[360px] rounded-full blur-[120px] [animation-delay:1.5s]" />
			</div>

			<div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pt-16 pb-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:pt-24 lg:pb-28">
				<motion.div
					animate="show"
					className="grid justify-items-start gap-6"
					initial={reduceMotion ? false : "hidden"}
					variants={container}
				>
					<motion.span
						className="border-border bg-card/60 text-muted-foreground inline-flex items-center gap-2 border px-2.5 py-1 text-[10px] font-medium tracking-widest uppercase backdrop-blur-sm"
						variants={item}
					>
						<Sparkles className="text-accent-amber size-3" />
						Open source · GPLv3 · {version}
					</motion.span>

					<motion.h1
						className="max-w-xl text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl"
						variants={item}
					>
						Forge your next{" "}
						<span className="text-gradient-violet whitespace-nowrap">Vintage Story</span> adventure.
					</motion.h1>

					<motion.p
						className="text-muted-foreground max-w-lg text-sm/relaxed sm:text-base/relaxed"
						variants={item}
					>
						Story Forge is a fast, open-source launcher and mod manager for Vintage Story —
						profiles, mods, modpacks, world maps and server hosting, all in one place.
					</motion.p>

					<motion.div className="flex flex-wrap items-center gap-3" variants={item}>
						<Button
							render={
								<a
									href={downloadUrl}
									rel="noopener noreferrer"
									target={downloadUrl?.includes("github.com") ? "_blank" : undefined}
								>
									<Download /> Download for {platformLabels[detectPlatform()].split(" · ")[0]}
								</a>
							}
							size="xl"
							variant="amber"
						/>
						<Button render={<Link to="/modpacks" />} size="xl" variant="outline">
							<Package /> Browse modpacks
						</Button>
					</motion.div>

					<motion.div
						className="text-muted-foreground flex items-center gap-6 pt-2 text-[11px]"
						variants={item}
					>
						<span className="flex items-center gap-1.5">
							<Github className="size-3.5" />
							<span className="text-foreground font-medium tabular-nums">
								<NumberTicker value={stars} />
							</span>
							GitHub stars
						</span>
						<span className="flex items-center gap-1.5">
							<Download className="size-3.5" />
							<span className="text-foreground font-medium tabular-nums">
								<NumberTicker value={downloads} />
							</span>
							downloads
						</span>
						<span className="hidden items-center gap-1.5 sm:flex">
							<Package className="size-3.5" />
							<span className="text-foreground font-medium tabular-nums">
								<NumberTicker value={modpackCount} />
							</span>
							modpacks
						</span>
					</motion.div>
				</motion.div>

				{/* Screenshot */}
				<motion.div
					animate={{ opacity: 1, y: 0 }}
					className="relative"
					initial={reduceMotion ? false : { opacity: 0, y: 28 }}
					transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
				>
					<div className="bg-accent-primary/12 absolute -inset-8 blur-3xl" />
					<div className="animate-float-slow border-border bg-card relative border p-1.5 shadow-2xl shadow-black/50">
						<div className="border-border bg-surface flex h-7 items-center gap-1.5 border-b px-2.5">
							<span className="bg-error/70 size-2" />
							<span className="bg-warning/70 size-2" />
							<span className="bg-success/70 size-2" />
							<span className="text-muted-foreground ml-2 font-mono text-[9px]">
								storyforge — profiles
							</span>
						</div>
						<img
							alt="Story Forge profiles screen"
							className="block w-full"
							src="/screenshots/profiles.webp"
						/>
					</div>

					{/* Floating accent chips */}
					<motion.div
						animate={{ opacity: 1, x: 0 }}
						className="animate-float border-border bg-surface-raised/95 absolute -top-5 -left-5 hidden items-center gap-2 border px-3 py-2 shadow-xl backdrop-blur-sm sm:flex"
						initial={reduceMotion ? false : { opacity: 0, x: -16 }}
						transition={{ delay: 0.7, duration: 0.5 }}
					>
						<Package className="text-accent-primary size-3.5" />
						<span className="text-[10px] font-medium">Mods, updated in one click</span>
					</motion.div>
					<motion.div
						animate={{ opacity: 1, x: 0 }}
						className="animate-float border-border bg-surface-raised/95 absolute -right-4 bottom-10 hidden items-center gap-2 border px-3 py-2 shadow-xl backdrop-blur-sm [animation-delay:1.2s] sm:flex"
						initial={reduceMotion ? false : { opacity: 0, x: 16 }}
						transition={{ delay: 0.85, duration: 0.5 }}
					>
						<Server className="text-accent-amber size-3.5" />
						<span className="text-[10px] font-medium">Server hosting built in</span>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
