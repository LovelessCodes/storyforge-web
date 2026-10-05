import { measureElement, useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useRef } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useMods } from "@/hooks/useMods";
import { useModsFilters } from "@/stores/mod-filters";

import { ModItem } from "../items/mod.item";

export const ModList = () => {
	const { data: mods } = useMods();
	const { selectedModTags, author, category, side, orderDirection, sortBy, searchText } =
		useModsFilters();

	const viewportRef = useRef<HTMLDivElement>(null);

	const modsList = mods
		?.filter((mod) => {
			if (selectedModTags.length > 0) {
				return selectedModTags.every((tag) => mod.tags.includes(tag.name));
			}
			return true;
		})
		?.filter((mod) => {
			if (author) {
				return mod.author.toLowerCase().includes(author.toLowerCase());
			}
			return true;
		})
		?.filter((mod) => mod.type === category)
		?.filter((mod) => (side === "any" ? true : mod.side === side))
		?.filter((mod) => {
			if (searchText.length) {
				if (mod.summary.toLowerCase().includes(searchText.toLowerCase())) {
					return true;
				}
				return mod.name.toLowerCase().includes(searchText.toLowerCase());
			}
			return true;
		})
		.sort((a, b) => {
			if (sortBy === "name") {
				return orderDirection === "descending"
					? b.name.localeCompare(a.name)
					: a.name.localeCompare(b.name);
			}
			if (sortBy === "updated") {
				return orderDirection === "descending"
					? new Date(b.lastreleased).getTime() - new Date(a.lastreleased).getTime()
					: new Date(a.lastreleased).getTime() - new Date(b.lastreleased).getTime();
			}
			if (sortBy === "downloads") {
				return orderDirection === "descending"
					? a.downloads - b.downloads
					: b.downloads - a.downloads;
			}
			if (sortBy === "follows") {
				return orderDirection === "descending" ? a.follows - b.follows : b.follows - a.follows;
			}
			if (sortBy === "trending") {
				return orderDirection === "descending"
					? a.trendingpoints - b.trendingpoints
					: b.trendingpoints - a.trendingpoints;
			}
			if (sortBy === "comments") {
				return orderDirection === "descending" ? a.comments - b.comments : b.comments - a.comments;
			}
			return orderDirection === "descending" ? 0 : -1;
		});

	const estimateSize = useCallback(() => 72, []);

	const rowVirtualizer = useVirtualizer({
		count: modsList?.length || 0,
		estimateSize,
		getScrollElement: () => viewportRef.current,
		measureElement,
		overscan: 20,
	});

	const items = rowVirtualizer.getVirtualItems();
	const totalSize = rowVirtualizer.getTotalSize();

	return (
		<ScrollArea
			className="border-border bg-card h-full w-full border"
			scrollFade
			viewportRef={viewportRef}
		>
			{modsList && modsList.length === 0 ? (
				<div className="grid h-full place-items-center p-10 text-center">
					<p className="text-muted-foreground text-xs">No mods match your filters.</p>
				</div>
			) : (
				<div className="relative" style={{ height: totalSize }}>
					{modsList &&
						items.map((item) => {
							const mod = modsList[item.index];
							return (
								<div
									className="border-border/60 absolute top-0 left-0 flex w-full border-b"
									data-index={item.index}
									key={mod.modid}
									ref={rowVirtualizer.measureElement}
									style={{
										transform: `translateY(${item.start}px)`,
										willChange: "transform",
									}}
								>
									<ModItem mod={mod} />
								</div>
							);
						})}
				</div>
			)}
		</ScrollArea>
	);
};
