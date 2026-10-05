import type { LucideIcon } from "lucide-react";
import {
	Download,
	FileText,
	FolderDown,
	FolderInput,
	IdCard,
	Layers,
	Map as MapIcon,
	Package,
	Server,
} from "lucide-react";

export type GuideCategory =
	| "getting-started"
	| "migrating"
	| "everyday"
	| "advanced";

export interface GuideCategoryMeta {
	id: GuideCategory;
	label: string;
	description: string;
}

export interface GuideMeta {
	slug: string;
	title: string;
	description: string;
	minutes: number;
	category: GuideCategory;
	icon: LucideIcon;
}

export const guideCategories: GuideCategoryMeta[] = [
	{
		description: "From download to your first launch.",
		id: "getting-started",
		label: "Getting started",
	},
	{
		description:
			"Bring your mods, worlds and settings across — nothing gets left behind.",
		id: "migrating",
		label: "Migrating to Story Forge",
	},
	{
		description: "Mods, modpacks, world maps and configs.",
		id: "everyday",
		label: "Everyday use",
	},
	{
		description: "For when one more machine joins the party.",
		id: "advanced",
		label: "Advanced",
	},
];

/** Order here drives the index page. */
export const guides: GuideMeta[] = [
	{
		category: "getting-started",
		description:
			"Get the launcher running on Windows, macOS or Linux — including the security prompts you may hit on the way.",
		icon: Download,
		minutes: 3,
		slug: "install",
		title: "Installing Story Forge",
	},
	{
		category: "getting-started",
		description:
			"Profiles keep mod sets, worlds and settings isolated. Learn to create, clone, back up and share them.",
		icon: IdCard,
		minutes: 6,
		slug: "profiles",
		title: "Profiles and game data",
	},
	{
		category: "migrating",
		description:
			"Move your existing Vintage Story data into Story Forge — adopted in place or copied manually.",
		icon: FolderInput,
		minutes: 5,
		slug: "migrate",
		title: "Migrating from Vintage Story",
	},
	{
		category: "migrating",
		description:
			"VS Launcher, Rustory, MVL, Waxlight, Cairn and friends — Story Forge detects them and imports their instances.",
		icon: FolderDown,
		minutes: 7,
		slug: "other-launchers",
		title: "Migrating from another launcher",
	},
	{
		category: "everyday",
		description:
			"Search the ModDB, install to a profile or server, update everything at once — and pin what must not move.",
		icon: Package,
		minutes: 5,
		slug: "mods",
		title: "Installing and updating mods",
	},
	{
		category: "everyday",
		description:
			"Install community modpacks in the app, browse them on the web, and publish your own.",
		icon: Layers,
		minutes: 5,
		slug: "modpacks",
		title: "Installing and publishing modpacks",
	},
	{
		category: "everyday",
		description:
			"Explore your worlds as an interactive map — waypoints, prospecting results and standalone map files.",
		icon: MapIcon,
		minutes: 4,
		slug: "world-maps",
		title: "Viewing world maps",
	},
	{
		category: "advanced",
		description:
			"Tweak mod settings with the live form editor or raw JSON — auto-saved while you type.",
		icon: FileText,
		minutes: 3,
		slug: "mod-configs",
		title: "Editing mod configs",
	},
	{
		category: "advanced",
		description:
			"Run your own Vintage Story server from your machine: create the instance, manage mods and the whitelist, and keep it running.",
		icon: Server,
		minutes: 6,
		slug: "server-hosting",
		title: "Hosting a dedicated server",
	},
];

export function getGuide(slug: string): GuideMeta | undefined {
	return guides.find((guide) => guide.slug === slug);
}

/** Guides to suggest under a page: same category first, then the rest. */
export function relatedGuides(slug: string, count = 3): GuideMeta[] {
	const current = getGuide(slug);
	const others = guides.filter((guide) => guide.slug !== slug);
	if (!current) return others.slice(0, count);
	const sameCategory = others.filter(
		(guide) => guide.category === current.category,
	);
	const rest = others.filter((guide) => guide.category !== current.category);
	return [...sameCategory, ...rest].slice(0, count);
}
