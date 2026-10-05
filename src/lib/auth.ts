import { createAuthClient } from "better-auth/react";

/** Story Forge API (better-auth + modpacks + ModDB proxy). */
export const API_BASE_URL = "https://vsapi.betterjs.dev";

/**
 * Web auth client. Uses better-auth's default cookie sessions
 * (`credentials: "include"`); the API trusts https://getstoryforge.app.
 */
export const authClient = createAuthClient({
	baseURL: API_BASE_URL,
	sessionOptions: {
		refetchInterval: 0,
		refetchOnWindowFocus: false,
	},
});
