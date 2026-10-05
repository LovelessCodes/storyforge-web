import { Link } from "@tanstack/react-router";

import { Callout, Code, Step } from "@/components/guides/GuideUI";

export function ModpacksGuide() {
	return (
		<>
			<Step n={1} title="Browse packs here or in the app">
				<p>
					The app's <strong className="text-foreground">Modpacks</strong> page
					and this website's{" "}
					<Link
						className="text-accent-primary underline-offset-2 hover:underline"
						to="/modpacks"
					>
						/modpacks
					</Link>{" "}
					show the same catalogue: search, sort by downloads or recency, and
					filter by creator. Every pack page lists its versions and the full mod
					list, with the mods linking back to the ModDB.
				</p>
			</Step>

			<Step n={2} title="Install a pack">
				<p>
					Open a pack, pick a version and hit <em>Install</em>. Give the new
					profile a name — Story Forge downloads the required game version if
					you don't have it, then pulls every mod, and applies the pack's config
					files on top. When it's done, the profile is ready on the Profiles
					page: press Play.
				</p>
				<Callout variant="tip">
					Installs count toward the pack's download number, so packing up and
					sharing your setup is appreciated.
				</Callout>
			</Step>

			<Step n={3} title="Share a pack">
				<p>
					Each pack on this website has its own page and a{" "}
					<em>Share modpack</em> button that copies the link — perfect for
					Discord or a server forum. Anyone with Story Forge can paste the link
					name into the app's search and install it.
				</p>
			</Step>

			<Step n={4} title="Publish your own (account required)">
				<p>
					Sign in with your Story Forge account — in the app or right here on
					the website — then press <em>New modpack</em> in the app. Pick a name
					and slug (availability is checked live, with suggestions if it's
					taken), write a description and paste an image URL.
				</p>
				<Callout variant="info">
					Pack images must live on the Vintage Story CDN: upload your image to{" "}
					<Code>mods.vintagestory.at/edit/mod</Code> first and paste the
					resulting <Code>moddbcdn.vintagestory.at</Code> link.
				</Callout>
			</Step>

			<Step n={5} title="Publish a version">
				<p>
					Open your pack and choose <em>New version</em>. The fastest route is{" "}
					<em>Pick from profile</em>: choose one of your profiles and Story
					Forge fills in the game version and the mods string from what's
					actually installed.
				</p>
				<p>
					Then upload the pack's configs:{" "}
					<em>Upload ModConfig folder from profile</em> zips the profile's good
					configuration and attaches it to the version. Save, and it's live for
					everyone.
				</p>
			</Step>

			<Step n={6} title="Manage what you published">
				<p>
					Packs you own are badged in the list, and row actions let you edit
					details, add versions, or delete a pack — deleting removes its
					versions and uploaded config files too. Version counts and downloads
					update as players install.
				</p>
			</Step>
		</>
	);
}
