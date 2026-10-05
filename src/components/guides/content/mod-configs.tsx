import { Callout, Code, Step } from "@/components/guides/GuideUI";

export function ModConfigsGuide() {
	return (
		<>
			<Step n={1} title="Open the configs for your active profile">
				<p>
					Select a profile, then open <strong className="text-foreground">Mod Configs</strong>.
					Story Forge lists the config files from your installed mods, read straight from the
					profile's <Code>ModConfig/</Code> folder.
				</p>
				<Callout variant="info">
					No active profile? The page tells you and links back to Profiles — configs belong to a
					profile, not to the app.
				</Callout>
			</Step>

			<Step n={2} title="Edit with the live editor">
				<p>
					The <em>Live editor</em> turns the JSON into a form: fields, toggles, expandable arrays
					and objects. It's the safest way to change values without breaking syntax — and it{" "}
					<strong className="text-foreground">auto-saves on change</strong>, so there's no save
					button to forget.
				</p>
			</Step>

			<Step n={3} title="Or drop into the code editor">
				<p>
					Switch to <em>Code editor</em> for full control — handy for copying config between
					profiles or editing structures the live view simplifies. The header shows{" "}
					<em>Unsaved changes</em> until you save, then <em>All changes saved</em>.
				</p>
				<Callout variant="warning">
					The file must stay valid JSON. If something looks wrong after saving, fix it in the code
					editor or restore the profile from a backup.
				</Callout>
			</Step>

			<Step n={4} title="When changes apply">
				<p>
					Configs are read when the game (or server) starts, so save first and relaunch to see the
					effect. For servers, use the config editor on the instance page instead — it writes the
					same files for that instance's data folder.
				</p>
			</Step>
		</>
	);
}
