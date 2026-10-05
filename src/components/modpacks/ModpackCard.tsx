import { Link } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { motion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { formatCount, latestVersion, type ModpackItem } from "@/lib/modpacks";

import { ModpackImage } from "./ModpackImage";

interface ModpackCardProps {
	modpack: ModpackItem;
	index?: number;
	isOwner?: boolean;
}

export function ModpackCard({ modpack, index = 0, isOwner }: ModpackCardProps) {
	const latest = latestVersion(modpack);

	return (
		<motion.div
			animate={{ opacity: 1, y: 0 }}
			className="h-full"
			initial={{ opacity: 0, y: 14 }}
			transition={{
				delay: Math.min(index * 0.035, 0.3),
				duration: 0.4,
				ease: [0.22, 1, 0.36, 1],
			}}
		>
			<Link
				className="group flex h-full flex-col border border-border bg-card transition-all duration-300 hover:border-accent-primary/40 hover:bg-surface-hover"
				params={{ slug: modpack.slug }}
				to="/modpacks/$slug"
			>
				<div className="relative aspect-video w-full overflow-hidden bg-muted">
					<ModpackImage
						alt={modpack.name}
						className="size-full transition-transform duration-500 group-hover:scale-[1.04]"
						src={modpack.imageUrl}
					/>
					{isOwner && (
						<Badge
							className="absolute top-2 left-2 border-transparent bg-accent-primary/90 text-white"
							variant="accent"
						>
							Yours
						</Badge>
					)}
					{latest ? (
						<span className="absolute right-2 bottom-2 border border-border bg-background/85 px-1.5 py-0.5 font-mono text-[10px] text-foreground backdrop-blur-sm">
							v{latest.version}
						</span>
					) : (
						<Badge className="absolute right-2 bottom-2" variant="outline">
							Draft
						</Badge>
					)}
				</div>

				<div className="grid flex-1 content-start gap-1.5 p-3">
					<h3 className="truncate text-xs font-medium transition-colors group-hover:text-accent-amber">
						{modpack.name}
					</h3>
					<p className="line-clamp-2 min-h-8 text-[11px]/relaxed text-muted-foreground">
						{modpack.description || "No description provided."}
					</p>
					<div className="mt-1 flex items-center justify-between gap-2 text-[10px] text-muted-foreground">
						<span className="flex min-w-0 items-center gap-1.5">
							{modpack.owner?.image ? (
								<img
									alt={modpack.owner.name}
									className="size-4 shrink-0 object-cover"
									loading="lazy"
									referrerPolicy="no-referrer"
									src={modpack.owner.image}
								/>
							) : (
								<span className="grid size-4 shrink-0 place-items-center bg-secondary text-[8px] font-bold">
									{modpack.owner?.name?.charAt(0)?.toUpperCase() ?? "?"}
								</span>
							)}
							<span className="truncate">
								{modpack.owner?.name ?? "Unknown"}
							</span>
						</span>
						<span className="flex shrink-0 items-center gap-1 tabular-nums">
							<Download className="size-3" />
							{formatCount(modpack.downloads)}
						</span>
					</div>
				</div>
			</Link>
		</motion.div>
	);
}
