import { ChevronDown, PackageOpen } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { useModInfo } from "@/hooks/use-modpacks";
import {
	formatCount,
	modLogoUrl,
	modUrl,
	parseModsString,
} from "@/lib/modpacks";

function ModRow({ modid, version }: { modid: string; version: string }) {
	const { data, isLoading } = useModInfo(modid);
	const mod = data?.mod;

	if (isLoading) {
		return (
			<div className="flex items-center gap-2 px-2 py-1.5">
				<div className="size-6 shrink-0 animate-pulse bg-muted" />
				<div className="h-3 w-40 animate-pulse bg-muted" />
			</div>
		);
	}

	if (!mod) {
		return (
			<a
				className="flex items-center gap-2 px-2 py-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
				href={modUrl({}, modid)}
				rel="noopener noreferrer"
				target="_blank"
			>
				<PackageOpen className="size-3.5 shrink-0" />
				<span className="truncate font-mono">
					{modid}@{version}
				</span>
			</a>
		);
	}

	return (
		<div className="flex min-w-0 items-center gap-2 px-2 py-1">
			<a href={modUrl(mod)} rel="noopener noreferrer" target="_blank">
				<img
					alt={mod.name}
					className="size-6 shrink-0 border border-border object-cover"
					loading="lazy"
					src={modLogoUrl(mod.logofile)}
				/>
			</a>
			<a
				className="min-w-0 flex-1 truncate text-[11px] font-medium transition-colors hover:text-accent-amber"
				href={modUrl(mod)}
				rel="noopener noreferrer"
				target="_blank"
			>
				{mod.name}
			</a>
			<span className="flex shrink-0 items-center gap-2 text-[10px] text-muted-foreground tabular-nums">
				<span className="hidden sm:inline">{formatCount(mod.downloads)} ↓</span>
				<span className="hidden sm:inline">{formatCount(mod.follows)} ★</span>
				<span className="font-mono">v{version}</span>
			</span>
		</div>
	);
}

interface ModpackModsListProps {
	modsString: string | null | undefined;
	/** Start expanded (detail pages often want the list visible). */
	defaultOpen?: boolean;
}

/** Collapsible list of the mods a modpack version contains. */
export function ModpackModsList({
	modsString,
	defaultOpen = false,
}: ModpackModsListProps) {
	const [open, setOpen] = useState(defaultOpen);
	const mods = parseModsString(modsString);

	if (mods.length === 0) return null;

	return (
		<div className="grid gap-1.5">
			<button
				className="flex w-fit items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
				onClick={() => setOpen((value) => !value)}
				type="button"
			>
				<ChevronDown
					className={`size-3.5 transition-transform duration-200 ${
						open ? "rotate-180" : ""
					}`}
				/>
				{mods.length} mod{mods.length === 1 ? "" : "s"}
			</button>
			<AnimatePresence initial={false}>
				{open && (
					<motion.div
						animate={{ height: "auto", opacity: 1 }}
						className="overflow-hidden"
						exit={{ height: 0, opacity: 0 }}
						initial={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
					>
						<div className="grid divide-y divide-border/60 border border-border/60 bg-background/60">
							{mods.map((mod) => (
								<ModRow
									key={mod.modid}
									modid={mod.modid}
									version={mod.version}
								/>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
