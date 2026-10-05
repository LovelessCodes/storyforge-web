import { Callout, Code, Step } from "@/components/guides/GuideUI";

export function ProfilesGuide() {
	return (
		<>
			<Step n={1} title="What a profile actually is">
				<p>
					A profile is one self-contained game data folder — its own{" "}
					<Code>Mods/</Code>, <Code>Saves/</Code>, <Code>ModConfig/</Code> and
					settings — paired with one Vintage Story version. Two profiles never
					see each other's mods, so a heavy server pack can't break your vanilla
					world.
				</p>
				<Callout variant="info">
					Think of profiles the way other launchers think of "instances" or
					"modpacks": one folder per way you play.
				</Callout>
			</Step>

			<Step n={2} title="Create a profile">
				<p>
					Open <strong className="text-foreground">Profiles</strong> and click{" "}
					<em>New Profile</em>. Give it a name and pick a game version, then
					optionally choose an icon, launch arguments and environment variables.
					If the version isn't installed yet, Story Forge downloads it the first
					time you press Play.
				</p>
			</Step>

			<Step n={3} title="Switch profiles and play">
				<p>
					The profile switcher lives at the top of the sidebar. Select one, then
					use the amber <em>Play</em> button — or <em>Download</em> if the
					version is still missing. <em>Open Folder</em> in the sidebar jumps
					straight to the active profile's data folder.
				</p>
			</Step>

			<Step n={4} title="Clone, rename and edit">
				<p>
					Every row on the Profiles page has its own actions: edit the settings,
					clone the profile (a perfect way to branch before trying a mod), or
					rename it. Cloning copies mods, worlds and configs into a new
					independent folder.
				</p>
			</Step>

			<Step n={5} title="Delete — with a safety net">
				<p>
					Deleting a profile moves it to the{" "}
					<strong className="text-foreground">Deleted profiles</strong> section
					instead of erasing it, so a mis-click is easy to undo. Restore it from
					there, or purge single entries (or everything) when you're sure.
				</p>
				<Callout variant="warning">
					Purge is permanent — the deleted profile's folder is removed from
					disk.
				</Callout>
			</Step>

			<Step n={6} title="Back up before risky changes">
				<p>
					Open <em>Backups</em> on any profile to snapshot its mods, worlds and
					configs (logs are left out to keep snapshots small). You can back up
					on demand, restore a snapshot in place, and set a profile to{" "}
					<em>back up before each launch</em> with a cap on how many snapshots
					to keep.
				</p>
				<Callout variant="tip">
					Auto-backup before launch is cheap insurance for worlds you care about
					— turn it on once and forget it.
				</Callout>
			</Step>

			<Step n={7} title="Share or move a profile">
				<p>
					Export a profile as a file, or copy it as a compact share code
					starting with <Code>SF1.</Code> — both carry the profile's settings
					and mod list. On another machine, use{" "}
					<strong className="text-foreground">Import</strong> to paste the code
					or pick the file; mods are downloaded automatically.
				</p>
			</Step>

			<Step n={8} title="Adopt your existing game data">
				<p>
					If you already have a stock <Code>VintagestoryData</Code> folder,
					Story Forge offers to adopt it as a profile — in place. Nothing is
					copied or moved; the profile simply points at the folder you already
					use. Deleting an adopted profile only unregisters it, leaving the data
					untouched.
				</p>
			</Step>
		</>
	);
}
