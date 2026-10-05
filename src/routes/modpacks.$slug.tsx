import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	Boxes,
	Check,
	Download,
	Package,
	Share2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { ModpackImage } from "@/components/modpacks/ModpackImage";
import { ModpackVersionCard } from "@/components/modpacks/ModpackVersionCard";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useModpack } from "@/hooks/use-modpacks";
import { formatCount, latestVersion, timeAgo, toTime } from "@/lib/modpacks";

export const Route = createFileRoute("/modpacks/$slug")({
	component: ModpackDetailPage,
});

function ModpackDetailPage() {
	const { slug } = Route.useParams();
	const { data: modpack, isPending, error } = useModpack(slug);
	const [copied, setCopied] = useState(false);

	useDocumentTitle(
		modpack ? `${modpack.name} — Story Forge Modpacks` : "Modpacks",
	);

	const sortedVersions = useMemo(
		() =>
			[...(modpack?.modpackVersions ?? [])].sort(
				(a, b) => toTime(b.createdAt) - toTime(a.createdAt),
			),
		[modpack],
	);

	const latest = modpack ? latestVersion(modpack) : null;

	const share = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			setCopied(true);
			setTimeout(() => setCopied(false), 1600);
		} catch {
			// Clipboard unavailable — ignore.
		}
	};

	if (isPending) {
		return (
			<main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
				<Skeleton className="h-3 w-28" />
				<div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_1fr]">
					<Skeleton className="aspect-video w-full" />
					<div className="grid content-start gap-4">
						<Skeleton className="h-7 w-2/3" />
						<Skeleton className="h-4 w-1/3" />
						<Skeleton className="h-20 w-full" />
						<Skeleton className="h-9 w-40" />
					</div>
				</div>
			</main>
		);
	}

	if (error || !modpack) {
		return (
			<main className="mx-auto grid w-full max-w-5xl flex-1 place-items-center px-4 py-24 text-center sm:px-6">
				<div className="grid justify-items-center gap-4">
					<Package className="size-8 text-muted-foreground" />
					<h1 className="text-xl font-bold">Modpack not found</h1>
					<p className="max-w-sm text-xs text-muted-foreground">
						{error?.message && error.message !== "Request failed (404)"
							? error.message
							: "This modpack may have been deleted or renamed."}
					</p>
					<Button render={<Link to="/modpacks" />} size="sm" variant="outline">
						<ArrowLeft /> All modpacks
					</Button>
				</div>
			</main>
		);
	}

	return (
		<main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
			<Link
				className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
				to="/modpacks"
			>
				<ArrowLeft className="size-3.5" /> All modpacks
			</Link>

			{/* Hero */}
			<div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_1fr]">
				<Reveal>
					<div className="border border-border bg-card p-1.5">
						<ModpackImage
							alt={modpack.name}
							className="aspect-video w-full"
							iconClassName="size-8"
							src={modpack.imageUrl}
						/>
					</div>
				</Reveal>

				<Reveal className="grid content-start gap-4" delay={0.05}>
					<div>
						<h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
							{modpack.name}
						</h1>
						<p className="mt-2 text-xs text-muted-foreground">
							by{" "}
							<span className="font-medium text-foreground">
								{modpack.owner?.name ?? "Unknown"}
							</span>
							{toTime(modpack.updatedAt) ? (
								<> · updated {timeAgo(modpack.updatedAt)}</>
							) : null}
						</p>
					</div>

					<div className="grid grid-cols-3 gap-px border border-border bg-border">
						<div className="grid gap-1 bg-background px-3 py-3">
							<span className="text-[10px] tracking-widest text-muted-foreground uppercase">
								Downloads
							</span>
							<span className="text-sm font-bold tabular-nums">
								{formatCount(modpack.downloads)}
							</span>
						</div>
						<div className="grid gap-1 bg-background px-3 py-3">
							<span className="text-[10px] tracking-widest text-muted-foreground uppercase">
								Versions
							</span>
							<span className="text-sm font-bold tabular-nums">
								{modpack.modpackVersions.length}
							</span>
						</div>
						<div className="grid gap-1 bg-background px-3 py-3">
							<span className="text-[10px] tracking-widest text-muted-foreground uppercase">
								Latest
							</span>
							<span className="font-mono text-sm font-bold">
								{latest ? `v${latest.version}` : "—"}
							</span>
						</div>
					</div>

					<p className="text-xs/relaxed whitespace-pre-wrap text-muted-foreground">
						{modpack.description || "No description provided."}
					</p>

					<div className="flex flex-wrap gap-2">
						<Button onClick={share} size="lg" variant="amber">
							{copied ? <Check /> : <Share2 />}
							{copied ? "Link copied" : "Share modpack"}
						</Button>
						<Button render={<Link to="/" />} size="lg" variant="outline">
							<Download /> Get Story Forge
						</Button>
					</div>

					{latest?.gameVersion ? (
						<Badge className="w-fit" variant="outline">
							<Boxes className="size-3" /> Requires Vintage Story{" "}
							{latest.gameVersion}
						</Badge>
					) : null}
				</Reveal>
			</div>

			{/* Install steps */}
			<Reveal className="mt-10">
				<div className="grid gap-3 border border-border bg-surface/50 p-5 sm:grid-cols-[auto_1fr] sm:items-center">
					<span className="text-[10px] font-medium tracking-widest text-accent-amber uppercase">
						How to install
					</span>
					<ol className="grid gap-1 text-[11px] text-muted-foreground sm:grid-cols-3 sm:gap-6">
						<li>1. Download Story Forge for your platform.</li>
						<li>2. Open the Modpacks page in the app.</li>
						<li>3. Install “{modpack.name}” and press Play.</li>
					</ol>
				</div>
			</Reveal>

			{/* Versions */}
			<Reveal className="mt-10 grid gap-4">
				<div className="flex items-end justify-between gap-4">
					<h2 className="text-lg font-bold tracking-tight">Versions</h2>
					<span className="text-[11px] text-muted-foreground tabular-nums">
						{modpack.modpackVersions.length} published
					</span>
				</div>
				<Separator />
				{sortedVersions.length === 0 ? (
					<div className="flex flex-col items-center gap-2 border border-dashed border-border p-10 text-center">
						<Boxes className="size-5 text-muted-foreground" />
						<p className="text-xs text-muted-foreground">
							This modpack has no published versions yet.
						</p>
					</div>
				) : (
					<div className="grid gap-3">
						{sortedVersions.map((version) => (
							<ModpackVersionCard
								key={version.id}
								slug={modpack.slug}
								version={version}
							/>
						))}
					</div>
				)}
			</Reveal>
		</main>
	);
}
