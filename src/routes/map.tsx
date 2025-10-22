import { createFileRoute } from "@tanstack/react-router";
import { WorldMapViewer } from "@/components/Map";

export const Route = createFileRoute("/map")({
	component: RouteComponent,
});

function RouteComponent() {
	return <WorldMapViewer />;
}
