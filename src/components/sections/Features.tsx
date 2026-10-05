import { Boxes, Earth, IdCard, Layers, Package, Server } from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";

const features = [
	{
		description:
			"Keep separate mod sets and worlds for every server or playthrough. Clone, rename, export and import in seconds.",
		icon: IdCard,
		title: "Profiles that stay tidy",
	},
	{
		description:
			"Browse the entire Vintage Story ModDB, search by version and tag, and update everything in one click.",
		icon: Package,
		title: "Mods without the mess",
	},
	{
		description:
			"Publish, discover and install community modpacks. Story Forge resolves every mod and config for you.",
		icon: Layers,
		title: "Community modpacks",
	},
	{
		description:
			"Install any Vintage Story release straight from the official CDN — and link builds you already have.",
		icon: Boxes,
		title: "Every game version",
	},
	{
		description: "Open your world saves as an interactive map and share them with your friends.",
		icon: Earth,
		title: "World map viewer",
	},
	{
		description:
			"Host a dedicated Vintage Story server with the same profile — no command line required.",
		icon: Server,
		title: "Server hosting",
	},
];

export function Features() {
	return (
		<section className="border-border border-b">
			<div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
				<Reveal className="max-w-2xl">
					<p className="text-accent-amber text-[10px] font-medium tracking-widest uppercase">
						Why Story Forge
					</p>
					<h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
						Everything the launcher should have been
					</h2>
					<p className="text-muted-foreground mt-3 text-sm/relaxed">
						Built for Vintage Story players who would rather be playing than fixing their mod
						folder.
					</p>
				</Reveal>

				<div className="border-border bg-border mt-10 grid gap-px border sm:grid-cols-2 lg:grid-cols-3">
					{features.map((feature, index) => (
						<Reveal delay={Math.min(index * 0.05, 0.3)} key={feature.title}>
							<div className="group bg-background hover:bg-surface-hover h-full p-6 transition-colors duration-300">
								<div className="border-border bg-card text-accent-primary group-hover:border-accent-primary/50 group-hover:text-accent-amber flex size-8 items-center justify-center border transition-colors duration-300">
									<feature.icon className="size-4" />
								</div>
								<h3 className="mt-4 text-xs font-medium">{feature.title}</h3>
								<p className="text-muted-foreground mt-1.5 text-[11px]/relaxed">
									{feature.description}
								</p>
							</div>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
