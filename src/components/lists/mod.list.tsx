import { measureElement, useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useRef } from "react";
import { useMods } from "@/hooks/useMods";
import { useModsFilters } from "@/stores/mod-filters";
import { ModItem } from "../items/mod.item";

export const ModList = () => {
	const { data: mods } = useMods();
	const {
		selectedModTags,
		author,
		category,
		side,
		orderDirection,
		sortBy,
		searchText,
	} = useModsFilters();

	const parentRef = useRef<HTMLDivElement>(null);
	// If sortOrder is descending, reverse the modsList
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
				if (orderDirection === "descending") {
					return b.name.localeCompare(a.name);
				}
				return a.name.localeCompare(b.name);
			}
			if (sortBy === "updated") {
				if (orderDirection === "descending") {
					return (
						new Date(b.lastreleased).getTime() -
						new Date(a.lastreleased).getTime()
					);
				}
				return (
					new Date(a.lastreleased).getTime() -
					new Date(b.lastreleased).getTime()
				);
			}
			if (sortBy === "downloads") {
				if (orderDirection === "descending") {
					return a.downloads - b.downloads;
				}
				return b.downloads - a.downloads;
			}
			if (sortBy === "follows") {
				if (orderDirection === "descending") {
					return a.follows - b.follows;
				}
				return b.follows - a.follows;
			}
			if (sortBy === "trending") {
				if (orderDirection === "descending") {
					return a.trendingpoints - b.trendingpoints;
				}
				return b.trendingpoints - a.trendingpoints;
			}
			if (sortBy === "comments") {
				if (orderDirection === "descending") {
					return a.comments - b.comments;
				}
				return b.comments - a.comments;
			}
			if (orderDirection === "descending") {
				return 0;
			}
			return -1;
		});

	const estimateSize = useCallback(() => 81, []);

	const rowVirtualizer = useVirtualizer({
		count: modsList?.length || 0,
		estimateSize,
		getScrollElement: () => parentRef.current,
		measureElement,
		overscan: 20,
	});

	const items = rowVirtualizer.getVirtualItems();
	const totalSize = rowVirtualizer.getTotalSize();
	return (
		<div className="h-full px-4 w-full overflow-hidden">
			<div
				className="w-full bg-card p-2 rounded shadow border relative h-full overflow-auto"
				ref={parentRef}
			>
				<div className="relative" style={{ height: totalSize }}>
					{modsList &&
						items.map((item) => {
							const mod = modsList[item.index];
							return (
								<div
									className="not-last:border-b flex gap-2 absolute top-0 left-0 w-full"
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
			</div>
		</div>
	);
};
