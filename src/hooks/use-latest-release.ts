import { type UseQueryOptions, useQuery } from "@tanstack/react-query";

import { API_BASE_URL } from "@/lib/auth";

export type ReleaseAsset = {
	name: string;
	url: string;
	size: number;
	downloads: number;
};

export type ReleaseInfo = {
	version: string;
	url: string;
	publishedAt: string | null;
	assets: ReleaseAsset[];
};

async function fetchLatestRelease(): Promise<ReleaseInfo> {
	const response = await fetch(`${API_BASE_URL}/releases/latest`);
	if (!response.ok) {
		throw new Error(`Failed to load the latest release (${response.status})`);
	}
	return response.json() as Promise<ReleaseInfo>;
}

/**
 * Latest Story Forge release, proxied and cached by the Story Forge API so
 * visitors never hit GitHub's rate limit.
 */
export const useLatestReleaseQuery = (
	props?: Omit<UseQueryOptions<ReleaseInfo, Error>, "queryFn" | "queryKey">,
) =>
	useQuery({
		queryFn: fetchLatestRelease,
		queryKey: ["latest-release"],
		staleTime: 1000 * 60 * 30,
		...props,
	});
