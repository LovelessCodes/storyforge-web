import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/modpacks";

/** Full public modpack list (filtering/sorting is done client-side). */
export function useModpacks() {
	return useQuery({
		queryFn: api.getModpacks,
		queryKey: ["modpacks"],
		staleTime: 60_000,
	});
}

/** A single modpack by slug (falls back to the cached list entry). */
export function useModpack(slug: string) {
	return useQuery({
		queryFn: () => api.getModpack(slug),
		queryKey: ["modpack", slug],
		staleTime: 60_000,
	});
}

/** ModDB metadata for one mod, enriched through the Story Forge API. */
export function useModInfo(modid: string, enabled = true) {
	return useQuery({
		enabled: enabled && modid.length > 0,
		queryFn: () => api.getModInfo(modid),
		queryKey: ["mod-info", modid],
		retry: 1,
		staleTime: Number.POSITIVE_INFINITY,
	});
}
