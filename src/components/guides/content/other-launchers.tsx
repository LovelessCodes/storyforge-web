import { Callout, Code, Step } from "@/components/guides/GuideUI";

const launchers = [
	{
		carried: "Playtime, launch arguments, environment variables.",
		launcher: "VS Launcher / RiftLauncher",
		leftBehind: "Instance icons (each launcher has its own artwork).",
		modes: "Move or copy",
	},
	{
		carried:
			"Playtime, launch parameters, environment variables. Its game builds can be linked on the Versions page.",
		launcher: "Rustory",
		leftBehind: "Nothing is moved — the instance folder also holds Rustory's manifest and backups.",
		modes: "Copy only",
	},
	{
		carried: "Mods, settings and worlds.",
		launcher: "GruntLauncher",
		leftBehind:
			"GruntLauncher's instance file and mod logo cache are removed from the imported profile.",
		modes: "Move or copy",
	},
	{
		carried:
			"Playtime, launch arguments and environment variables. Disabled mods stay disabled in mods-disabled/.",
		launcher: "Lithic",
		leftBehind: "Launch wrappers (gamemoderun, prime-run) have no equivalent and are dropped.",
		modes: "Copy only",
	},
	{
		carried: "The data folder becomes the profile; the runtime folder is linked as a game version.",
		launcher: "Yelloowstone",
		leftBehind:
			"Moving a data folder does remove it from Yelloowstone's list; the runtime folder is never moved.",
		modes: "Move or copy",
	},
	{
		carried: "Names, game versions, mods and worlds.",
		launcher: "MVL",
		leftBehind:
			"The modpack icon and MVL's VSRun launch command — Story Forge owns how profiles launch.",
		modes: "Move or copy",
	},
	{
		carried: "Launch arguments, environment variables, pin state and playtime.",
		launcher: "Waxlight Launcher",
		leftBehind: "Instance covers.",
		modes: "Move or copy",
	},
	{
		carried: "The pack's data folder and mods.",
		launcher: "Cairn",
		leftBehind:
			"Everything stays with Cairn: its manifest, lock and local-state files are untouched.",
		modes: "Copy only",
	},
];

export function OtherLaunchersGuide() {
	return (
		<>
			<Step n={1} title="Open the Profiles page">
				<p>
					Story Forge scans for other launchers when the Profiles page loads. If it finds instances,
					a banner appears for each launcher — VS Launcher and RiftLauncher, Rustory, GruntLauncher,
					Lithic, Yelloowstone, MVL, Waxlight and Cairn. Installations from the previous Story Forge
					release get their own banner too.
				</p>
				<Callout variant="info">
					Nothing is detected? The other launcher's data must still exist on this machine, and each
					banner can be dismissed individually — a dismissed banner stays out of the way.
				</Callout>
			</Step>

			<Step n={2} title="Review what was found">
				<p>
					Click <em>Import</em> on a banner to see the list. Each entry shows the instance's name,
					game version, size, mod count and whether it has worlds — and anything already imported is
					marked, so repeating a scan never duplicates profiles.
				</p>
			</Step>

			<Step n={3} title="Choose move or copy">
				<p>
					<strong className="text-foreground">Move</strong> relocates the folder into Story Forge —
					fastest, no extra disk space, but the other launcher loses that instance.{" "}
					<strong className="text-foreground">Copy</strong> duplicates it and leaves the original in
					place.
				</p>
				<p>
					Some launchers only offer copy, because the instance folder also holds that launcher's own
					manifest and lock files. The sheet tells you which applies before anything happens.
				</p>
			</Step>

			<Step n={4} title="Import">
				<p>
					Press the import button and each selected folder becomes a profile. If something can't be
					imported, the sheet lists it with the reason — nothing fails silently. After importing,
					the launcher's banner disappears (or marks the entries as already imported).
				</p>
			</Step>

			<Step n={5} title="Launcher cheat sheet">
				<div className="hidden sm:block">
					<table className="border-border w-full border text-left text-[10px]">
						<thead className="bg-background text-muted-foreground text-[9px] tracking-widest uppercase">
							<tr>
								<th className="border-border border-b px-3 py-2 font-medium">Launcher</th>
								<th className="border-border border-b px-3 py-2 font-medium">Import</th>
								<th className="border-border border-b px-3 py-2 font-medium">What carries over</th>
								<th className="border-border border-b px-3 py-2 font-medium">Left behind</th>
							</tr>
						</thead>
						<tbody className="divide-border/60 divide-y">
							{launchers.map((row) => (
								<tr key={row.launcher}>
									<td className="text-foreground px-3 py-2 font-medium">{row.launcher}</td>
									<td className="px-3 py-2 whitespace-nowrap">{row.modes}</td>
									<td className="px-3 py-2">{row.carried}</td>
									<td className="px-3 py-2">{row.leftBehind}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className="grid gap-2 sm:hidden">
					{launchers.map((row) => (
						<div className="border-border bg-background grid gap-1.5 border p-3" key={row.launcher}>
							<div className="flex items-center justify-between gap-2">
								<span className="text-foreground text-xs font-medium">{row.launcher}</span>
								<span className="border-border text-muted-foreground border px-1.5 py-0.5 text-[9px]">
									{row.modes}
								</span>
							</div>
							<p className="text-[10px]/relaxed">
								<span className="text-foreground">Carries over:</span> {row.carried}
							</p>
							<p className="text-[10px]/relaxed">
								<span className="text-foreground">Left behind:</span> {row.leftBehind}
							</p>
						</div>
					))}
				</div>
				<p>
					Legacy Story Forge installations work the same way: pick move or copy and the old{" "}
					<Code>installation.json</Code> manifests are converted to profiles.
				</p>
			</Step>

			<Step n={6} title="Link any game builds they left behind">
				<p>
					Several launchers keep their own game installs. Rather than downloading a version twice,
					open <strong className="text-foreground">Versions → Link existing</strong> and point Story
					Forge at the folder containing the game files. It is registered in place — nothing is
					copied or moved, and unlinking later leaves the folder exactly as it was.
				</p>
				<Callout variant="tip">
					Linked versions behave like downloaded ones: pick them in a profile and press Play.
				</Callout>
			</Step>
		</>
	);
}
