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
				className="group border-border bg-card hover:border-accent-primary/40 hover:bg-surface-hover flex h-full flex-col border transition-all duration-300"
				params={{ slug: modpack.slug }}
				to="/modpacks/$slug"
			>
				<div className="bg-muted relative aspect-video w-full overflow-hidden">
					<ModpackImage
						alt={modpack.name}
						className="size-full transition-transform duration-500 group-hover:scale-[1.04]"
						src={modpack.imageUrl}
					/>
					{isOwner && (
						<Badge
							className="bg-accent-primary/90 absolute top-2 left-2 border-transparent text-white"
							variant="accent"
						>
							Yours
						</Badge>
					)}
					{latest ? (
						<span className="border-border bg-background/85 text-foreground absolute right-2 bottom-2 border px-1.5 py-0.5 font-mono text-[10px] backdrop-blur-sm">
							v{latest.version}
						</span>
					) : (
						<Badge className="absolute right-2 bottom-2" variant="outline">
							Draft
						</Badge>
					)}
				</div>

				<div className="grid flex-1 content-start gap-1.5 p-3">
					<h3 className="group-hover:text-accent-amber truncate text-xs font-medium transition-colors">
						{modpack.name}
					</h3>
					<p className="text-muted-foreground line-clamp-2 min-h-8 text-[11px]/relaxed">
						{modpack.description || "No description provided."}
					</p>
					<div className="text-muted-foreground mt-1 flex items-center justify-between gap-2 text-[10px]">
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
								<span className="bg-secondary grid size-4 shrink-0 place-items-center text-[8px] font-bold">
									{modpack.owner?.name?.charAt(0)?.toUpperCase() ?? "?"}
								</span>
							)}
							<span className="truncate">{modpack.owner?.name ?? "Unknown"}</span>
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
