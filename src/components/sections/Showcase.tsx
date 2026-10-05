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
		<section className="border-b border-border">
			<div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
				<Reveal className="flex flex-wrap items-end justify-between gap-6">
					<div className="max-w-2xl">
						<p className="text-[10px] font-medium tracking-widest text-accent-amber uppercase">
							A look inside
						</p>
						<h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
							Built like a tool, not a toy
						</h2>
						<p className="mt-3 text-sm/relaxed text-muted-foreground">
							Sharp, fast and keyboard-friendly — the same interface power users
							have been asking for.
						</p>
					</div>

					<div className="flex flex-wrap gap-1 border border-border bg-card p-1">
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
										className="absolute inset-0 bg-secondary"
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
					<div className="relative overflow-hidden border border-border bg-card p-1.5 shadow-2xl shadow-black/40">
						<div className="absolute -inset-10 bg-accent-primary/8 blur-3xl" />
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
							<div className="flex items-center justify-between border-t border-border bg-surface px-3 py-2">
								<span className="text-[10px] text-muted-foreground">
									{shot.caption}
								</span>
								<span className="font-mono text-[9px] text-muted-foreground/70">
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
