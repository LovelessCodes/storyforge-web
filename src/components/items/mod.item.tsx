import { Download, MessageSquare, Star } from "lucide-react";

import type { Mod } from "@/hooks/useMods";
import { formatCount } from "@/lib/modpacks";
import { useModsFilters } from "@/stores/mod-filters";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";

export const ModItem = ({ mod }: { mod: Mod }) => {
	const { setAuthor } = useModsFilters();
	const url = `https://mods.vintagestory.at/${
		mod.urlalias ?? `show/mod/${mod.assetid}`
	}`;

	return (
		<div className="flex w-full flex-row items-center justify-between gap-4 px-3 py-2.5 transition-colors hover:bg-surface-hover">
			<div className="flex min-w-0 flex-row items-center gap-3">
				<a href={url} rel="noreferrer" target="_blank">
					<img
						alt={mod.name}
						className="size-10 shrink-0 border border-border object-cover transition-transform duration-200 hover:scale-105"
						loading="lazy"
						src={
							mod.logo ?? "https://mods.vintagestory.at/web/img/mod-default.png"
						}
					/>
				</a>
				<div className="flex min-w-0 flex-col gap-0.5">
					<div className="flex items-center gap-1.5">
						<a
							className="truncate text-xs font-medium transition-colors hover:text-accent-amber"
							href={url}
							rel="noreferrer"
							target="_blank"
						>
							{mod.name}
						</a>
						<span className="text-[10px] text-muted-foreground">by</span>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger
									render={
										<button
											className="text-[10px] text-accent-amber/80 transition-colors hover:text-accent-amber"
											onClick={() => setAuthor(mod.author)}
											type="button"
										/>
									}
								>
									{mod.author}
								</TooltipTrigger>
								<TooltipContent>Filter by author {mod.author}</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
					<p className="line-clamp-1 text-[11px] text-muted-foreground">
						{mod.summary}
					</p>
				</div>
			</div>

			<div className="hidden shrink-0 items-center gap-3 text-[10px] text-muted-foreground tabular-nums sm:flex">
				<span className="flex items-center gap-1">
					<Download className="size-3" />
					{formatCount(mod.downloads)}
				</span>
				<span className="flex items-center gap-1">
					<Star className="size-3" />
					{formatCount(mod.follows)}
				</span>
				<span className="flex items-center gap-1">
					<MessageSquare className="size-3" />
					{formatCount(mod.comments)}
				</span>
			</div>
		</div>
	);
};
