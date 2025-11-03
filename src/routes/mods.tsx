import { createFileRoute } from "@tanstack/react-router";
import { useId } from "react";
import { AuthorAutocomplete } from "@/components/auto-completes/author.auto-complete";
import { SearchInput } from "@/components/inputs/search.input";
import { ModList } from "@/components/lists/mod.list";
import { TextSwitch } from "@/components/switches/text.switch";
import SideTabList from "@/components/tab-lists/side.tab-list";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useGameVersions } from "@/hooks/useGameVersions";
import { useModTags } from "@/hooks/useModTags";
import { cn, compareSemverDesc } from "@/lib/utils";
import { type ModsFilters, useModsFilters } from "@/stores/mod-filters";

export const Route = createFileRoute("/mods")({
	component: RouteComponent,
});

function RouteComponent() {
	const {
		searchText,
		setSearchText,
		selectedGameVersions,
		selectedModTags,
		addGameVersion,
		addModTag,
		removeGameVersion,
		removeModTag,
		category,
		setCategory,
		sortBy,
		setSortBy,
		setAuthor,
		author,
		orderDirection,
		setOrderDirection,
	} = useModsFilters();
	const id = useId();

	const sortOptions: Record<ModsFilters["sortBy"], string> = {
		comments: "Comments",
		created: "Created",
		downloads: "Downloads",
		follows: "Follows",
		name: "Name",
		trending: "Trending",
		updated: "Last Updated",
	};

	const categoryOptions: Record<ModsFilters["category"], string> = {
		externaltool: "External Tool",
		mod: "Mod",
		other: "Other",
	};

	const { data: gameVersions } = useGameVersions();
	const { data: modTags } = useModTags();

	return (
		<div className="flex flex-col gap-2 w-full h-[80vh]">
			<div className="flex gap-2 flex-wrap items-center h-fit sticky top-0 bg-background/10 backdrop-blur-md z-10 px-4 py-2">
				<SearchInput
					className="text-foreground"
					onValueChange={setSearchText}
					value={searchText}
				/>
				<Select multiple value={selectedGameVersions}>
					<SelectTrigger className="w-40 h-9">
						<span
							className={cn(
								"pointer-events-none absolute start-1 z-10 block -translate-y-1/2 inline-flex text-muted-foreground px-2 transition-all",
								selectedGameVersions.length > 0
									? "top-0 bg-background text-xs"
									: "top-1/2 bg-transparent",
							)}
						>
							Game Version(s)
						</span>
						<SelectValue>
							{selectedGameVersions.length > 0
								? selectedGameVersions.length > 1
									? `${selectedGameVersions.length} versions`
									: selectedGameVersions[0]
								: null}
						</SelectValue>
					</SelectTrigger>
					<SelectContent align="start" alignItemWithTrigger={false}>
						{gameVersions?.sort(compareSemverDesc).map((version) => (
							<SelectItem
								key={version}
								onClick={() =>
									selectedGameVersions.includes(version)
										? removeGameVersion(version)
										: addGameVersion(version)
								}
								value={version}
							>
								{version}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select multiple value={selectedModTags}>
					<SelectTrigger className="w-40 h-9">
						<span
							className={cn(
								"pointer-events-none absolute start-1 z-10 block -translate-y-1/2 inline-flex text-muted-foreground px-2 transition-all",
								selectedModTags.length > 0
									? "top-0 bg-background text-xs"
									: "top-1/2 bg-transparent",
							)}
						>
							Mod Tag(s)
						</span>
						<SelectValue>
							{selectedModTags.length > 0
								? selectedModTags.length > 1
									? `${selectedModTags.length} tags`
									: selectedModTags[0].name
								: null}
						</SelectValue>
					</SelectTrigger>
					<SelectContent align="start" alignItemWithTrigger={false}>
						{modTags
							?.sort((a, b) => a.name.localeCompare(b.name))
							.map((tag) => (
								<SelectItem
									key={tag.tagid}
									onClick={() =>
										selectedModTags.includes(tag)
											? removeModTag(tag)
											: addModTag(tag)
									}
									value={tag}
								>
									{tag.name}
								</SelectItem>
							))}
					</SelectContent>
				</Select>
				<div className="group relative">
					<label
						className="bg-background text-muted-foreground pointer-events-none absolute start-1 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium group-has-disabled:opacity-50"
						htmlFor={`mod-sort-select-${id}`}
					>
						Sort by
					</label>
					<Select
						id={`mod-sort-select-${id}`}
						onValueChange={(value) => setSortBy(value as ModsFilters["sortBy"])}
						value={sortBy}
					>
						<SelectTrigger>
							{sortBy
								? `${sortOptions[sortBy as keyof typeof sortOptions]}`
								: "Sort by"}
						</SelectTrigger>
						<SelectContent align="start" alignItemWithTrigger={false}>
							{Object.entries(sortOptions).map(([key, value]) => (
								<SelectItem key={key} value={key}>
									{value}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="group relative">
					<label
						className="bg-background text-muted-foreground pointer-events-none absolute start-1 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium group-has-disabled:opacity-50"
						htmlFor={`mod-category-select-${id}`}
					>
						Category
					</label>
					<Select
						id={`mod-category-select-${id}`}
						onValueChange={(value) =>
							setCategory(value as ModsFilters["category"])
						}
						value={category}
					>
						<SelectTrigger>
							{category
								? `${categoryOptions[category as keyof typeof categoryOptions]}`
								: "Category"}
						</SelectTrigger>
						<SelectContent align="start" alignItemWithTrigger={false}>
							{Object.entries(categoryOptions).map(([key, value]) => (
								<SelectItem key={key} value={key}>
									{value}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<TextSwitch
					checked={orderDirection === "descending"}
					onCheckedChange={(checked) =>
						setOrderDirection(checked ? "descending" : "ascending")
					}
					textChecked="Asc"
					textUnchecked="Desc"
				/>
				<AuthorAutocomplete
					onChange={(e) => setAuthor(e.target.value)}
					value={author}
				/>
				<SideTabList />
			</div>
			<ModList />
		</div>
	);
}
