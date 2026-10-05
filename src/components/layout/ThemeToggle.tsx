import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { elementCenter, switchTheme } from "@/lib/theme-transition";

interface ThemeToggleProps {
	className?: string;
	duration?: number;
}

export function ThemeToggle({ className, duration = 400 }: ThemeToggleProps) {
	const { t } = useTranslation();
	const { resolvedTheme, setTheme } = useTheme();
	const wrapperRef = useRef<HTMLSpanElement>(null);
	const isDark = resolvedTheme !== "light";
	const label = isDark ? t("common.switchToLight") : t("common.switchToDark");

	const toggleTheme = useCallback(() => {
		// Derive from the DOM so rapid clicks can't race the React render.
		const nextTheme = document.documentElement.classList.contains("dark") ? "light" : "dark";
		switchTheme(nextTheme, {
			duration,
			origin: elementCenter(wrapperRef.current),
			setTheme,
		});
	}, [duration, setTheme]);

	return (
		<span className={className} ref={wrapperRef}>
			<Button aria-label={label} onClick={toggleTheme} size="icon-sm" title={label} variant="ghost">
				{isDark ? <Moon /> : <Sun />}
			</Button>
		</span>
	);
}
