import { Check, Copy, Folder } from "lucide-react";
import { useMemo } from "react";

import { Callout, Code, Step } from "@/components/guides/GuideUI";
import { AppleIcon, LinuxIcon, WindowsIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useLatestReleaseQuery } from "@/hooks/use-latest-release";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { getPlatformFromAssetUrl, type PlatformKey, RELEASES_URL } from "@/lib/utils";

const dataPaths = {
	linux: "~/.config/VintagestoryData",
	mac: "~/Library/Application Support/VintagestoryData",
	windows: "%APPDATA%\\VintagestoryData",
};

const platformGroups = [
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

function CopyPathButton({ value }: { value: string }) {
	const [copiedText, setCopiedText] = useCopyToClipboard();
	return (
		<Button
			aria-label={`Copy ${value}`}
			onClick={() => setCopiedText(value)}
			size="icon-xs"
			variant="outline"
		>
			{copiedText === value ? <Check className="text-success" /> : <Copy />}
		</Button>
	);
}

export function MigrateGuide() {
	const { data: release } = useLatestReleaseQuery();

	const assets = useMemo(
		() =>
			release?.assets?.reduce<{ platform: PlatformKey; url: string }[]>((acc, asset) => {
				const platform = getPlatformFromAssetUrl(asset.url);
				if (platform) {
					acc.push({ platform, url: asset.url });
				}
				return acc;
			}, []) ?? [],
		[release],
	);

	return (
		<>
			<Step n={1} title="Install Story Forge">
				<p>Download the app for your platform if you haven't already.</p>
				<div className="grid gap-2 sm:grid-cols-3">
					{platformGroups.map((group) => {
						const groupAssets = group.assets
							.map((platform) => ({
								asset: assets.find((entry) => entry.platform === platform),
								platform,
							}))
							.filter((entry) => entry.asset);
						return (
							<div
								className="border-border bg-background grid content-start gap-2 border p-3"
								key={group.label}
							>
								<span className="text-muted-foreground flex items-center gap-2 text-[10px] font-medium tracking-widest uppercase">
									<group.icon className="size-3.5" /> {group.label}
								</span>
								{groupAssets.map(({ asset, platform }) => (
									<a
										className="text-accent-primary hover:text-accent-amber text-[11px] transition-colors"
										href={asset?.url}
										key={platform}
										rel="noopener noreferrer"
										target="_blank"
									>
										Download ·{" "}
										{platform.startsWith("darwin")
											? platform.endsWith("aarch64")
												? "Apple Silicon"
												: "Intel"
											: platform.endsWith("aarch64")
												? "ARM64"
												: "x64"}
									</a>
								))}
								{groupAssets.length === 0 && (
									<a
										className="text-accent-primary hover:text-accent-amber text-[11px] transition-colors"
										href={RELEASES_URL}
										rel="noopener noreferrer"
										target="_blank"
									>
										View releases
									</a>
								)}
							</div>
						);
					})}
				</div>
			</Step>

			<Step n={2} title="Let Story Forge adopt your existing data (recommended)">
				<p>
					On first launch, Story Forge detects a standard Vintage Story data folder and offers to
					adopt it as a profile — mods, worlds and settings stay exactly where they are. Nothing is
					copied, moved or rewritten.
				</p>
				<p>The folder it looks for:</p>
				<div className="grid gap-2">
					<div className="flex items-center gap-2">
						<Code>
							<Folder className="mr-1 inline size-3" />
							{dataPaths.windows}
						</Code>
						<CopyPathButton value={dataPaths.windows} />
						<span className="text-[10px]">Windows</span>
					</div>
					<div className="flex items-center gap-2">
						<Code>
							<Folder className="mr-1 inline size-3" />
							{dataPaths.mac}
						</Code>
						<CopyPathButton value={dataPaths.mac} />
						<span className="text-[10px]">macOS</span>
					</div>
					<div className="flex items-center gap-2">
						<Code>
							<Folder className="mr-1 inline size-3" />
							{dataPaths.linux}
						</Code>
						<CopyPathButton value={dataPaths.linux} />
						<span className="text-[10px]">Linux</span>
					</div>
				</div>
				<Callout variant="tip">
					Adopted folders stay external: deleting the profile only unregisters it. Your original
					data keeps working with the stock launcher.
				</Callout>
			</Step>

			<Step n={3} title="Or copy the data manually">
				<p>
					Prefer a clean slate? Create a new profile, open its folder with{" "}
					<span className="border-border bg-background text-foreground inline-flex items-center gap-1 border px-1.5 py-0.5 text-[10px]">
						<Folder className="size-3" /> Open folder
					</span>
					, then copy your Vintage Story data into it. The usual suspects are <Code>Mods/</Code>,{" "}
					<Code>Saves/</Code>, <Code>ModConfig/</Code> and <Code>clientsettings.json</Code>.
				</p>
			</Step>

			<Step n={4} title="Check your mods and play">
				<p>
					Open the Mods page to install anything missing and check for updates, then press Play.
					Profiles are isolated, so nothing you do in Story Forge touches your original install.
				</p>
				<Callout variant="info">
					Tip: pair this with <strong className="text-foreground">Backups</strong> on the profile —
					snapshot before big mod changes and you can always roll back.
				</Callout>
			</Step>
		</>
	);
}
