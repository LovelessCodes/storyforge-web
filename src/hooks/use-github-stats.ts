import { type UseQueryOptions, useQuery } from "@tanstack/react-query";

import { API_BASE_URL } from "@/lib/auth";

export type GithubStats = {
	stars: number;
	forks: number;
	downloads: number;
};

async function fetchGithubStats(): Promise<GithubStats> {
	const response = await fetch(`${API_BASE_URL}/github/stats`);
	if (!response.ok) {
		throw new Error(`Failed to load GitHub stats (${response.status})`);
	}
	return response.json() as Promise<GithubStats>;
}

/** Repo stats, proxied by the Story Forge API (GitHub rate limits the browser). */
export const useGithubStatsQuery = (
	props?: Omit<UseQueryOptions<GithubStats, Error>, "queryFn" | "queryKey">,
) =>
	useQuery({
		queryFn: fetchGithubStats,
		queryKey: ["github-stats"],
		staleTime: 1000 * 60 * 30,
		...props,
	});
