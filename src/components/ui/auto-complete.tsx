import { Autocomplete as AutocompletePrimitive } from "@base-ui-components/react/autocomplete";
import { ChevronsUpDownIcon, XIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const Autocomplete = AutocompletePrimitive.Root;

function AutocompleteInput({
	className,
	showTrigger = false,
	showClear = false,
	size,
	...props
}: Omit<AutocompletePrimitive.Input.Props, "size"> & {
	showTrigger?: boolean;
	showClear?: boolean;
	size?: "sm" | "default" | "lg" | number;
}) {
	const sizeValue = (size ?? "default") as "sm" | "default" | "lg" | number;

	return (
		<div className="relative w-full">
			<AutocompletePrimitive.Input
				className={cn(
					sizeValue === "sm"
						? "has-[+[data-slot=autocomplete-trigger],+[data-slot=autocomplete-clear]]:*:data-[slot=autocomplete-input]:pe-6"
						: "has-[+[data-slot=autocomplete-trigger],+[data-slot=autocomplete-clear]]:*:data-[slot=autocomplete-input]:pe-7",
					className,
				)}
				data-slot="autocomplete-input"
				render={<Input size={sizeValue} />}
				{...props}
			/>
			{showTrigger && (
				<AutocompleteTrigger
					className={cn(
						"absolute top-1/2 inline-flex size-6 shrink-0 -translate-y-1/2 cursor-pointer items-center justify-center rounded-none border border-transparent opacity-70 transition-colors outline-none hover:opacity-100 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
						sizeValue === "sm" ? "end-0" : "end-0.5",
					)}
				>
					<ChevronsUpDownIcon />
				</AutocompleteTrigger>
			)}
			{showClear && (
				<AutocompleteClear
					className={cn(
						"absolute top-1/2 inline-flex size-6 shrink-0 -translate-y-1/2 cursor-pointer items-center justify-center rounded-none border border-transparent opacity-70 transition-colors outline-none hover:opacity-100 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
						sizeValue === "sm" ? "end-0" : "end-0.5",
					)}
				>
					<XIcon />
				</AutocompleteClear>
			)}
		</div>
	);
}

function AutocompletePopup({
	className,
	children,
	sideOffset = 4,
	...props
}: AutocompletePrimitive.Popup.Props & {
	sideOffset?: number;
}) {
	return (
		<AutocompletePrimitive.Portal>
			<AutocompletePrimitive.Positioner
				className="z-50 select-none"
				data-slot="autocomplete-positioner"
				sideOffset={sideOffset}
			>
				<span className="bg-popover relative flex max-h-full origin-(--transform-origin) rounded-none border bg-clip-padding shadow-lg transition-[scale,opacity] has-data-starting-style:scale-98 has-data-starting-style:opacity-0">
					<AutocompletePrimitive.Popup
						className={cn(
							"flex max-h-[min(var(--available-height),23rem)] w-(--anchor-width) max-w-(--available-width) flex-col",
							className,
						)}
						data-slot="autocomplete-popup"
						{...props}
					>
						{children}
					</AutocompletePrimitive.Popup>
				</span>
			</AutocompletePrimitive.Positioner>
		</AutocompletePrimitive.Portal>
	);
}

function AutocompleteItem({ className, children, ...props }: AutocompletePrimitive.Item.Props) {
	return (
		<AutocompletePrimitive.Item
			className={cn(
				"flex cursor-default items-center rounded-none px-2 py-1 text-xs outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-accent data-highlighted:text-accent-foreground",
				className,
			)}
			data-slot="autocomplete-item"
			{...props}
		>
			{children}
		</AutocompletePrimitive.Item>
	);
}

function AutocompleteSeparator({ className, ...props }: AutocompletePrimitive.Separator.Props) {
	return (
		<AutocompletePrimitive.Separator
			className={cn("mx-2 my-1 h-px bg-border last:hidden", className)}
			data-slot="autocomplete-separator"
			{...props}
		/>
	);
}

function AutocompleteGroup({ className, ...props }: AutocompletePrimitive.Group.Props) {
	return (
		<AutocompletePrimitive.Group className={className} data-slot="autocomplete-group" {...props} />
	);
}

function AutocompleteGroupLabel({ className, ...props }: AutocompletePrimitive.GroupLabel.Props) {
	return (
		<AutocompletePrimitive.GroupLabel
			className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)}
			data-slot="autocomplete-group-label"
			{...props}
		/>
	);
}

function AutocompleteEmpty({ className, ...props }: AutocompletePrimitive.Empty.Props) {
	return (
		<AutocompletePrimitive.Empty
			className={cn("text-center text-sm text-muted-foreground not-empty:p-2", className)}
			data-slot="autocomplete-empty"
			{...props}
		/>
	);
}

function AutocompleteRow({ className, ...props }: AutocompletePrimitive.Row.Props) {
	return (
		<AutocompletePrimitive.Row className={className} data-slot="autocomplete-row" {...props} />
	);
}

function AutocompleteValue({ ...props }: AutocompletePrimitive.Value.Props) {
	return <AutocompletePrimitive.Value data-slot="autocomplete-value" {...props} />;
}

function AutocompleteList({
	className,
	viewportRef,
	scrollFade = false,
	...props
}: AutocompletePrimitive.List.Props & {
	viewportRef?: React.Ref<HTMLDivElement>;
	scrollFade?: boolean;
}) {
	return (
		<ScrollArea className="min-h-0 flex-1" scrollFade={scrollFade} viewportRef={viewportRef}>
			<AutocompletePrimitive.List
				className={cn(
					"not-empty:scroll-py-1 not-empty:px-1 not-empty:py-1 in-data-has-overflow-y:pe-3",
					className,
				)}
				data-slot="autocomplete-list"
				{...props}
			/>
		</ScrollArea>
	);
}

function AutocompleteClear({ className, ...props }: AutocompletePrimitive.Clear.Props) {
	return (
		<AutocompletePrimitive.Clear
			className={cn(
				"absolute end-0.5 top-1/2 inline-flex size-6 shrink-0 -translate-y-1/2 cursor-pointer items-center justify-center rounded-none border border-transparent opacity-70 transition-[color,background-color,box-shadow,opacity] outline-none hover:opacity-100 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
				className,
			)}
			data-slot="autocomplete-clear"
			{...props}
		>
			<XIcon />
		</AutocompletePrimitive.Clear>
	);
}

function AutocompleteStatus({ className, ...props }: AutocompletePrimitive.Status.Props) {
	return (
		<AutocompletePrimitive.Status
			className={cn(
				"px-3 py-2 text-xs font-medium text-muted-foreground empty:m-0 empty:p-0",
				className,
			)}
			data-slot="autocomplete-status"
			{...props}
		/>
	);
}

function AutocompleteCollection({ ...props }: AutocompletePrimitive.Collection.Props) {
	return <AutocompletePrimitive.Collection data-slot="autocomplete-collection" {...props} />;
}

function AutocompleteTrigger({ className, ...props }: AutocompletePrimitive.Trigger.Props) {
	return (
		<AutocompletePrimitive.Trigger
			className={className}
			data-slot="autocomplete-trigger"
			{...props}
		/>
	);
}

export {
	Autocomplete,
	AutocompleteInput,
	AutocompleteTrigger,
	AutocompletePopup,
	AutocompleteItem,
	AutocompleteSeparator,
	AutocompleteGroup,
	AutocompleteGroupLabel,
	AutocompleteEmpty,
	AutocompleteValue,
	AutocompleteList,
	AutocompleteClear,
	AutocompleteStatus,
	AutocompleteRow,
	AutocompleteCollection,
};
