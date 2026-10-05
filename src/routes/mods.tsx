import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowDownNarrowWide,
	ArrowUpNarrowWide,
	PackageOpen,
} from "lucide-react";

import { AuthorAutocomplete } from "@/components/auto-completes/author.auto-complete";
import { SearchInput } from "@/components/inputs/search.input";
import { ModList } from "@/components/lists/mod.list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useGameVersions } from "@/hooks/useGameVersions";
import { useMods } from "@/hooks/useMods";
import { useModTags } from "@/hooks/useModTags";
import { compareSemverDesc } from "@/lib/utils";
import { type ModsFilters, useModsFilters } from "@/stores/mod-filters";

export const Route = createFileRoute("/mods")({
	component: RouteComponent,
});

const sortOptions: Record<ModsFilters["sortBy"], string> = {
	comments: "Comments",
	created: "Created",
	downloads: "Downloads",
	follows: "Follows",
	name: "Name",
	trending: "Trending",
	updated: "Last updated",
};

const categoryOptions: Record<ModsFilters["category"], string> = {
	externaltool: "External Tool",
	mod: "Mod",
	other: "Other",
};

function RouteComponent() {
	useDocumentTitle("Mod Browser — Story Forge");
	const {
		searchText,
		setSearchText,
		selectedGameVersions,
		selectedModTags,
		addGameVersion,
		addModTag,
		removeGameVersion,
		removeModTag,
		removeAllGameVersions,
		removeAllModTags,
		category,
		setCategory,
		sortBy,
		setSortBy,
		setAuthor,
		author,
		orderDirection,
		setOrderDirection,
		side,
		setSide,
	} = useModsFilters();

	const { data: gameVersions } = useGameVersions();
	const { data: modTags } = useModTags();
	const { data: mods } = useMods();

	return (
		<main className="mx-auto flex h-[calc(100svh-3.5rem)] w-full max-w-7xl flex-col gap-4 overflow-hidden px-4 py-8 sm:px-6">
			{/* Page header */}
			<div className="flex flex-wrap items-end justify-between gap-3">
				<div>
					<h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
						Mod Browser
					</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						Search the Vintage Story ModDB — version, tag and side filters
						included.
					</p>
				</div>
				<span className="text-[11px] text-muted-foreground tabular-nums">
					{mods ? `${mods.length.toLocaleString()} mods indexed` : "Loading…"}
				</span>
			</div>

			{/* Toolbar */}
			<div className="flex flex-wrap items-center gap-2 border-b border-border py-3">
				<div className="w-full sm:w-64">
					<SearchInput onValueChange={setSearchText} value={searchText} />
				</div>

				<Select multiple value={selectedGameVersions}>
					<SelectTrigger aria-label="Filter by game versions" className="w-40">
						<SelectValue>
							{selectedGameVersions.length > 0
								? selectedGameVersions.length > 1
									? `${selectedGameVersions.length} versions`
									: selectedGameVersions[0]
								: "Game version"}
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						{gameVersions
							? [...gameVersions].sort(compareSemverDesc).map((version) => (
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
								))
							: null}
					</SelectContent>
				</Select>

				<Select multiple value={selectedModTags}>
					<SelectTrigger aria-label="Filter by mod tags" className="w-36">
						<SelectValue>
							{selectedModTags.length > 0
								? selectedModTags.length > 1
									? `${selectedModTags.length} tags`
									: selectedModTags[0].name
								: "Mod tag"}
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						{modTags
							? [...modTags]
									.sort((a, b) => a.name.localeCompare(b.name))
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
									))
							: null}
					</SelectContent>
				</Select>

				<Select
					onValueChange={(value) => setSortBy(value as ModsFilters["sortBy"])}
					value={sortBy}
				>
					<SelectTrigger aria-label="Sort mods" className="w-36">
						<SelectValue>{sortOptions[sortBy]}</SelectValue>
					</SelectTrigger>
					<SelectContent>
						{Object.entries(sortOptions).map(([key, label]) => (
							<SelectItem key={key} value={key}>
								{label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select
					onValueChange={(value) =>
						setCategory(value as ModsFilters["category"])
					}
					value={category}
				>
					<SelectTrigger aria-label="Filter by category" className="w-36">
						<SelectValue>{categoryOptions[category]}</SelectValue>
					</SelectTrigger>
					<SelectContent>
						{Object.entries(categoryOptions).map(([key, label]) => (
							<SelectItem key={key} value={key}>
								{label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Button
					aria-label={
						orderDirection === "descending" ? "Descending" : "Ascending"
					}
					onClick={() =>
						setOrderDirection(
							orderDirection === "descending" ? "ascending" : "descending",
						)
					}
					title={orderDirection === "descending" ? "Descending" : "Ascending"}
					variant="outline"
				>
					{orderDirection === "descending" ? (
						<ArrowDownNarrowWide />
					) : (
						<ArrowUpNarrowWide />
					)}
				</Button>

				<AuthorAutocomplete
					onChange={(event) => setAuthor(event.target.value)}
					value={author}
				/>

				<Tabs
					className="ms-auto"
					onValueChange={(value) => setSide(value as ModsFilters["side"])}
					value={side}
				>
					<TabsList>
						<TabsTab aria-label="Any side" value="any">
							Any
						</TabsTab>
						<TabsTab aria-label="Client side" value="client">
							Client
						</TabsTab>
						<TabsTab aria-label="Server side" value="server">
							Server
						</TabsTab>
						<TabsTab aria-label="Both sides" value="both">
							Both
						</TabsTab>
					</TabsList>
				</Tabs>

				{(selectedGameVersions.length > 0 || selectedModTags.length > 0) && (
					<Button
						onClick={() => {
							removeAllGameVersions();
							removeAllModTags();
						}}
						size="sm"
						variant="ghost"
					>
						Clear filters
					</Button>
				)}

				{(selectedGameVersions.length > 0 || selectedModTags.length > 0) && (
					<div className="flex w-full flex-wrap items-center gap-1.5">
						{selectedGameVersions.map((version) => (
							<Badge key={version} variant="secondary">
								VS {version}
								<button
									aria-label={`Remove ${version} filter`}
									className="text-muted-foreground hover:text-foreground"
									onClick={() => removeGameVersion(version)}
									type="button"
								>
									×
								</button>
							</Badge>
						))}
						{selectedModTags.map((tag) => (
							<Badge key={tag.tagid} variant="secondary">
								{tag.name}
								<button
									aria-label={`Remove ${tag.name} filter`}
									className="text-muted-foreground hover:text-foreground"
									onClick={() => removeModTag(tag)}
									type="button"
								>
									×
								</button>
							</Badge>
						))}
					</div>
				)}
			</div>

			{/* Results */}
			<div className="flex min-h-0 flex-1 flex-col">
				<div className="flex shrink-0 items-center gap-2 text-[10px] tracking-widest text-muted-foreground uppercase">
					<PackageOpen className="size-3" /> ModDB results
				</div>
				<div className="mt-2 min-h-0 flex-1">
					<ModList />
				</div>
			</div>
		</main>
	);
}
