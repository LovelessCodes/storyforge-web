import { API_BASE_URL } from "@/lib/auth";

/* ─── Types ─────────────────────────────────────────────────────────── */

export type ModpackOwner = {
	id: string;
	name: string;
	image: string | null;
};

export type ModpackVersion = {
	id: string;
	version: string;
	gameVersion: string;
	modConfigsUrl: string | null;
	modsString: string | null;
	downloads: number;
	modpack: string;
	createdAt: string | number;
	updatedAt: string | number;
};

export type ModpackItem = {
	id: string;
	name: string;
	slug: string;
	description: string;
	imageUrl: string | null;
	downloads: number;
	owner: ModpackOwner | null;
	modpackVersions: ModpackVersion[];
	public?: boolean;
	createdAt: string | number;
	updatedAt: string | number;
};

/** Subset of the Vintage Story ModDB mod payload we use for enrichment. */
export type ModDbMod = {
	modid: number;
	assetid: number;
	name: string;
	summary?: string;
	author?: string;
	urlalias?: string | null;
	logofile?: string | null;
	downloads: number;
	follows: number;
};

/* ─── Fetching ──────────────────────────────────────────────────────── */

async function request<T>(path: string, init?: RequestInit): Promise<T> {
	const res = await fetch(`${API_BASE_URL}${path}`, {
		credentials: "include",
		...init,
	});
	if (!res.ok) {
		let message = `Request failed (${res.status})`;
		try {
			const body = (await res.json()) as { message?: string };
			if (body?.message) message = body.message;
		} catch {
			// keep the status-based message
		}
		throw new Error(message);
	}
	return res.json() as Promise<T>;
}

export const api = {
	getModInfo: (modid: string) =>
		request<{ statuscode: string; mod: ModDbMod }>(`/mod/${modid}`),
	getModpack: (slug: string) =>
		request<ModpackItem>(`/api/auth/modpacks/${slug}`),
	getModpacks: () =>
		request<{ totalCount: number; modpacks: ModpackItem[] }>(
			"/api/auth/modpacks",
		),
	getSocialProviders: () => request<string[]>("/api/auth/social-providers"),
	incrementModpackVersionDownload: (slug: string, version: string) =>
		request<ModpackVersion>(
			`/api/auth/modpacks/${slug}/versions/${version}/download`,
			{ method: "POST" },
		),
};

/* ─── Helpers ───────────────────────────────────────────────────────── */

/** Normalize a date coming from the API (ISO string or epoch ms). */
export function toTime(value: string | number | undefined): number {
	if (typeof value === "number") return value;
	if (typeof value === "string") {
		const parsed = Date.parse(value);
		return Number.isNaN(parsed) ? 0 : parsed;
	}
	return 0;
}

/** Parse a modpack's `modsString` (`modid@version,modid@version,…`). */
export function parseModsString(
	modsString: string | null | undefined,
): { modid: string; version: string }[] {
	if (!modsString) return [];
	return modsString
		.split(",")
		.map((entry) => {
			const [modid, version] = entry.trim().split("@");
			return { modid: modid?.trim() ?? "", version: version?.trim() ?? "" };
		})
		.filter((mod) => mod.modid.length > 0);
}

/** Latest version by creation time (the API does not guarantee ordering). */
export function latestVersion(modpack: ModpackItem): ModpackVersion | null {
	return modpack.modpackVersions.reduce<ModpackVersion | null>(
		(latest, version) =>
			latest === null || toTime(version.createdAt) > toTime(latest.createdAt)
				? version
				: latest,
		null,
	);
}

export function modUrl(
	mod: { urlalias?: string | null; assetid?: number },
	modid?: string,
) {
	if (mod.urlalias) return `https://mods.vintagestory.at/${mod.urlalias}`;
	if (mod.assetid)
		return `https://mods.vintagestory.at/show/mod/${mod.assetid}`;
	return `https://mods.vintagestory.at/api/mod/${modid ?? ""}`;
}

export function modLogoUrl(logofile: string | null | undefined): string {
	if (!logofile) return "https://mods.vintagestory.at/web/img/mod-default.png";
	return logofile.startsWith("http")
		? logofile
		: `https://mods.vintagestory.at${logofile}`;
}

export function formatCount(count: number): string {
	return Intl.NumberFormat("en-US", {
		maximumFractionDigits: 1,
		notation: "compact",
	}).format(count);
}

export function timeAgo(value: string | number | undefined): string {
	const time = toTime(value);
	if (!time) return "";
	const diffSeconds = Math.round((time - Date.now()) / 1000);
	const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
	const divisions: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
		{ amount: 60, unit: "second" },
		{ amount: 60, unit: "minute" },
		{ amount: 24, unit: "hour" },
		{ amount: 7, unit: "day" },
		{ amount: 4.34524, unit: "week" },
		{ amount: 12, unit: "month" },
		{ amount: Number.POSITIVE_INFINITY, unit: "year" },
	];
	let duration = diffSeconds;
	for (const division of divisions) {
		if (Math.abs(duration) < division.amount) {
			return formatter.format(Math.round(duration), division.unit);
		}
		duration /= division.amount;
	}
	return "";
}
