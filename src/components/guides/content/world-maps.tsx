import { Link } from "@tanstack/react-router";

import { Callout, Code, Step } from "@/components/guides/GuideUI";

export function WorldMapsGuide() {
	return (
		<>
			<Step n={1} title="The map comes from your save">
				<p>
					Vintage Story records map pieces as you explore in-game. Until you've walked around a
					world, there is nothing to draw — the viewer will say so. Maps live next to the save, in
					the profile's <Code>Maps/</Code> folder as <Code>&lt;world&gt;.db</Code> files.
				</p>
			</Step>

			<Step n={2} title="Open a world's map in the app">
				<p>
					Go to <strong className="text-foreground">Worlds</strong> and hit <em>View Map</em> on any
					world. Drag to pan, scroll to zoom, and hover to read coordinates.
				</p>
				<p>Two extras make it genuinely useful:</p>
				<div className="grid gap-1.5">
					<p>
						<strong className="text-foreground">Waypoints</strong> — pick a player from the dropdown
						to show only their markers.
					</p>
					<p>
						<strong className="text-foreground">Prospecting</strong> — toggle the overlay to see
						where ores were found, based on the stored prospecting logs.
					</p>
				</div>
			</Step>

			<Step n={3} title="Standalone maps">
				<p>
					Worlds that no longer have a save attached still show up under <em>Maps without saves</em>{" "}
					on the same page — old explorations stay viewable without needing the original world.
				</p>
			</Step>

			<Step n={4} title="View maps on the web">
				<p>
					This website has the same viewer at{" "}
					<Link className="text-accent-primary underline-offset-2 hover:underline" to="/map">
						/map
					</Link>
					. Drop in a <Code>.db</Code> file from a profile's <Code>Maps/</Code> folder and explore
					it in the browser — no installation needed. That makes it a neat way to share a world's
					map with friends who don't use Story Forge yet.
				</p>
				<Callout variant="info">
					The file is parsed in your browser. Nothing is uploaded anywhere, and closing the tab
					leaves no trace.
				</Callout>
			</Step>
		</>
	);
}
