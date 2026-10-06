import { useEffect } from "react";

import { useLatestReleaseQuery } from "@/hooks/use-latest-release";

/**
 * `index.html` ships a static `SoftwareApplication` JSON-LD block, but the app
 * version only exists in the release feed — so patch the block once the cached
 * release resolves (search engines that execute JS see the current version).
 */
export function JsonLdSoftwareVersion() {
	const { data: release } = useLatestReleaseQuery();

	useEffect(() => {
		if (!release?.version) return;
		for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
			try {
				const data = JSON.parse(script.textContent ?? "") as {
					"@type"?: string;
					softwareVersion?: string;
				};
				if (data["@type"] !== "SoftwareApplication" || data.softwareVersion === release.version) {
					continue;
				}
				data.softwareVersion = release.version;
				script.textContent = JSON.stringify(data);
			} catch {
				// Leave malformed or unrelated structured data alone.
			}
		}
	}, [release?.version]);

	return null;
}
