import { Callout, Code, Step } from "@/components/guides/GuideUI";

export function ServerHostingGuide() {
	return (
		<>
			<Step n={1} title="What you need">
				<p>
					A machine that can stay on while people play, the game version you want to host (Story
					Forge downloads it if missing), and a free port — the default is <Code>42420</Code>.
				</p>
				<Callout variant="warning">
					Friends outside your network need the port forwarded on your router (or a VPN like
					Tailscale). Allow Story Forge through your firewall when the OS asks.
				</Callout>
			</Step>

			<Step n={2} title="Create a server instance">
				<p>
					Open <strong className="text-foreground">Servers</strong> and switch to the{" "}
					<em>Hosting</em> tab, then press <em>New server</em>. Fill in:
				</p>
				<div className="grid gap-1.5">
					<p>
						<strong className="text-foreground">Name &amp; version</strong> — what you'll call it,
						and which game build to run.
					</p>
					<p>
						<strong className="text-foreground">Port &amp; bind IP</strong> — leave the defaults
						unless you're running several servers.
					</p>
					<p>
						<strong className="text-foreground">Data folder</strong> — where worlds, mods and
						configs live. Default is fine for one server.
					</p>
					<p>
						<strong className="text-foreground">Password</strong> — optional, set it if the server
						is reachable from the internet.
					</p>
					<p>
						<strong className="text-foreground">Whitelist</strong> — toggle it on and add the first
						player by account name; Story Forge looks up the UID for you.
					</p>
				</div>
			</Step>

			<Step n={3} title="Start it up">
				<p>
					The instance page has Start, Restart and Stop, plus a live console so you can watch the
					server boot and see joins, chat and errors. Players connect with{" "}
					<Code>your-address:42420</Code> — share the address shown on the page.
				</p>
			</Step>

			<Step n={4} title="Add mods to the server">
				<p>
					Each instance has its own mods page: install, update or remove mods in that server's data
					folder without touching your client profiles. The usual ModDB tools apply — updates, pins
					and dependency checks.
				</p>
				<Callout variant="tip">
					Server and client mods must line up. Install the same mod versions on your profile and the
					server, or pin both sides to matching releases.
				</Callout>
			</Step>

			<Step n={5} title="Settings, configs and the whitelist">
				<p>
					<strong className="text-foreground">Config</strong> opens the instance's{" "}
					<Code>serverconfig.json</Code> — name, passwords, world settings and more. Changes apply
					on the next restart.
				</p>
				<p>
					<strong className="text-foreground">Whitelist</strong> can be enabled or disabled on the
					fly. Add players one by one (enter the account name and use <em>Look up UID</em>, or{" "}
					<em>+ Add me</em> for yourself), or bulk-import a JSON list of{" "}
					<Code>{`{ uid, name }`}</Code> entries.
				</p>
			</Step>

			<Step n={6} title="Housekeeping">
				<p>
					The instance page shows how much disk its data folder uses — a quick way to spot a world
					that's grown huge. Deleting an instance asks whether to remove only the configuration or
					also its worlds, mods and configs from disk.
				</p>
				<Callout variant="warning">
					Deleting with data is permanent. Back up the instance's data folder first if there's a
					world in there you care about.
				</Callout>
			</Step>
		</>
	);
}
