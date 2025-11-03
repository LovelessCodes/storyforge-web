import type { Mod } from "@/hooks/useMods";
import { useModsFilters } from "@/stores/mod-filters";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";

export const ModItem = ({ mod }: { mod: Mod }) => {
	const { setAuthor } = useModsFilters();
	return (
		<div className="flex flex-row p-2 justify-between w-full items-center">
			<div className="flex flex-row gap-2">
				<a
					href={`https://mods.vintagestory.at/${mod.urlalias ?? `show/mod/${mod.assetid}`}`}
					rel="noreferrer"
					target="_blank"
				>
					<img
						alt={mod.name}
						className="w-12 h-12 rounded hover:scale-105 transition-transform"
						loading="lazy"
						src={
							mod.logo ?? "https://mods.vintagestory.at/web/img/mod-default.png"
						}
					/>
				</a>
				<div className="flex flex-col">
					<div className="flex gap-1 items-center">
						<a
							className="hover:underline font-semibold"
							href={`https://mods.vintagestory.at/${mod.urlalias ?? `show/mod/${mod.assetid}`}`}
							rel="noreferrer"
							target="_blank"
						>
							<h3 className="font-semibold">{mod.name}</h3>
						</a>
						<p className="text-xs opacity-50">by</p>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger
									render={
										// biome-ignore lint/a11y/noStaticElementInteractions: Not really relevant
										<span
											className="text-xs opacity-50 text-orange-200 cursor-pointer"
											onClick={() => setAuthor(mod.author)}
											onKeyUp={(e) => {
												if (e.key === "Enter") {
													setAuthor(mod.author);
												}
											}}
										/>
									}
								>
									{mod.author}
								</TooltipTrigger>
								<TooltipContent>
									Click to filter by author {mod.author}
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
					<p className="text-sm text-muted-foreground line-clamp-1">
						{mod.summary}
					</p>
					<div className="flex gap-2 text-xs text-muted-foreground mt-1">
						<span>{mod.downloads} downloads</span>
						<span>{mod.follows} follows</span>
						<span>{mod.comments} comments</span>
					</div>
				</div>
			</div>
		</div>
	);
};
