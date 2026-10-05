import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowDownNarrowWide,
	ArrowUpNarrowWide,
	CloudOff,
	PackageOpen,
	Search,
} from "lucide-react";
import { useMemo } from "react";
import { ModpackCard } from "@/components/modpacks/ModpackCard";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthSession } from "@/hooks/use-auth-session";
import { useModpacks } from "@/hooks/use-modpacks";
import { stripped } from "@/lib/helpers";
import { type ModpackItem, toTime } from "@/lib/modpacks";

type SortBy = "downloads" | "updated" | "created" | "name";
type Order = "asc" | "desc";

interface ModpacksSearch {
	owner?: string;
	q?: string;
	sort?: SortBy;
	order?: Order;
}

const sortOptions: { label: string; value: SortBy }[] = [
	{ label: "Most downloads", value: "downloads" },
	{ label: "Recently updated", value: "updated" },
	{ label: "Newest", value: "created" },
	{ label: "Name", value: "name" },
];

export const Route = createFileRoute("/modpacks/")({
	component: ModpacksPage,
	validateSearch: (search: Record<string, unknown>): ModpacksSearch => ({
		order: search.order === "asc" ? "asc" : undefined,
		owner:
			typeof search.owner === "string" && search.owner
				? search.owner
				: undefined,
		q: typeof search.q === "string" && search.q ? search.q : undefined,
		sort:
			search.sort === "downloads" ||
			search.sort === "updated" ||
			search.sort === "created" ||
			search.sort === "name"
				? search.sort
				: undefined,
	}),
});

function filterAndSort(
	modpacks: ModpackItem[],
	search: ModpacksSearch,
): ModpackItem[] {
	const query = search.q ? stripped(search.q).toLowerCase() : "";
	const owner = search.owner ? stripped(search.owner).toLowerCase() : "";

	const filtered = modpacks.filter((modpack) => {
		if (owner.length > 0) {
			if (
				!stripped(modpack.owner?.name ?? "")
					.toLowerCase()
					.includes(owner)
			) {
				return false;
			}
		}
		if (query.length > 0) {
			return (
				stripped(modpack.name).toLowerCase().includes(query) ||
				stripped(modpack.description).toLowerCase().includes(query)
			);
		}
		return true;
	});

	const direction = search.order === "asc" ? 1 : -1;
	return [...filtered].sort((a, b) => {
		switch (search.sort ?? "downloads") {
			case "name":
				return direction * stripped(a.name).localeCompare(stripped(b.name));
			case "created":
				return direction * (toTime(a.createdAt) - toTime(b.createdAt));
			case "updated":
				return direction * (toTime(a.updatedAt) - toTime(b.updatedAt));
			default:
				return direction * (a.downloads - b.downloads);
		}
	});
}

function ModpacksPage() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const { data, isPending, error } = useModpacks();
	const { user, isLoading: sessionLoading } = useAuthSession();

	const modpacks = useMemo(
		() => filterAndSort(data?.modpacks ?? [], search),
		[data, search],
	);

	const sort = search.sort ?? "downloads";
	const order = search.order ?? "desc";

	const setSearch = (patch: Partial<ModpacksSearch>) => {
		void navigate({
			replace: true,
			search: (prev) => ({ ...prev, ...patch }),
			to: "/modpacks",
		});
	};

	const hasFilters = Boolean(search.q) || Boolean(search.owner);

	return (
		<main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6">
			{/* Page header */}
			<Reveal className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
						Modpacks
					</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						Community-published modpacks for Vintage Story — install them
						straight from Story Forge.
					</p>
				</div>
				{!sessionLoading && !user ? (
					<div className="flex items-center gap-2 text-[11px] text-muted-foreground">
						<CloudOff className="size-3.5 shrink-0" />
						<p>
							<Link
								className="text-accent-primary underline-offset-2 hover:underline"
								to="/auth"
							>
								Sign in
							</Link>{" "}
							to connect your Story Forge account.
						</p>
					</div>
				) : null}
			</Reveal>

			{/* Filters */}
			<div className="mt-8 flex flex-wrap items-center gap-2">
				<div className="relative w-full sm:w-72">
					<Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
					<Input
						aria-label="Search modpacks"
						className="pl-8"
						onChange={(event) =>
							setSearch({ q: event.target.value || undefined })
						}
						placeholder="Search modpacks…"
						type="search"
						value={search.q ?? ""}
					/>
				</div>

				<Select
					items={sortOptions}
					onValueChange={(value) => {
						if (value) setSearch({ sort: value as SortBy });
					}}
					value={sort}
				>
					<SelectTrigger aria-label="Sort modpacks" className="w-44">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{sortOptions.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Button
					aria-label={order === "desc" ? "Sort descending" : "Sort ascending"}
					onClick={() =>
						setSearch({ order: order === "desc" ? "asc" : "desc" })
					}
					size="icon"
					title={order === "desc" ? "Descending" : "Ascending"}
					variant="outline"
				>
					{order === "desc" ? <ArrowDownNarrowWide /> : <ArrowUpNarrowWide />}
				</Button>

				<div className="relative w-full sm:w-56">
					<Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
					<Input
						aria-label="Filter by owner"
						className="pl-8"
						onChange={(event) =>
							setSearch({ owner: event.target.value || undefined })
						}
						placeholder="Filter by creator…"
						type="search"
						value={search.owner ?? ""}
					/>
				</div>

				{hasFilters && (
					<Button
						onClick={() => setSearch({ owner: undefined, q: undefined })}
						size="sm"
						variant="ghost"
					>
						Clear
					</Button>
				)}

				<div className="ml-auto text-[11px] text-muted-foreground tabular-nums">
					{isPending
						? "Loading…"
						: `${modpacks.length} of ${data?.totalCount ?? 0} modpacks`}
				</div>
			</div>

			{/* Results */}
			{error ? (
				<div className="mt-8 flex flex-col items-center gap-3 border border-dashed border-destructive/40 p-10 text-center">
					<p className="text-xs text-destructive">
						Could not load modpacks: {error.message}
					</p>
					<Button
						onClick={() => window.location.reload()}
						size="sm"
						variant="outline"
					>
						Try again
					</Button>
				</div>
			) : isPending ? (
				<div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{Array.from({ length: 8 }, (_, index) => (
						<div
							className="border border-border bg-card p-3"
							key={`modpack-skeleton-${index.toString()}`}
						>
							<Skeleton className="aspect-video w-full" />
							<Skeleton className="mt-3 h-3 w-2/3" />
							<Skeleton className="mt-2 h-3 w-full" />
							<Skeleton className="mt-2 h-3 w-1/2" />
						</div>
					))}
				</div>
			) : modpacks.length === 0 ? (
				<div className="mt-8 flex flex-col items-center justify-center gap-3 border border-dashed border-border p-12 text-center">
					<PackageOpen className="size-6 text-muted-foreground" />
					<p className="text-xs text-muted-foreground">
						{hasFilters
							? "No modpacks match your filters."
							: "No modpacks published yet — be the first!"}
					</p>
				</div>
			) : (
				<div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{modpacks.map((modpack, index) => (
						<ModpackCard
							index={index}
							isOwner={Boolean(user && user.id === modpack.owner?.id)}
							key={modpack.id}
							modpack={modpack}
						/>
					))}
				</div>
			)}
		</main>
	);
}
