import { Autocomplete as AutocompletePrimitive } from "@base-ui-components/react/autocomplete";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useMemo, useRef, useState } from "react";

import {
	Autocomplete,
	AutocompleteInput,
	AutocompleteItem,
	AutocompleteList,
	AutocompletePopup,
} from "@/components/ui/auto-complete";
import { useMods } from "@/hooks/useMods";

type AuthorAutocompleteProps = React.InputHTMLAttributes<HTMLInputElement> & {
	/** Current game-version filter, so author suggestions follow the visible list. */
	versions?: string[];
};

export const AuthorAutocomplete = ({ versions = [], ...props }: AuthorAutocompleteProps) => {
	const { contains } = AutocompletePrimitive.useFilter({
		sensitivity: "base",
		usage: "search",
	});
	const [internalValue, setInternalValue] = useState("");
	const actualValue = props.value || internalValue;
	const viewportRef = useRef<HTMLDivElement>(null);

	const handleValueChange = (value: string) => {
		setInternalValue(value);
		props.onChange?.({
			target: { value },
		} as React.ChangeEvent<HTMLInputElement>);
	};

	const { data: mods } = useMods(versions);
	const modAuthors = useMemo(
		() =>
			mods?.reduce(
				(acc, mod) => {
					// Extract unique authors with how many mods they have
					if (mod.author) {
						acc[mod.author] = (acc[mod.author] || 0) + 1;
					}
					return acc;
				},
				{} as Record<string, number>,
			),
		[mods],
	);

	const filteredItems = useMemo(() => {
		return modAuthors
			? Object.entries(modAuthors)
					.filter(([author]) => contains(author, actualValue as string))
					.sort(([_authorA, countA], [_authorB, countB]) => countB - countA)
					.map(([author]) => author)
			: [];
	}, [contains, modAuthors, actualValue]);

	const shouldRenderPopup = actualValue !== "";

	const virtualizer = useVirtualizer({
		count: filteredItems.length,
		enabled: shouldRenderPopup,
		estimateSize: () => 40,
		getScrollElement: () => viewportRef.current,
		overscan: 20,
	});

	const handleViewportRef = useCallback(
		(element: HTMLDivElement | null) => {
			viewportRef.current = element;
			if (element) {
				virtualizer.measure();
			}
		},
		[virtualizer],
	);

	const totalSize = virtualizer.getTotalSize();
	const totalSizePx = `${totalSize}px`;

	return (
		<div className="relative w-48">
			<Autocomplete
				autoHighlight
				items={(modAuthors && Object.keys(modAuthors)) || []}
				itemToStringValue={(author: unknown) => author as string}
				onValueChange={handleValueChange}
				value={actualValue as string}
				virtualized
			>
				<AutocompleteInput
					aria-label="Select author"
					className="h-8"
					placeholder="Select author…"
					showClear
					showTrigger
				/>
				{shouldRenderPopup && (
					<AutocompletePopup>
						<AutocompleteList scrollFade viewportRef={handleViewportRef}>
							{filteredItems.length > 0 && (
								<div
									className="relative w-full"
									role="presentation"
									style={{ height: totalSizePx }}
								>
									{virtualizer.getVirtualItems().map((virtualItem) => {
										const author = filteredItems[virtualItem.index];
										if (!author) return null;
										if (!modAuthors) return null;
										const modCount = modAuthors[author];
										return (
											<AutocompleteItem
												aria-posinset={virtualItem.index + 1}
												aria-setsize={filteredItems.length}
												className="flex cursor-default py-1.5 pr-8 pl-3 text-xs outline-none"
												index={virtualItem.index}
												key={virtualItem.key}
												style={{
													height: `${virtualItem.size}px`,
													left: 0,
													position: "absolute",
													top: 0,
													transform: `translateY(${virtualItem.start}px)`,
													width: "100%",
												}}
												value={author}
											>
												<div className="flex w-full flex-col">
													<div className="text-xs font-medium">{author}</div>
													<div className="text-muted-foreground text-[10px]">
														{modCount} mod{modCount > 1 ? "s" : ""}
													</div>
												</div>
											</AutocompleteItem>
										);
									})}
								</div>
							)}
						</AutocompleteList>
					</AutocompletePopup>
				)}
			</Autocomplete>
		</div>
	);
};
