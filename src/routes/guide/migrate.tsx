import { createFileRoute } from "@tanstack/react-router";
import { CopyCheckIcon, CopyIcon, DownloadIcon, Folder } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useLatestDownloadsQuery } from "@/hooks/useLatestDownloadsQuery";
import { getPlatformFromAssetUrl, type PlatformKey } from "@/lib/utils";

export const Route = createFileRoute("/guide/migrate")({
	component: RouteComponent,
});

function RouteComponent() {
	const [copiedText, setCopiedText] = useCopyToClipboard();

	const dataPaths = {
		linux: "~/.config/vintagestoryData",
		mac: "~/Library/Application Support/VintagestoryData",
		windows: "%APPDATA%\\VintagestoryData",
	};

	const { data: downloads } = useLatestDownloadsQuery();

	const assets = useMemo(() => {
		if (!downloads) return [];
		return (
			downloads?.assets?.reduce(
				(acc, asset) => {
					const platform = getPlatformFromAssetUrl(asset.browser_download_url);
					if (platform) {
						acc.push({ platform, url: asset.browser_download_url });
					}
					return acc;
				},
				[] as { platform: PlatformKey; url: string }[],
			) ?? []
		);
	}, [downloads]);

	const platformGroups: Record<"Windows" | "MacOS" | "Linux", PlatformKey[]> = {
		Linux: ["linux-x86_64", "linux-aarch64"],
		MacOS: ["darwin-aarch64", "darwin-x86_64"],
		Windows: ["windows-x86_64"],
	};

	const platformIcon = (
		platform: keyof typeof platformGroups,
		props?: React.SVGProps<SVGSVGElement>,
	) => {
		if (platform === "Windows")
			return (
				<svg
					fill="currentColor"
					height="14px"
					version="1.1"
					viewBox="0 0 498.57 498.57"
					width="14px"
					xmlns="http://www.w3.org/2000/svg"
					{...props}
				>
					<title>windows</title>
					<g transform="translate(1 2)">
						<g>
							<g>
								<path d="M227.302,38.289v202.282h268.59V-2L227.302,38.289z M479.105,223.784H244.089V52.557l235.016-34.413V223.784z" />
								<path d="M0.679,243.089h209.836V39.967L0.679,71.023V243.089z M17.466,85.292l176.262-26.02v167.03H17.466V85.292z" />
								<path d="M227.302,456.282l268.59,40.289V259.875h-268.59V456.282z M244.089,276.662h235.016v200.603l-235.016-35.253V276.662z" />
								<path d="M0.679,423.548l209.836,31.056V259.875H0.679V423.548z M17.466,276.662h176.262v158.636l-176.262-26.02V276.662z" />
							</g>
						</g>
					</g>
				</svg>
			);
		if (platform === "MacOS")
			return (
				<svg
					fill="currentColor"
					height="14px"
					version="1.1"
					viewBox="0 0 32 32"
					width="14px"
					xmlns="http://www.w3.org/2000/svg"
					{...props}
				>
					<title>macos</title>
					<path d="M17,7.81a6.25,6.25,0,0,0,1.28.13,5.64,5.64,0,0,0,4-1.64A5.81,5.81,0,0,0,23.81,1,1,1,0,0,0,23,.19,5.81,5.81,0,0,0,17.7,1.7,5.81,5.81,0,0,0,16.19,7,1,1,0,0,0,17,7.81Zm2.14-4.69a3.66,3.66,0,0,1,2.81-1.05,3.66,3.66,0,0,1-1.05,2.81,3.61,3.61,0,0,1-2.81,1A3.68,3.68,0,0,1,19.12,3.12Z" />
					<path d="M28.16,23.28a6,6,0,0,1-.63-10.17,1,1,0,0,0,.41-.68,1,1,0,0,0-.21-.77A11.19,11.19,0,0,0,23.29,8.4a5.59,5.59,0,0,0-4.16,0l-1.79.72a3.62,3.62,0,0,1-2.67,0l-1.8-.72a5.59,5.59,0,0,0-4.16,0A11.08,11.08,0,0,0,2.34,22.12l.35.84a26.81,26.81,0,0,0,3.75,6.5,6.06,6.06,0,0,0,7.75,2.05,4,4,0,0,1,3.62,0,6.06,6.06,0,0,0,7.71-2,27.93,27.93,0,0,0,3.06-4.92A1,1,0,0,0,28.16,23.28ZM23.9,28.35a4.05,4.05,0,0,1-5.19,1.37,6.14,6.14,0,0,0-5.42,0,4.08,4.08,0,0,1-5.23-1.43,25.63,25.63,0,0,1-3.52-6.08l-.32-.78A9.06,9.06,0,0,1,9.46,10.26a3.5,3.5,0,0,1,2.66,0l1.8.72a5.64,5.64,0,0,0,4.16,0l1.8-.72a3.53,3.53,0,0,1,2.67,0,9.18,9.18,0,0,1,3,1.93,8,8,0,0,0,.87,12.34A27.67,27.67,0,0,1,23.9,28.35Z" />
				</svg>
			);
		if (platform === "Linux")
			return (
				<svg
					fill="currentColor"
					height="14px"
					version="1.1"
					viewBox="0 0 32 32"
					width="14px"
					xmlns="http://www.w3.org/2000/svg"
					{...props}
				>
					<title>linux</title>
					<path d="M14.923 8.080c-0.025 0.072-0.141 0.061-0.207 0.082-0.059 0.031-0.107 0.085-0.175 0.085-0.062 0-0.162-0.025-0.17-0.085-0.012-0.082 0.11-0.166 0.187-0.166 0.050-0.024 0.108-0.037 0.169-0.037 0.056 0 0.109 0.011 0.157 0.032l-0.003-0.001c0.022 0.009 0.038 0.030 0.038 0.055 0 0.003-0 0.005-0.001 0.008l0-0v0.025h0.004zM15.611 8.080v-0.027c-0.008-0.025 0.016-0.052 0.036-0.062 0.046-0.020 0.1-0.032 0.157-0.032 0.061 0 0.119 0.014 0.17 0.038l-0.002-0.001c0.079 0 0.2 0.084 0.187 0.169-0.007 0.061-0.106 0.082-0.169 0.082-0.069 0-0.115-0.054-0.176-0.085-0.065-0.023-0.182-0.010-0.204-0.081zM16.963 10.058c-0.532 0.337-1.161 0.574-1.835 0.666l-0.024 0.003c-0.606-0.035-1.157-0.248-1.607-0.588l0.007 0.005c-0.192-0.167-0.35-0.335-0.466-0.419-0.205-0.167-0.18-0.416-0.092-0.416 0.136 0.020 0.161 0.167 0.249 0.25 0.12 0.082 0.269 0.25 0.45 0.416 0.397 0.328 0.899 0.541 1.45 0.583l0.009 0.001c0.654-0.057 1.249-0.267 1.763-0.592l-0.016 0.010c0.244-0.169 0.556-0.417 0.81-0.584 0.195-0.17 0.186-0.334 0.349-0.334 0.16 0.020 0.043 0.167-0.184 0.415-0.246 0.188-0.527 0.381-0.818 0.56l-0.044 0.025zM8.017 21.397h0.012c0.069 0 0.137 0.007 0.203 0.019l-0.007-0.001c0.544 0.14 0.992 0.478 1.273 0.931l0.005 0.009 1.137 2.079 0.004 0.004c0.457 0.773 0.948 1.442 1.497 2.059l-0.011-0.013c0.49 0.52 0.82 1.196 0.909 1.946l0.002 0.016v0.008c-0.012 0.817-0.613 1.491-1.396 1.616l-0.009 0.001c-0.2 0.031-0.432 0.048-0.667 0.048-0.857 0-1.659-0.233-2.347-0.64l0.021 0.012c-1.053-0.441-2.275-0.714-3.555-0.752l-0.015-0c-0.372-0.025-0.696-0.215-0.901-0.496l-0.002-0.003c-0.054-0.174-0.085-0.374-0.085-0.582 0-0.35 0.088-0.679 0.244-0.966l-0.005 0.011v-0.005l0.003-0.004c0.041-0.188 0.065-0.405 0.065-0.627 0-0.274-0.036-0.539-0.104-0.791l0.005 0.021c-0.041-0.15-0.065-0.323-0.065-0.502 0-0.242 0.043-0.473 0.123-0.687l-0.004 0.014c0.2-0.417 0.495-0.5 0.862-0.666 0.438-0.133 0.819-0.334 1.151-0.593l-0.008 0.006h0.002v-0.003c0.32-0.335 0.556-0.751 0.835-1.047 0.195-0.249 0.492-0.41 0.827-0.42l0.002-0zM21.531 21.336c-0.001 0.017-0.001 0.038-0.001 0.059 0 0.743 0.449 1.381 1.091 1.658l0.012 0.005c0.048 0.003 0.104 0.005 0.16 0.005 0.831 0 1.575-0.371 2.075-0.957l0.003-0.004 0.264-0.012c0.053-0.008 0.114-0.012 0.176-0.012 0.341 0 0.652 0.132 0.883 0.348l-0.001-0.001 0.004 0.004c0.249 0.301 0.422 0.673 0.487 1.082l0.002 0.013c0.055 0.505 0.238 0.96 0.517 1.34l-0.005-0.008c0.416 0.356 0.705 0.85 0.793 1.411l0.002 0.013 0.004-0.009v0.022l-0.004-0.015c-0.019 0.327-0.231 0.495-0.622 0.744-1.184 0.497-2.201 1.158-3.077 1.968l0.007-0.006c-0.608 0.792-1.501 1.339-2.523 1.486l-0.021 0.002c-0.074 0.010-0.16 0.016-0.247 0.016-0.768 0-1.428-0.464-1.716-1.126l-0.005-0.012-0.006-0.004c-0.093-0.286-0.146-0.615-0.146-0.956 0-0.416 0.079-0.813 0.224-1.178l-0.008 0.022c0.234-0.668 0.435-1.466 0.568-2.288l0.011-0.083c0.016-0.812 0.104-1.593 0.258-2.35l-0.014 0.083c0.085-0.518 0.381-0.954 0.794-1.225l0.007-0.004 0.056-0.027zM18.8 10.142c0.6 2.147 1.339 4.002 2.247 5.757l-0.079-0.167c0.613 1.090 1.090 2.355 1.363 3.695l0.014 0.084c0.009-0 0.020-0 0.031-0 0.217 0 0.427 0.029 0.627 0.084l-0.017-0.004c0.11-0.395 0.173-0.848 0.173-1.316 0-1.426-0.587-2.716-1.533-3.639l-0.001-0.001c-0.275-0.25-0.29-0.419-0.154-0.419 0.971 0.91 1.689 2.078 2.045 3.394l0.012 0.051c0.089 0.329 0.14 0.707 0.14 1.097 0 0.351-0.041 0.693-0.119 1.020l0.006-0.030c0.074 0.038 0.16 0.067 0.251 0.083l0.006 0.001c1.29 0.667 1.766 1.172 1.537 1.921v-0.054c-0.075-0.004-0.15 0-0.225 0h-0.020c0.189-0.584-0.227-1.031-1.331-1.53-1.143-0.5-2.057-0.42-2.212 0.581-0.011 0.049-0.019 0.106-0.022 0.165l-0 0.003c-0.073 0.030-0.16 0.058-0.25 0.078l-0.011 0.002c-0.508 0.336-0.87 0.859-0.989 1.469l-0.002 0.014c-0.148 0.695-0.241 1.5-0.256 2.323l-0 0.012v0.004c-0.091 0.637-0.23 1.207-0.418 1.753l0.020-0.066c-0.983 0.804-2.251 1.29-3.634 1.29-1.13 0-2.184-0.325-3.073-0.887l0.024 0.014c-0.146-0.253-0.313-0.472-0.503-0.667l0.001 0.001c-0.097-0.16-0.211-0.297-0.342-0.415l-0.002-0.001c0.207-0 0.407-0.031 0.596-0.088l-0.015 0.004c0.18-0.085 0.318-0.232 0.391-0.412l0.002-0.005c0.018-0.093 0.029-0.199 0.029-0.308 0-0.445-0.175-0.848-0.461-1.146l0.001 0.001c-0.619-0.761-1.359-1.395-2.196-1.88l-0.038-0.020c-0.671-0.388-1.179-0.995-1.43-1.722l-0.007-0.022c-0.093-0.318-0.147-0.684-0.147-1.062 0-0.353 0.047-0.695 0.134-1.021l-0.006 0.027c0.377-1.314 0.921-2.461 1.62-3.496l-0.028 0.043c0.134-0.081 0.046 0.169-0.51 1.217-0.474 0.713-0.757 1.59-0.757 2.533 0 0.84 0.224 1.627 0.616 2.306l-0.012-0.022c0.052-1.309 0.345-2.537 0.834-3.659l-0.025 0.065c1.055-1.902 1.854-4.111 2.275-6.452l0.020-0.131c0.060 0.045 0.271 0.169 0.361 0.252 0.272 0.166 0.475 0.416 0.737 0.581 0.267 0.26 0.633 0.42 1.035 0.42 0.021 0 0.042-0 0.063-0.001l-0.003 0c0.049 0.004 0.094 0.008 0.137 0.008 0.459-0.009 0.887-0.132 1.259-0.342l-0.013 0.007c0.362-0.167 0.65-0.417 0.925-0.5h0.006c0.535-0.145 0.983-0.454 1.3-0.869l0.004-0.006zM15.301 7.465c0.003 0 0.006-0 0.009-0 0.569 0 1.094 0.187 1.517 0.503l-0.007-0.005c0.378 0.234 0.814 0.433 1.275 0.574l0.040 0.010h0.004c0.246 0.11 0.449 0.281 0.594 0.494l0.003 0.005v-0.164c0.046 0.092 0.074 0.201 0.074 0.316 0 0.098-0.020 0.191-0.055 0.276l0.002-0.005c-0.288 0.507-0.755 0.884-1.313 1.048l-0.016 0.004v0.002c-0.335 0.169-0.626 0.416-0.968 0.581-0.35 0.21-0.771 0.334-1.222 0.334-0.015 0-0.030-0-0.045-0l0.002 0c-0.022 0.001-0.048 0.002-0.074 0.002-0.174 0-0.342-0.031-0.496-0.089l0.010 0.003c-0.159-0.087-0.29-0.169-0.417-0.257l0.014 0.010c-0.227-0.199-0.477-0.39-0.739-0.565l-0.026-0.016v-0.006h-0.006c-0.375-0.199-0.67-0.504-0.852-0.876l-0.005-0.012c-0.027-0.067-0.042-0.145-0.042-0.226 0-0.218 0.112-0.41 0.281-0.522l0.002-0.001c0.28-0.169 0.475-0.339 0.604-0.42 0.13-0.092 0.179-0.127 0.22-0.164h0.002v-0.004c0.268-0.339 0.623-0.599 1.032-0.746l0.016-0.005c0.174-0.050 0.374-0.079 0.581-0.081h0.001zM13.589 5.333h0.045c0.188 0.004 0.361 0.067 0.501 0.17l-0.002-0.002c0.179 0.159 0.325 0.352 0.425 0.57l0.004 0.011c0.113 0.245 0.183 0.53 0.191 0.83l0 0.003v0.005c0.004 0.046 0.006 0.099 0.006 0.152 0 0.063-0.003 0.126-0.009 0.188l0.001-0.008v0.1c-0.037 0.009-0.070 0.022-0.104 0.030-0.191 0.079-0.352 0.163-0.505 0.258l0.014-0.008c0.008-0.055 0.012-0.118 0.012-0.182 0-0.053-0.003-0.106-0.009-0.158l0.001 0.006v-0.019c-0.018-0.154-0.054-0.295-0.107-0.428l0.004 0.011c-0.041-0.132-0.113-0.244-0.207-0.333l-0-0c-0.055-0.050-0.128-0.081-0.209-0.081-0.007 0-0.014 0-0.021 0.001l0.001-0h-0.026c-0.103 0.011-0.189 0.075-0.232 0.163l-0.001 0.002c-0.077 0.093-0.13 0.208-0.15 0.334l-0 0.004c-0.023 0.086-0.035 0.185-0.035 0.287 0 0.044 0.002 0.088 0.007 0.131l-0-0.005v0.019c0.016 0.154 0.052 0.296 0.104 0.428l-0.004-0.011c0.042 0.132 0.113 0.245 0.207 0.335l0 0c0.012 0.012 0.026 0.022 0.042 0.030l0.001 0c-0.083 0.053-0.155 0.109-0.221 0.171l0.001-0.001c-0.045 0.040-0.1 0.070-0.161 0.084l-0.003 0.001c-0.123-0.147-0.237-0.312-0.335-0.486l-0.008-0.016c-0.113-0.245-0.183-0.529-0.194-0.83l-0-0.004c-0.004-0.048-0.006-0.104-0.006-0.161 0-0.241 0.039-0.473 0.11-0.69l-0.004 0.016c0.074-0.258 0.195-0.481 0.356-0.671l-0.002 0.003c0.127-0.15 0.313-0.245 0.522-0.25h0.001zM17.291 5.259h0.016c0.001 0 0.002 0 0.004 0 0.275 0 0.527 0.093 0.729 0.249l-0.003-0.002c0.229 0.177 0.413 0.4 0.542 0.655l0.005 0.011c0.121 0.266 0.196 0.575 0.207 0.901l0 0.004c0-0.025 0.007-0.050 0.007-0.075v0.131l-0.005-0.026-0.005-0.030c-0.003 0.32-0.071 0.622-0.193 0.897l0.006-0.014c-0.062 0.163-0.152 0.303-0.266 0.419l0-0c-0.030-0.018-0.067-0.035-0.104-0.050l-0.006-0.002c-0.135-0.042-0.253-0.099-0.36-0.169l0.005 0.003c-0.077-0.032-0.169-0.060-0.264-0.081l-0.011-0.002c0.081-0.076 0.156-0.157 0.225-0.243l0.004-0.005c0.063-0.148 0.102-0.319 0.11-0.499l0-0.003v-0.025c0-0.008 0-0.016 0-0.025 0-0.17-0.028-0.333-0.080-0.485l0.003 0.011c-0.063-0.159-0.14-0.296-0.232-0.421l0.004 0.005c-0.087-0.088-0.202-0.148-0.331-0.165l-0.003-0h-0.020c-0.001 0-0.003-0-0.004-0-0.132 0-0.25 0.065-0.322 0.164l-0.001 0.001c-0.116 0.113-0.204 0.253-0.254 0.41l-0.002 0.007c-0.063 0.147-0.104 0.318-0.112 0.496l-0 0.003v0.024c0.002 0.12 0.011 0.236 0.027 0.349l-0.002-0.015c-0.241-0.084-0.547-0.169-0.759-0.252-0.012-0.073-0.020-0.159-0.022-0.247l-0-0.003v-0.025c-0.001-0.020-0.001-0.043-0.001-0.066 0-0.324 0.069-0.631 0.194-0.908l-0.006 0.014c0.106-0.279 0.293-0.508 0.532-0.663l0.005-0.003c0.204-0.156 0.462-0.25 0.742-0.25h0zM16.63 1.004c-0.194 0-0.394 0.010-0.6 0.026-5.281 0.416-3.88 6.007-3.961 7.87-0.050 1.426-0.534 2.729-1.325 3.792l0.013-0.018c-1.407 1.602-2.555 3.474-3.351 5.523l-0.043 0.127c-0.258 0.685-0.408 1.476-0.408 2.302 0 0.285 0.018 0.566 0.052 0.841l-0.003-0.033c-0.056 0.046-0.103 0.102-0.136 0.166l-0.001 0.003c-0.325 0.335-0.562 0.75-0.829 1.048-0.283 0.217-0.615 0.388-0.975 0.494l-0.021 0.005c-0.464 0.139-0.842 0.442-1.075 0.841l-0.005 0.009c-0.104 0.212-0.165 0.461-0.165 0.725 0 0.010 0 0.019 0 0.029l-0-0.001c0.002 0.238 0.026 0.469 0.073 0.693l-0.004-0.023c0.056 0.219 0.088 0.471 0.088 0.73 0 0.17-0.014 0.337-0.041 0.5l0.002-0.018c-0.167 0.313-0.264 0.685-0.264 1.080 0 0.278 0.048 0.544 0.137 0.791l-0.005-0.016c0.273 0.388 0.686 0.662 1.164 0.749l0.011 0.002c1.274 0.107 2.451 0.373 3.561 0.78l-0.094-0.030c0.698 0.415 1.539 0.66 2.436 0.66 0.294 0 0.582-0.026 0.862-0.077l-0.029 0.004c0.667-0.151 1.211-0.586 1.504-1.169l0.006-0.013c0.734-0.004 1.537-0.336 2.824-0.417 0.873-0.072 1.967 0.334 3.22 0.25 0.037 0.159 0.086 0.298 0.148 0.429l-0.006-0.013 0.004 0.004c0.384 0.804 1.19 1.35 2.124 1.35 0.081 0 0.161-0.004 0.24-0.012l-0.010 0.001c1.151-0.17 2.139-0.768 2.813-1.623l0.007-0.009c0.843-0.768 1.827-1.401 2.905-1.853l0.067-0.025c0.432-0.191 0.742-0.585 0.81-1.059l0.001-0.007c-0.059-0.694-0.392-1.299-0.888-1.716l-0.004-0.003v-0.121l-0.004-0.004c-0.214-0.33-0.364-0.722-0.421-1.142l-0.002-0.015c-0.053-0.513-0.278-0.966-0.615-1.307l0 0h-0.004c-0.074-0.067-0.154-0.084-0.235-0.169-0.066-0.047-0.148-0.076-0.237-0.080l-0.001-0c0.195-0.602 0.308-1.294 0.308-2.013 0-0.94-0.193-1.835-0.541-2.647l0.017 0.044c-0.704-1.672-1.619-3.111-2.732-4.369l0.014 0.017c-1.105-1.082-1.828-2.551-1.948-4.187l-0.001-0.021c0.033-2.689 0.295-7.664-4.429-7.671z" />
				</svg>
			);
	};

	const platformOptions: {
		[K in PlatformKey]: {
			platform: string;
			icon?: React.ReactNode;
		};
	} = {
		"darwin-aarch64": {
			platform: "Apple Silicon",
		},
		"darwin-x86_64": {
			platform: "Intel",
		},
		"linux-aarch64": {
			platform: "ARM",
		},
		"linux-x86_64": {
			platform: "AMD",
		},
		"windows-x86_64": {
			platform: "x64",
		},
	};

	return (
		<section className="py-32 px-8 flex flex-col md:px-0 flex text-foreground justify-center items-center">
			<h1 className="text-4xl font-bold">Migrating from Vintage Story</h1>
			<div className="container max-w-3xl mt-8">
				<p className="mb-4">
					This guide will help you migrate your mods, worlds and configurations
					from Vintage Story to Story Forge. Please follow the steps below to
					ensure a smooth transition.
				</p>
				<h2 className="text-2xl font-semibold mb-2 mt-8">
					Step 1: Install Story Forge
				</h2>
				<div className="mb-4">
					If you haven't already, download and install Story Forge from our
					official website. Follow the installation instructions provided.
					<div className="w-fit flex flex-col p-4 items-center border">
						<h3 className="text-lg -mt-4 border-b mb-4 font-semibold">
							Download Links
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{platformGroups &&
								Object.entries(platformGroups).map(([group, groupAssets]) => (
									<div className="flex flex-col gap-4 items-center" key={group}>
										<div className="flex gap-4 items-center text-foreground">
											<h3 className="text-lg">{group}</h3>
											{platformIcon(group as keyof typeof platformGroups, {
												className: "w-6 h-6",
											})}
										</div>
										{groupAssets.map((assetKey) => {
											const asset = assets.find((a) => a.platform === assetKey);
											if (!asset) return null;
											return (
												<a
													className="w-full"
													href={asset.url}
													key={assetKey}
													rel="noopener noreferrer"
													target="_blank"
												>
													<button
														className="group relative w-auto cursor-pointer overflow-hidden rounded-none w-full border text-foreground bg-background p-2 px-6 text-center"
														type="button"
													>
														<div className="flex items-center justify-center gap-2">
															<div className="h-2 w-2 rounded-none bg-primary transition-all opacity-0 duration-300 group-hover:opacity-100 group-hover:scale-[100.8]"></div>
															<span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
																{platformOptions[asset.platform]?.platform}
															</span>
														</div>
														<div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100">
															<span>
																{platformOptions[asset.platform]?.platform}
															</span>
															<DownloadIcon className="w-4 h-4" />
														</div>
													</button>
												</a>
											);
										})}
									</div>
								))}
						</div>
					</div>
				</div>
				<h2 className="text-2xl font-semibold mb-2 mt-8">
					Step 2: Find the Vintage Story Data Folder
				</h2>
				<p className="mb-4">
					Locate your Vintage Story data folder. This is typically found in the
					following locations:
				</p>
				<ul className="list-disc list-inside mb-4">
					<li>
						Windows:{" "}
						<code className="px-1 bg-gray-800 rounded-sm">
							{dataPaths.windows}
						</code>
						<Button
							className="size-6"
							onClick={() => setCopiedText(dataPaths.windows)}
							variant="outline"
						>
							{copiedText === dataPaths.windows ? (
								<CopyCheckIcon className="size-3 text-green-500" />
							) : (
								<CopyIcon className="size-3" />
							)}
						</Button>
					</li>
					<li>
						macOS:{" "}
						<code className="px-1 bg-gray-800 rounded-sm">{dataPaths.mac}</code>{" "}
						<Button
							className="size-6"
							onClick={() => setCopiedText(dataPaths.mac)}
							variant="outline"
						>
							{copiedText === dataPaths.mac ? (
								<CopyCheckIcon className="size-3 text-green-500" />
							) : (
								<CopyIcon className="size-3" />
							)}
						</Button>
					</li>
					<li>
						Linux:{" "}
						<code className="px-1 bg-gray-800 rounded-sm">
							{dataPaths.linux}
						</code>
						<Button
							className="size-6"
							onClick={() => setCopiedText(dataPaths.linux)}
							variant="outline"
						>
							{copiedText === dataPaths.linux ? (
								<CopyCheckIcon className="size-3 text-green-500" />
							) : (
								<CopyIcon className="size-3" />
							)}
						</Button>
					</li>
				</ul>
				<h2 className="text-2xl font-semibold mb-2 mt-8">
					Step 3: Add A New Installation in Story Forge
				</h2>
				<p className="mb-4">
					Open Story Forge and navigate to the "Installations" tab. Click on{" "}
					<Button variant="ghost">Add New Installation</Button> and select your
					desired name and version.
				</p>
				<h2 className="text-2xl font-semibold mb-2 mt-8">
					Step 4: Open Installation Folder
				</h2>
				<p className="mb-4">
					After creating the new installation, click on the{" "}
					<Button className="size-6" variant="outline">
						<Folder className="size-3" />
					</Button>{" "}
					Open Folder button next to your installation. This will open the
					installation directory in your file explorer.
				</p>
				<h2 className="text-2xl font-semibold mb-2 mt-8">
					Step 5: Copy Your Vintage Story Data
				</h2>
				<p className="mb-4">
					Copy the contents of your Vintage Story data folder (from Step 2) into
					the corresponding folder in your new Story Forge installation. This
					will include your mods, worlds, and configurations.
				</p>
				<h2 className="text-2xl font-semibold mb-2 mt-8">Need Help?</h2>
				<p className="mb-4">
					If you encounter any issues during the migration process or have
					questions, please refer to our{" "}
					<a
						className="text-blue-500 underline hover:text-blue-700"
						href="https://discord.gg/gByx63peUC"
					>
						Discord
					</a>{" "}
					for further assistance.
				</p>
				<p className="mb-4">
					Thank you for choosing Story Forge! We look forward to seeing the
					amazing projects you'll create with our platform.
				</p>
			</div>
		</section>
	);
}
