import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useRef } from "react";

import { Button } from "@/components/ui/button";
import { elementCenter, switchTheme } from "@/lib/theme-transition";

interface ThemeToggleProps {
	className?: string;
	duration?: number;
}

export function ThemeToggle({ className, duration = 400 }: ThemeToggleProps) {
	const { resolvedTheme, setTheme } = useTheme();
	const wrapperRef = useRef<HTMLSpanElement>(null);
	const isDark = resolvedTheme !== "light";

	const toggleTheme = useCallback(() => {
		// Derive from the DOM so rapid clicks can't race the React render.
		const nextTheme = document.documentElement.classList.contains("dark")
			? "light"
			: "dark";
		switchTheme(nextTheme, {
			duration,
			origin: elementCenter(wrapperRef.current),
			setTheme,
		});
	}, [duration, setTheme]);

	return (
		<span className={className} ref={wrapperRef}>
			<Button
				aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
				onClick={toggleTheme}
				size="icon-sm"
				title={isDark ? "Switch to light theme" : "Switch to dark theme"}
				variant="ghost"
			>
				{isDark ? <Moon /> : <Sun />}
			</Button>
		</span>
	);
}
