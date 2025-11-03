import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useModsFilters } from "@/stores/mod-filters";

export type Mod = {
	modid: number;
	assetid: number;
	downloads: number;
	follows: number;
	trendingpoints: number;
	comments: number;
	name: string;
	summary: string;
	modidstrs: string[];
	author: string;
	urlalias: string;
	side: string;
	type: string;
	logo: string | undefined;
	tags: string[];
	lastreleased: string;
};

export type ModsResponse = {
	statuscode: string;
	mods: Mod[];
};

export const useMods = (
	props?: Omit<
		UseQueryOptions<ModsResponse, Error, Mod[]>,
		"queryKey" | "queryFn"
	>,
) => {
	const { selectedGameVersions } = useModsFilters();

	const fetchUrl = useMemo(() => {
		if (selectedGameVersions.length === 0) {
			return "https://vsapi.betterjs.dev/mods";
		}
		return `https://vsapi.betterjs.dev/mods?versions=${selectedGameVersions.join(
			",",
		)}`;
	}, [selectedGameVersions]);

	return useQuery<ModsResponse, Error, Mod[]>({
		queryFn: () => fetch(fetchUrl).then((response) => response.json()),
		queryKey: ["mods", selectedGameVersions],
		select: (data) => data.mods,
		...props,
	});
};
