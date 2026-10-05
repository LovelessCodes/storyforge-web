import { Check, Globe } from "lucide-react";
import { useRef } from "react";
import { flushSync } from "react-dom";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { languages } from "@/lib/i18n";
import { circleReveal, elementCenter } from "@/lib/view-transition";

interface LanguageSwitcherProps {
	className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
	const { i18n, t } = useTranslation();
	const wrapperRef = useRef<HTMLSpanElement>(null);
	const current = i18n.resolvedLanguage ?? "en";

	const selectLanguage = (code: string) => {
		if (code === current) return;
		circleReveal(
			() => {
				// Flush so the new language is in the DOM before the browser
				// captures the incoming snapshot of the transition.
				flushSync(() => {
					void i18n.changeLanguage(code);
				});
			},
			{ origin: elementCenter(wrapperRef.current) },
		);
	};

	return (
		<span className={className} ref={wrapperRef}>
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button
							aria-label={t("common.language")}
							size="icon-sm"
							title={t("common.language")}
							variant="ghost"
						/>
					}
				>
					<Globe />
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="min-w-40">
					<DropdownMenuGroup>
						<DropdownMenuLabel>{t("common.language")}</DropdownMenuLabel>
						{languages.map((language) => (
							<DropdownMenuItem key={language.code} onClick={() => selectLanguage(language.code)}>
								{language.label}
								{current === language.code && <Check className="ml-auto size-3.5" />}
							</DropdownMenuItem>
						))}
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</span>
	);
}
