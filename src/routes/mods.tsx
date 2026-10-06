import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownNarrowWide, ArrowUpNarrowWide, PackageOpen } from "lucide-react";

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
import { compareSemverDesc, joinSearchList, splitSearchList } from "@/lib/utils";

const sortOptions = {
	comments: "Comments",
	created: "Created",
	downloads: "Downloads",
	follows: "Follows",
	name: "Name",
	trending: "Trending",
	updated: "Last updated",
} as const;
type SortBy = keyof typeof sortOptions;

const categoryOptions = {
	externaltool: "External Tool",
	mod: "Mod",
	other: "Other",
} as const;
type Category = keyof typeof categoryOptions;

const sides = ["any", "client", "server", "both"] as const;
type Side = (typeof sides)[number];

const orders = ["asc", "desc"] as const;
type Order = (typeof orders)[number];

/** URL search state for the mod browser — every filter is shareable/bookmarkable. */
interface ModsSearch {
	q?: string;
	/** Comma-separated Vintage Story versions (`1.20.4,1.21.0`). */
	versions?: string;
	/** Comma-separated tag names. */
	tags?: string;
	sort?: SortBy;
	order?: Order;
	side?: Side;
	category?: Category;
	author?: string;
}

function cleanString(value: unknown): string | undefined {
	return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function isKeyOf<T extends string>(options: Record<T, unknown>, value: unknown): value is T {
	return typeof value === "string" && Object.prototype.hasOwnProperty.call(options, value);
}

function oneOf<T extends string>(options: readonly T[], value: unknown): value is T {
	return typeof value === "string" && (options as readonly string[]).includes(value);
}

export const Route = createFileRoute("/mods")({
	component: RouteComponent,
	validateSearch: (search: Record<string, unknown>): ModsSearch => ({
		author: cleanString(search.author),
		category: isKeyOf(categoryOptions, search.category) ? search.category : undefined,
		order: oneOf(orders, search.order) ? search.order : undefined,
		q: cleanString(search.q),
		side: oneOf(sides, search.side) ? search.side : undefined,
		sort: isKeyOf(sortOptions, search.sort) ? search.sort : undefined,
		tags: cleanString(search.tags),
		versions: cleanString(search.versions),
	}),
});

function RouteComponent() {
	useDocumentTitle("Mod Browser — Story Forge");
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	const searchText = search.q ?? "";
	const selectedGameVersions = splitSearchList(search.versions);
	const selectedModTags = splitSearchList(search.tags);
	const sortBy = search.sort ?? "trending";
	const order = search.order ?? "asc";
	const side = search.side ?? "any";
	const category = search.category ?? "mod";
	const author = search.author ?? "";

	const { data: gameVersions } = useGameVersions();
	const { data: modTags } = useModTags();
	const { data: mods } = useMods(selectedGameVersions);

	const setSearch = (patch: Partial<ModsSearch>) => {
		void navigate({ replace: true, search: (prev) => ({ ...prev, ...patch }), to: "/mods" });
	};

	const toggleGameVersion = (version: string) =>
		setSearch({
			versions: joinSearchList(
				selectedGameVersions.includes(version)
					? selectedGameVersions.filter((entry) => entry !== version)
					: [...selectedGameVersions, version],
			),
		});

	const toggleModTag = (name: string) =>
		setSearch({
			tags: joinSearchList(
				selectedModTags.includes(name)
					? selectedModTags.filter((entry) => entry !== name)
					: [...selectedModTags, name],
			),
		});

	return (
		<main className="mx-auto flex h-[calc(100svh-3.5rem)] w-full max-w-7xl flex-col gap-4 overflow-hidden px-4 py-8 sm:px-6">
			{/* Page header */}
			<div className="flex flex-wrap items-end justify-between gap-3">
				<div>
					<h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Mod Browser</h1>
					<p className="text-muted-foreground mt-2 text-sm">
						Search the Vintage Story ModDB — version, tag and side filters included.
					</p>
				</div>
				<span className="text-muted-foreground text-[11px] tabular-nums">
					{mods ? `${mods.length.toLocaleString()} mods indexed` : "Loading…"}
				</span>
			</div>

			{/* Toolbar */}
			<div className="border-border flex flex-wrap items-center gap-2 border-b py-3">
				<div className="w-full sm:w-64">
					<SearchInput
						onValueChange={(value) => setSearch({ q: value || undefined })}
						value={searchText}
					/>
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
										onClick={() => toggleGameVersion(version)}
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
									: selectedModTags[0]
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
											onClick={() => toggleModTag(tag.name)}
											value={tag.name}
										>
											{tag.name}
										</SelectItem>
									))
							: null}
					</SelectContent>
				</Select>

				<Select
					onValueChange={(value) => {
						if (value) setSearch({ sort: value as SortBy });
					}}
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
					onValueChange={(value) => {
						if (value) setSearch({ category: value as Category });
					}}
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
					aria-label={order === "desc" ? "Descending" : "Ascending"}
					onClick={() => setSearch({ order: order === "desc" ? "asc" : "desc" })}
					title={order === "desc" ? "Descending" : "Ascending"}
					variant="outline"
				>
					{order === "desc" ? <ArrowDownNarrowWide /> : <ArrowUpNarrowWide />}
				</Button>

				<AuthorAutocomplete
					onChange={(event) => setSearch({ author: event.target.value || undefined })}
					value={author}
					versions={selectedGameVersions}
				/>

				<Tabs
					className="ms-auto"
					onValueChange={(value) => setSearch({ side: value as Side })}
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
						onClick={() => setSearch({ tags: undefined, versions: undefined })}
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
									onClick={() => toggleGameVersion(version)}
									type="button"
								>
									×
								</button>
							</Badge>
						))}
						{selectedModTags.map((tag) => (
							<Badge key={tag} variant="secondary">
								{tag}
								<button
									aria-label={`Remove ${tag} filter`}
									className="text-muted-foreground hover:text-foreground"
									onClick={() => toggleModTag(tag)}
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
				<div className="text-muted-foreground flex shrink-0 items-center gap-2 text-[10px] tracking-widest uppercase">
					<PackageOpen className="size-3" /> ModDB results
				</div>
				<div className="mt-2 min-h-0 flex-1">
					<ModList />
				</div>
			</div>
		</main>
	);
}
