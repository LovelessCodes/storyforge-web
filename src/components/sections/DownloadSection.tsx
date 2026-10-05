import { Download, FileText, Loader2 } from "lucide-react";

import { AppleIcon, LinuxIcon, WindowsIcon } from "@/components/icons";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLatestReleaseQuery } from "@/hooks/use-latest-release";
import { getPlatformFromAssetUrl, type PlatformKey, RELEASES_URL } from "@/lib/utils";

const groups = [
	{
		assets: ["windows-x86_64"] as PlatformKey[],
		icon: WindowsIcon,
		label: "Windows",
	},
	{
		assets: ["darwin-aarch64", "darwin-x86_64"] as PlatformKey[],
		icon: AppleIcon,
		label: "macOS",
	},
	{
		assets: ["linux-x86_64", "linux-aarch64"] as PlatformKey[],
		icon: LinuxIcon,
		label: "Linux",
	},
] as const;

const platformLabels: Record<PlatformKey, string> = {
	"darwin-aarch64": "Apple Silicon (.dmg)",
	"darwin-x86_64": "Intel (.dmg)",
	"linux-aarch64": "ARM64 (.AppImage)",
	"linux-x86_64": "x64 (.AppImage)",
	"windows-x86_64": "x64 (.msi)",
};

function detectPlatform(): PlatformKey {
	const ua = navigator.userAgent;
	if (/mac/i.test(ua)) {
		return /arm64|aarch64/i.test(navigator.platform) ? "darwin-aarch64" : "darwin-x86_64";
	}
	if (/win/i.test(ua)) return "windows-x86_64";
	return /arm64|aarch64/i.test(navigator.platform) ? "linux-aarch64" : "linux-x86_64";
}

export function DownloadSection() {
	const { data: release, isPending } = useLatestReleaseQuery();
	const currentPlatform = detectPlatform();

	const assets =
		release?.assets?.reduce<{ platform: PlatformKey; size?: number; url: string }[]>(
			(acc, asset) => {
				const platform = getPlatformFromAssetUrl(asset.url);
				if (platform) {
					acc.push({
						platform,
						size: asset.size,
						url: asset.url,
					});
				}
				return acc;
			},
			[],
		) ?? [];

	return (
		<section className="border-border border-b" id="download">
			<div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
				<Reveal className="mx-auto max-w-2xl text-center">
					<p className="text-accent-amber text-[10px] font-medium tracking-widest uppercase">
						Get started
					</p>
					<h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
						Download Story Forge
					</h2>
					<p className="text-muted-foreground mt-3 text-sm/relaxed">
						{release?.version ? `Latest release ${release.version} — ` : ""}
						free and open source for Windows, macOS and Linux.
					</p>
				</Reveal>

				<div className="border-border bg-border mt-10 grid gap-px border md:grid-cols-3">
					{groups.map((group, groupIndex) => (
						<Reveal delay={groupIndex * 0.08} key={group.label}>
							<div className="bg-background grid h-full content-start gap-4 p-6">
								<div className="flex items-center gap-2.5">
									<group.icon className="text-muted-foreground size-4" />
									<h3 className="text-xs font-medium">{group.label}</h3>
								</div>
								<div className="grid gap-2">
									{isPending ? (
										<div className="text-muted-foreground flex items-center gap-2 py-2 text-[11px]">
											<Loader2 className="size-3.5 animate-spin" /> Loading release…
										</div>
									) : (
										group.assets.map((platform) => {
											const asset = assets.find((candidate) => candidate.platform === platform);
											const recommended = platform === currentPlatform && asset;
											const href = asset?.url ?? release?.url ?? RELEASES_URL;
											const content = (
												<>
													<span className="flex items-center gap-2">
														<Download className="size-3.5" />
														{platformLabels[platform]}
													</span>
													{recommended ? (
														<Badge
															className="border-transparent bg-white/15 text-white"
															variant="outline"
														>
															Recommended
														</Badge>
													) : asset?.size ? (
														<span className="text-muted-foreground text-[10px]">
															{(asset.size / (1024 * 1024)).toFixed(0)} MB
														</span>
													) : null}
												</>
											);
											return (
												<Button
													className="group h-11 w-full justify-between px-3"
													key={platform}
													render={
														<a href={href} rel="noopener noreferrer" target="_blank">
															{content}
														</a>
													}
													size="lg"
													variant={recommended ? "accent" : "outline"}
												/>
											);
										})
									)}
								</div>
							</div>
						</Reveal>
					))}
				</div>

				<div className="mt-4 flex justify-center">
					<a
						className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-[11px] transition-colors"
						href={release?.url ?? RELEASES_URL}
						rel="noopener noreferrer"
						target="_blank"
					>
						<FileText className="size-3.5" />
						Release notes & all platforms
					</a>
				</div>
			</div>
		</section>
	);
}
