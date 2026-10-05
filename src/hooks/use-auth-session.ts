import { authClient } from "@/lib/auth";

/**
 * Convenience wrapper around better-auth's session hook: returns the
 * current user/session plus a sign-out helper.
 */
export function useAuthSession() {
	const { data, isPending, error, refetch } = authClient.useSession();

	return {
		error,
		isLoading: isPending,
		refetch,
		session: data?.session ?? null,
		signOut: async () => {
			await authClient.signOut();
			await refetch();
		},
		user: data?.user ?? null,
	};
}
