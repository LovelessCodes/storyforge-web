import { Check, Download } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api, formatCount, type ModpackVersion, parseModsString, timeAgo } from "@/lib/modpacks";

import { ModpackModsList } from "./ModpackModsList";

interface ModpackVersionCardProps {
	slug: string;
	version: ModpackVersion;
}

export function ModpackVersionCard({ slug, version }: ModpackVersionCardProps) {
	const modCount = parseModsString(version.modsString).length;

	const handleDownload = () => {
		if (version.modConfigsUrl) {
			window.open(version.modConfigsUrl, "_blank", "noopener,noreferrer");
		}
		// Fire-and-forget download counter bump (same as the launcher does).
		void api.incrementModpackVersionDownload(slug, version.version).catch(() => undefined);
	};

	return (
		<Card className="gap-0 p-0" size="sm">
			<div className="flex flex-wrap items-center gap-3 p-3">
				<div className="grid min-w-0 flex-1 gap-1">
					<div className="flex flex-wrap items-center gap-x-2 gap-y-1">
						<span className="font-mono text-xs font-medium">v{version.version}</span>
						{version.gameVersion ? (
							<Badge variant="outline">
								<Check className="size-2.5" /> VS {version.gameVersion}
							</Badge>
						) : null}
						<span className="text-muted-foreground text-[10px]">{timeAgo(version.createdAt)}</span>
					</div>
					<span className="text-muted-foreground text-[10px] tabular-nums">
						{modCount} mod{modCount === 1 ? "" : "s"} · {formatCount(version.downloads)} downloads
					</span>
					{version.changelog ? (
						<p className="text-muted-foreground/80 line-clamp-3 text-[11px]/relaxed whitespace-pre-wrap">
							{version.changelog}
						</p>
					) : null}
				</div>

				{version.modConfigsUrl ? (
					<Button className="shrink-0" onClick={handleDownload} size="sm" variant="outline-accent">
						<Download /> Mod configs
					</Button>
				) : (
					<Badge className="shrink-0" variant="secondary">
						No files
					</Badge>
				)}
			</div>

			{modCount > 0 && (
				<div className="border-border/60 border-t px-3 py-2">
					<ModpackModsList modsString={version.modsString} />
				</div>
			)}
		</Card>
	);
}
