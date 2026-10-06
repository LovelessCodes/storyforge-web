import { getRouteApi } from "@tanstack/react-router";
import { measureElement, useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useRef } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useMods } from "@/hooks/useMods";
import { splitSearchList } from "@/lib/utils";

import { ModItem } from "../items/mod.item";

/** Route API rather than a direct import, so this module and the route don't cycle. */
const modsRoute = getRouteApi("/mods");

export const ModList = () => {
	const search = modsRoute.useSearch();
	const navigate = modsRoute.useNavigate();

	const selectedGameVersions = splitSearchList(search.versions);
	const selectedModTags = splitSearchList(search.tags);
	const author = search.author ?? "";
	const category = search.category ?? "mod";
	const side = search.side ?? "any";
	const sortBy = search.sort ?? "trending";
	const order = search.order ?? "asc";

	const { data: mods } = useMods(selectedGameVersions);

	const viewportRef = useRef<HTMLDivElement>(null);

	const modsList = mods
		?.filter((mod) => selectedModTags.every((tag) => mod.tags.includes(tag)))
		?.filter((mod) => (author ? mod.author.toLowerCase().includes(author.toLowerCase()) : true))
		?.filter((mod) => mod.type === category)
		?.filter((mod) => (side === "any" ? true : mod.side === side))
		?.filter((mod) => {
			if (search.q) {
				if (mod.summary.toLowerCase().includes(search.q.toLowerCase())) {
					return true;
				}
				return mod.name.toLowerCase().includes(search.q.toLowerCase());
			}
			return true;
		})
		.sort((a, b) => {
			if (sortBy === "name") {
				return order === "desc" ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
			}
			if (sortBy === "updated") {
				return order === "desc"
					? new Date(b.lastreleased).getTime() - new Date(a.lastreleased).getTime()
					: new Date(a.lastreleased).getTime() - new Date(b.lastreleased).getTime();
			}
			if (sortBy === "downloads") {
				return order === "desc" ? a.downloads - b.downloads : b.downloads - a.downloads;
			}
			if (sortBy === "follows") {
				return order === "desc" ? a.follows - b.follows : b.follows - a.follows;
			}
			if (sortBy === "trending") {
				return order === "desc"
					? a.trendingpoints - b.trendingpoints
					: b.trendingpoints - a.trendingpoints;
			}
			if (sortBy === "comments") {
				return order === "desc" ? a.comments - b.comments : b.comments - a.comments;
			}
			return order === "desc" ? 0 : -1;
		});

	const filterByAuthor = (nextAuthor: string) =>
		void navigate({
			replace: true,
			search: (prev) => ({ ...prev, author: nextAuthor || undefined }),
			to: "/mods",
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
									<ModItem mod={mod} onFilterAuthor={filterByAuthor} />
								</div>
							);
						})}
				</div>
			)}
		</ScrollArea>
	);
};
