import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { DownloadInfo } from "@/lib/utils";

export const useLatestDownloadsQuery = (
	props?: UseQueryOptions<DownloadInfo, Error>,
) =>
	useQuery({
		queryFn: () =>
			fetch(
				"https://api.github.com/repos/lovelesscodes/storyforge/releases/latest",
			).then((res) => res.json() as Promise<DownloadInfo>),
		queryKey: ["latest-downloads"],
		...props,
	});
