import { type UseQueryOptions, useQuery } from "@tanstack/react-query";

export const useGameVersions = (
	props?: Omit<
		UseQueryOptions<string[], Error, string[]>,
		"queryKey" | "queryFn"
	>,
) =>
	useQuery<string[]>({
		queryFn: () =>
			fetch("https://vsapi.betterjs.dev/versions").then((response) =>
				response.json(),
			),
		queryKey: ["game-versions"],
		...props,
	});
