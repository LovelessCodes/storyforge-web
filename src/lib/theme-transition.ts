import { circleReveal, elementCenter } from "@/lib/view-transition";

export { elementCenter };

interface SwitchThemeOptions {
	duration?: number;
	origin?: { x: number; y: number };
	setTheme: (theme: string) => void;
}

/**
 * Switch the theme with a clip-path circle reveal when the View Transitions
 * API is available, and a plain switch when it is not.
 */
export function switchTheme(
	nextTheme: "light" | "dark",
	{ duration = 400, origin, setTheme }: SwitchThemeOptions,
): void {
	circleReveal(
		() => {
			document.documentElement.classList.toggle("dark", nextTheme === "dark");
			document
				.querySelector('meta[name="theme-color"]')
				?.setAttribute("content", nextTheme === "dark" ? "#0f1117" : "#ffffff");
			setTheme(nextTheme);
		},
		{ duration, origin },
	);
}
