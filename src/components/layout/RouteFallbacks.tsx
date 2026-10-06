import { type ErrorComponentProps, Link } from "@tanstack/react-router";
import { ArrowLeft, Compass, RefreshCw, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Unmatched URLs — the root route's `notFoundComponent`. */
export function RouteNotFound() {
	return (
		<main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center sm:px-6">
			<p className="text-accent-amber text-[10px] font-medium tracking-widest uppercase">404</p>
			<Compass className="text-muted-foreground size-6" />
			<h1 className="text-xl font-bold tracking-tight">This page doesn’t exist</h1>
			<p className="text-muted-foreground max-w-sm text-xs">
				The page you are looking for may have been moved or deleted.
			</p>
			<Button render={<Link to="/" />} size="sm" variant="outline">
				<ArrowLeft /> Back home
			</Button>
		</main>
	);
}

/** Route render/load errors — the root route's `errorComponent`. */
export function RouteError({ error, reset }: ErrorComponentProps) {
	return (
		<main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center sm:px-6">
			<p className="text-destructive text-[10px] font-medium tracking-widest uppercase">Error</p>
			<TriangleAlert className="text-muted-foreground size-6" />
			<h1 className="text-xl font-bold tracking-tight">Something went wrong</h1>
			<p className="text-muted-foreground max-w-sm text-xs">
				{error.message || "An unexpected error occurred while loading this page."}
			</p>
			<Button onClick={reset} size="sm" variant="outline">
				<RefreshCw /> Try again
			</Button>
		</main>
	);
}
