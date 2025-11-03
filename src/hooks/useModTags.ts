import { type UseQueryOptions, useQuery } from "@tanstack/react-query";

export type ModTag = {
	tagid: number;
	color: string;
	name: string;
};

export type ModTagsResponse = {
	statuscode: string;
	tags: ModTag[];
};

export const useModTags = (
	props?: Omit<
		UseQueryOptions<ModTagsResponse, Error, ModTag[]>,
		"queryKey" | "queryFn"
	>,
) =>
	useQuery<ModTagsResponse, Error, ModTag[]>({
		queryFn: () =>
			fetch("https://vsapi.betterjs.dev/modtags").then((response) =>
				response.json(),
			),
		queryKey: ["mod-tags"],
		select: (data) => data.tags,
		...props,
	});
