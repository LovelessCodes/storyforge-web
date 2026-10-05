import { Callout, Code, Step } from "@/components/guides/GuideUI";

export function InstallGuide() {
	return (
		<>
			<Step n={1} title="Download the installer">
				<p>
					Grab the build for your platform. The home page recommends the right
					one automatically, or pick manually:
				</p>
				<div className="grid gap-1.5">
					<p>
						<strong className="text-foreground">Windows</strong> —{" "}
						<Code>.msi</Code> installer (x64).
					</p>
					<p>
						<strong className="text-foreground">macOS</strong> —{" "}
						<Code>.dmg</Code> for Apple Silicon or Intel.
					</p>
					<p>
						<strong className="text-foreground">Linux</strong> — portable{" "}
						<Code>.AppImage</Code> for x64 or ARM64.
					</p>
				</div>
				<Callout variant="info">
					Every build ships from the same GitHub release. Older versions are
					available under “All releases” in the site footer.
				</Callout>
			</Step>

			<Step n={2} title="First launch on Windows">
				<p>
					Windows may show a SmartScreen warning because the installer is not
					signed with a paid certificate. Click <em>More info</em>, then{" "}
					<em>Run anyway</em> — and carry on.
				</p>
				<Callout variant="warning">
					If your organisation blocks unrecognised installers, ask your IT team
					before bypassing anything.
				</Callout>
			</Step>

			<Step n={3} title="First launch on macOS">
				<p>
					macOS will likely refuse the first open with{" "}
					<em>“Apple could not verify Story Forge”</em>. Open{" "}
					<strong className="text-foreground">
						System Settings → Privacy &amp; Security
					</strong>
					, scroll down and click <em>Open Anyway</em> next to Story Forge. Then
					confirm once more — macOS remembers the choice.
				</p>
				<p>
					Alternatively, right-click the app and choose <em>Open</em> from the
					context menu.
				</p>
				<p>
					If you prefer the terminal — or macOS doesn't offer the{" "}
					<em>Open Anyway</em> button — you can clear the download quarantine
					flag yourself:
				</p>
				<pre className="border border-border bg-background p-3 font-mono text-[10px] break-words whitespace-pre-wrap text-foreground">
					xattr -cr "/Applications/Story Forge.app"
				</pre>
				<p>
					This is exactly what <em>Open Anyway</em> does under the hood; after
					it, the app launches normally. Adjust the path if you installed Story
					Forge somewhere else.
				</p>
				<Callout variant="info">
					Story Forge is community-funded and not notarised by Apple. The
					message is expected; the warning is about a missing signature, not
					about anything the app does.
				</Callout>
			</Step>

			<Step n={4} title="First launch on Linux">
				<p>AppImages need the executable bit before they run. In a terminal:</p>
				<pre className="border border-border bg-background p-3 font-mono text-[10px] break-words whitespace-pre-wrap text-foreground">
					chmod +x StoryForge_*.AppImage{"\n"}
					./StoryForge_*.AppImage
				</pre>
				<Callout variant="tip">
					If the AppImage fails with a FUSE error, run it with{" "}
					<Code>--appimage-extract-and-run</Code> instead — or install FUSE via
					your package manager.
				</Callout>
			</Step>

			<Step n={5} title="Let Story Forge find your setup">
				<p>
					On first launch the app creates a default profile and scans for two
					things: an existing Vintage Story data folder and any game installs.
					If it finds something, a banner on the Profiles page offers to adopt
					it — nothing is moved unless you say so.
				</p>
				<p>
					Profiles live in your user data folder by default. You can move that
					whole folder later from the app's settings.
				</p>
			</Step>

			<Step n={6} title="Next: bring your data across">
				<p>
					If you already play Vintage Story — or use another launcher — the two
					migration guides below walk through importing your mods, worlds and
					settings. Otherwise, create a profile and Story Forge will download
					your chosen game version on first play.
				</p>
			</Step>
		</>
	);
}
