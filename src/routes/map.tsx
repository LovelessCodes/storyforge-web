import { createFileRoute } from "@tanstack/react-router";
import { Map as MapIcon } from "lucide-react";

import { WorldMapViewer } from "@/components/Map";
import { Reveal } from "@/components/motion/Reveal";
import { useDocumentTitle } from "@/hooks/use-document-title";

export const Route = createFileRoute("/map")({
	component: RouteComponent,
});

function RouteComponent() {
	useDocumentTitle("World Map Viewer — Story Forge");
	return (
		<main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
			<Reveal>
				<div className="text-accent-amber flex items-center gap-2 text-[10px] font-medium tracking-widest uppercase">
					<MapIcon className="size-3" /> Tools
				</div>
				<h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">World Map Viewer</h1>
				<p className="text-muted-foreground mt-3 max-w-2xl text-sm/relaxed">
					Drop in a <code className="font-mono text-[11px]">.db</code> map file exported from Story
					Forge (or the game’s map cache) and explore your world — pan, zoom and read coordinates
					without launching the game.
				</p>
			</Reveal>
			<Reveal className="min-h-[60vh] flex-1" delay={0.08}>
				<WorldMapViewer />
			</Reveal>
		</main>
	);
}
