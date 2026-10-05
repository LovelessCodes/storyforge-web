import { useRouter, useRouterState } from "@tanstack/react-router";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";

import { ScrollToTopButton } from "@/components/layout/ScrollToTopButton";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PageScrollContextValue {
	/** Scroll the page so the element with this id is at the top. */
	scrollToId: (id: string) => void;
	viewport: HTMLDivElement | null;
}

const PageScrollContext = createContext<PageScrollContextValue>({
	scrollToId: () => undefined,
	viewport: null,
});

export function usePageScroll() {
	return useContext(PageScrollContext);
}

/**
 * The site's page scroller. Every route renders inside this ScrollArea —
 * the document itself never scrolls. Position is kept per page and restored
 * when navigating back, and the back-to-top button lives here so it can talk
 * to the viewport.
 */
export function PageScroll({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [viewport, setViewport] = useState<HTMLDivElement | null>(null);

	// Use the leaf match, not the location: during a navigation the location
	// flips immediately while the outlet still renders the old page.
	const renderedPathname = useRouterState({
		select: (state) =>
			state.matches[state.matches.length - 1]?.pathname ??
			state.location.pathname,
	});

	const positionsRef = useRef(new Map<string, number>());
	const renderedRef = useRef(renderedPathname);
	const directionRef = useRef<"back" | "forward" | null>(null);

	// Capture whether the next navigation is a back/forward one. The router
	// only exposes the from/to history indexes at the transition itself.
	useEffect(() => {
		return router.subscribe(
			"onBeforeLoad",
			({ fromLocation, pathChanged, toLocation }) => {
				if (!pathChanged) return;
				const from = fromLocation?.state.__TSR_index ?? 0;
				const to = toLocation.state.__TSR_index ?? 0;
				directionRef.current = to < from ? "back" : "forward";
			},
		);
	}, [router]);

	// Remember where the user was on every page.
	useEffect(() => {
		if (!viewport) return;
		const onScroll = () => {
			positionsRef.current.set(renderedRef.current, viewport.scrollTop);
		};
		viewport.addEventListener("scroll", onScroll, { passive: true });
		return () => viewport.removeEventListener("scroll", onScroll);
	}, [viewport]);

	// New page → start at the top once it has rendered. Back/forward →
	// restore the saved position (after layout, so the height is final).
	useEffect(() => {
		if (!viewport) return;
		if (renderedRef.current !== renderedPathname) {
			const direction = directionRef.current;
			directionRef.current = null;
			const target =
				direction === "back"
					? (positionsRef.current.get(renderedPathname) ?? 0)
					: 0;
			renderedRef.current = renderedPathname;
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					viewport.scrollTo({ top: target });
				});
			});
		}
	}, [renderedPathname, viewport]);

	const scrollToId = useCallback(
		(id: string) => {
			viewport
				?.querySelector(`#${CSS.escape(id)}`)
				?.scrollIntoView({ behavior: "smooth", block: "start" });
		},
		[viewport],
	);

	return (
		<PageScrollContext.Provider value={{ scrollToId, viewport }}>
			<ScrollArea
				className="min-h-0 flex-1"
				scrollFade
				viewportRef={setViewport}
			>
				<div className="flex min-h-full flex-col">{children}</div>
			</ScrollArea>
			<ScrollToTopButton />
		</PageScrollContext.Provider>
	);
}
