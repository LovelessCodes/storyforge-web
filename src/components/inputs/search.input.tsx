import type { Input as InputPrimitive } from "@base-ui-components/react/input";
import { Search } from "lucide-react";
import { forwardRef, useEffect, useId, useRef } from "react";

import { Input } from "@/components/ui/input";
import { modifierLabel } from "@/lib/utils";

type SearchInputProps = {
	className?: string;
} & Omit<InputPrimitive.Props, "className">;

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
	({ className, ...rest }, ref) => {
		const id = useId();
		const searchRef = useRef<HTMLInputElement>(null);
		useEffect(() => {
			// ⌘K / Ctrl+K focuses search from anywhere on the page.
			const handleKeyDown = (event: KeyboardEvent) => {
				if ((event.metaKey || event.ctrlKey) && event.key === "k") {
					event.preventDefault();
					searchRef.current?.focus();
				}
			};
			window.addEventListener("keydown", handleKeyDown);
			return () => {
				window.removeEventListener("keydown", handleKeyDown);
			};
		}, []);
		return (
			<div className="relative">
				<Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 z-10 size-3.5 -translate-y-1/2" />
				<Input
					className={`pe-12 pl-8 ${className ?? ""}`}
					id={id}
					placeholder="Search mods…"
					ref={(element) => {
						searchRef.current = element;
						if (typeof ref === "function") {
							ref(element);
						} else if (ref) {
							ref.current = element;
						}
					}}
					type="search"
					{...rest}
				/>
				<div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-2">
					<kbd className="border-border text-muted-foreground inline-flex h-5 items-center border px-1 font-sans text-[9px] font-medium">
						{modifierLabel}K
					</kbd>
				</div>
			</div>
		);
	},
);
