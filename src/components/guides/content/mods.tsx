import { Callout, Code, Step } from "@/components/guides/GuideUI";

export function ModsGuide() {
	return (
		<>
			<Step n={1} title="Find what you need">
				<p>
					The <strong className="text-foreground">Mods</strong> page is the full
					Vintage Story ModDB. Narrow it down with:
				</p>
				<div className="grid gap-1.5">
					<p>
						<strong className="text-foreground">Search</strong> — press{" "}
						<Code>Ctrl/⌘ + K</Code> anywhere on the page to jump to the search
						box.
					</p>
					<p>
						<strong className="text-foreground">Game version &amp; tags</strong>{" "}
						— select multiple; results must match all of them.
					</p>
					<p>
						<strong className="text-foreground">Side</strong> — client, server
						or both, for mods that care.
					</p>
					<p>
						<strong className="text-foreground">Author</strong> — start typing
						and pick from the autocomplete; the row's author name links back to
						the same filter.
					</p>
				</div>
			</Step>

			<Step n={2} title="Install to the right place">
				<p>
					Use <em>Install mod</em> on a row, or open a mod for its details. If a
					profile is active, the mod installs straight into it — otherwise
					you'll be asked to pick a destination: any profile or hosted server.
					The detail view also lets you choose a specific version rather than
					latest.
				</p>
				<Callout variant="tip">
					Installing straight into a hosted server's data folder works the same
					way — pick the server as the destination.
				</Callout>
			</Step>

			<Step n={3} title="Keep everything updated">
				<p>
					Installed mods show their current version, plus <em>Update</em> when a
					newer release exists. Use <em>Update All</em> to bring everything up
					at once — it shows the count before you commit.
				</p>
				<p>
					The update sheet lets you pick any version, so downgrading when a new
					release misbehaves is just as easy.
				</p>
			</Step>

			<Step n={4} title="Pin the versions that must not move">
				<p>
					Pinning a mod locks it to its current version and excludes it from{" "}
					<em>Update All</em>. Use it for mods your server or save depends on —
					the pin tooltip always shows what it's pinned to.
				</p>
			</Step>

			<Step n={5} title="Missing dependencies fix themselves">
				<p>
					Story Forge reads each mod's manifest and knows what it needs. When
					something's missing, a banner shows the count — one click on{" "}
					<em>Install missing</em> queues every dependency, and those installs
					resolve their own dependencies in turn.
				</p>
			</Step>

			<Step n={6} title="Remove cleanly">
				<p>
					<em>Remove</em> deletes the mod from the chosen destination after a
					confirmation showing exactly what disappears. Nothing is left behind
					in the mods folder.
				</p>
				<Callout variant="warning">
					Removal is permanent — if a config or world depends on the mod, the
					game may regenerate or complain until you reinstall it.
				</Callout>
			</Step>
		</>
	);
}
