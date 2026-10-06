import { Download, MessageSquare, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Mod } from "@/hooks/useMods";
import { formatCount } from "@/lib/modpacks";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface ModItemProps {
	mod: Mod;
	/** Called when the author name is clicked; the page turns it into a filter. */
	onFilterAuthor?: (author: string) => void;
}

export const ModItem = ({ mod, onFilterAuthor }: ModItemProps) => {
	const url = `https://mods.vintagestory.at/${mod.urlalias ?? `show/mod/${mod.assetid}`}`;

	return (
		<div className="hover:bg-surface-hover flex w-full flex-row items-center justify-between gap-4 px-3 py-2.5 transition-colors">
			<div className="flex min-w-0 flex-row items-center gap-3">
				<a href={url} rel="noreferrer" target="_blank">
					<img
						alt={mod.name}
						className="border-border size-10 shrink-0 border object-cover transition-transform duration-200 hover:scale-105"
						loading="lazy"
						src={mod.logo ?? "https://mods.vintagestory.at/web/img/mod-default.png"}
					/>
				</a>
				<div className="flex min-w-0 flex-col gap-0.5">
					<div className="flex items-center gap-1.5">
						<a
							className="hover:text-accent-amber truncate text-xs font-medium transition-colors"
							href={url}
							rel="noreferrer"
							target="_blank"
						>
							{mod.name}
						</a>
						<span className="text-muted-foreground text-[10px]">by</span>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger
									render={
										<button
											className="text-accent-amber/80 hover:text-accent-amber text-[10px] transition-colors"
											onClick={() => onFilterAuthor?.(mod.author)}
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
					<p className="text-muted-foreground line-clamp-1 text-[11px]">{mod.summary}</p>
				</div>
			</div>

			<div className="flex shrink-0 items-center gap-2">
				<div className="text-muted-foreground hidden shrink-0 items-center gap-3 text-[10px] tabular-nums sm:flex">
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
				<Button
					aria-label={`Install ${mod.name} in Story Forge`}
					render={<a href={`storyforge://install?mod=${mod.modid}`} />}
					size="icon-sm"
					title="Install in Story Forge"
					variant="outline"
				>
					<img alt="" className="size-3.5" src="/StoryForge.svg" />
				</Button>
			</div>
		</div>
	);
};
