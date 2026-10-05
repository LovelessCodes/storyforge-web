import { Link } from "@tanstack/react-router";
import { ArrowRight, Layers } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { ModpackCard } from "@/components/modpacks/ModpackCard";
import { Reveal } from "@/components/motion/Reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { useModpacks } from "@/hooks/use-modpacks";
import { toTime } from "@/lib/modpacks";

export function ModpacksPreview() {
	const { t } = useTranslation();
	const { data, isPending } = useModpacks();

	const topModpacks = useMemo(
		() =>
			[...(data?.modpacks ?? [])]
				.sort((a, b) => b.downloads - a.downloads || toTime(b.updatedAt) - toTime(a.updatedAt))
				.slice(0, 4),
		[data],
	);

	return (
		<section className="border-border bg-surface/30 border-b">
			<div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
				<Reveal className="flex flex-wrap items-end justify-between gap-4">
					<div className="max-w-2xl">
						<p className="text-accent-amber flex items-center gap-2 text-[10px] font-medium tracking-widest uppercase">
							<Layers className="size-3" /> {t("home.modpacks.eyebrow")}
						</p>
						<h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
							{t("home.modpacks.title")}
						</h2>
						<p className="text-muted-foreground mt-3 text-sm/relaxed">
							{t("home.modpacks.description")}
						</p>
					</div>
					<Link
						className="text-accent-primary hover:text-accent-amber group inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
						to="/modpacks"
					>
						{t("home.modpacks.browseAll")}
						<ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
					</Link>
				</Reveal>

				<div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{isPending
						? Array.from({ length: 4 }, (_, index) => (
								<div
									className="border-border bg-card border p-3"
									key={`skeleton-${index.toString()}`}
								>
									<Skeleton className="aspect-video w-full" />
									<Skeleton className="mt-3 h-3 w-2/3" />
									<Skeleton className="mt-2 h-3 w-full" />
									<Skeleton className="mt-2 h-3 w-1/2" />
								</div>
							))
						: topModpacks.map((modpack, index) => (
								<ModpackCard index={index} key={modpack.id} modpack={modpack} />
							))}
				</div>
			</div>
		</section>
	);
}
