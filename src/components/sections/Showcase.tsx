import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { Reveal } from "@/components/motion/Reveal";

const shots = [
	{
		alt: "Profiles manager",
		caption: "Profiles for every playthrough",
		label: "Profiles",
		src: "/screenshots/profiles.webp",
		value: "profiles",
	},
	{
		alt: "Mod browser",
		caption: "The full ModDB, with one-click updates",
		label: "Mods",
		src: "/screenshots/mods.webp",
		value: "mods",
	},
	{
		alt: "Mod configuration editor",
		caption: "Edit mod configs without leaving the app",
		label: "Mod configs",
		src: "/screenshots/mod-configs.webp",
		value: "mod-configs",
	},
	{
		alt: "Server manager",
		caption: "Favourite and join servers",
		label: "Servers",
		src: "/screenshots/servers.webp",
		value: "servers",
	},
	{
		alt: "Version manager",
		caption: "Every game version, one click away",
		label: "Versions",
		src: "/screenshots/versions.webp",
		value: "versions",
	},
	{
		alt: "World map viewer",
		caption: "Explore your worlds as a map",
		label: "Worlds",
		src: "/screenshots/worlds.webp",
		value: "worlds",
	},
];

export function Showcase() {
	const [active, setActive] = useState(shots[0].value);
	const shot = shots.find((entry) => entry.value === active) ?? shots[0];

	return (
		<section className="border-border border-b">
			<div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
				<Reveal className="flex flex-wrap items-end justify-between gap-6">
					<div className="max-w-2xl">
						<p className="text-accent-amber text-[10px] font-medium tracking-widest uppercase">
							A look inside
						</p>
						<h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
							Built like a tool, not a toy
						</h2>
						<p className="text-muted-foreground mt-3 text-sm/relaxed">
							Sharp, fast and keyboard-friendly — the same interface power users have been asking
							for.
						</p>
					</div>

					<div className="border-border bg-card flex flex-wrap gap-1 border p-1">
						{shots.map((entry) => (
							<button
								className={`relative px-3 py-1.5 text-[11px] font-medium transition-colors ${
									active === entry.value
										? "text-foreground"
										: "text-muted-foreground hover:text-foreground"
								}`}
								key={entry.value}
								onClick={() => setActive(entry.value)}
								type="button"
							>
								{active === entry.value && (
									<motion.span
										className="bg-secondary absolute inset-0"
										layoutId="showcase-tab"
										transition={{ damping: 30, stiffness: 400, type: "spring" }}
									/>
								)}
								<span className="relative">{entry.label}</span>
							</button>
						))}
					</div>
				</Reveal>

				<Reveal className="mt-8" delay={0.1}>
					<div className="border-border bg-card relative overflow-hidden border p-1.5 shadow-2xl shadow-black/40">
						<div className="bg-accent-primary/8 absolute -inset-10 blur-3xl" />
						<div className="relative">
							<AnimatePresence mode="wait">
								<motion.img
									alt={shot.alt}
									animate={{ opacity: 1, scale: 1 }}
									className="block w-full"
									exit={{ opacity: 0, scale: 0.995 }}
									initial={{ opacity: 0, scale: 1.005 }}
									key={shot.value}
									src={shot.src}
									transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
								/>
							</AnimatePresence>
							<div className="border-border bg-surface flex items-center justify-between border-t px-3 py-2">
								<span className="text-muted-foreground text-[10px]">{shot.caption}</span>
								<span className="text-muted-foreground/70 font-mono text-[9px]">
									storyforge — {shot.value}
								</span>
							</div>
						</div>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
