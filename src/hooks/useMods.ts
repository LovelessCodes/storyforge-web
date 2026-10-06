import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

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

/** ModDB list, optionally narrowed to the given Vintage Story versions (from the URL). */
export const useMods = (
	versions: string[] = [],
	props?: Omit<UseQueryOptions<ModsResponse, Error, Mod[]>, "queryKey" | "queryFn">,
) => {
	const versionsParam = versions.join(",");

	const fetchUrl = useMemo(
		() =>
			versionsParam.length === 0
				? "https://vsapi.betterjs.dev/mods"
				: `https://vsapi.betterjs.dev/mods?versions=${versionsParam}`,
		[versionsParam],
	);

	return useQuery<ModsResponse, Error, Mod[]>({
		queryFn: () => fetch(fetchUrl).then((response) => response.json()),
		queryKey: ["mods", versions],
		select: (data) => data.mods,
		...props,
	});
};
