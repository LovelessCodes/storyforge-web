export function elementCenter(element: Element | null): { x: number; y: number } | undefined {
	if (!element) return undefined;
	const { top, left, width, height } = element.getBoundingClientRect();
	return { x: left + width / 2, y: top + height / 2 };
}

interface CircleRevealOptions {
	duration?: number;
	origin?: { x: number; y: number };
}

/**
 * Run `apply` inside a View Transition with a clip-path circle reveal from
 * `origin`. Falls back to a plain call when the API is unavailable or the
 * user prefers reduced motion.
 */
export function circleReveal(
	apply: () => void,
	{ duration = 400, origin }: CircleRevealOptions = {},
): void {
	if (
		typeof document.startViewTransition !== "function" ||
		window.matchMedia("(prefers-reduced-motion: reduce)").matches
	) {
		apply();
		return;
	}

	const viewportWidth = window.innerWidth;
	const viewportHeight = window.innerHeight;
	const x = origin?.x ?? viewportWidth / 2;
	const y = origin?.y ?? viewportHeight / 2;
	const maxRadius = Math.hypot(Math.max(x, viewportWidth - x), Math.max(y, viewportHeight - y));

	// clip-path percentages resolve against the snapshot reference box, so the
	// circle lands correctly at any display scale.
	const point = `${((x / viewportWidth) * 100).toFixed(3)}% ${((y / viewportHeight) * 100).toFixed(3)}%`;
	const endRadius = `${((maxRadius / (Math.hypot(viewportWidth, viewportHeight) / Math.SQRT2)) * 100).toFixed(3)}%`;

	const transition = document.startViewTransition(apply);
	void transition.finished.catch(() => undefined);
	void transition.ready
		.then(() => {
			document.documentElement.animate(
				{
					clipPath: [`circle(0% at ${point})`, `circle(${endRadius} at ${point})`],
				},
				{
					duration,
					easing: "ease-in-out",
					fill: "forwards",
					pseudoElement: "::view-transition-new(root)",
				},
			);
		})
		.catch(() => undefined);
}
