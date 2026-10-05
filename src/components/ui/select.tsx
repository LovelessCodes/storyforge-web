import { Select as SelectPrimitive } from "@base-ui-components/react/select";
import {
	CheckIcon,
	ChevronDownIcon,
	ChevronsUpDownIcon,
	ChevronUpIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;

function SelectTrigger({
	className,
	size = "default",
	children,
	...props
}: SelectPrimitive.Trigger.Props & {
	size?: "sm" | "default" | "lg";
}) {
	return (
		<SelectPrimitive.Trigger
			className={cn(
				"relative inline-flex h-8 w-full min-w-36 items-center justify-between gap-2 rounded-none border border-input bg-transparent px-2.5 py-1 text-xs transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				size === "sm" && "h-7 px-2",
				size === "lg" && "h-9 px-3",
				className,
			)}
			data-slot="select-trigger"
			{...props}
		>
			{children}
			<SelectPrimitive.Icon data-slot="select-icon">
				<ChevronsUpDownIcon className="-me-0.5 size-3.5 opacity-70" />
			</SelectPrimitive.Icon>
		</SelectPrimitive.Trigger>
	);
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
	return (
		<SelectPrimitive.Value
			className={cn("truncate", className)}
			data-slot="select-value"
			{...props}
		/>
	);
}

function SelectPopup({
	className,
	children,
	sideOffset = 4,
	align = "start",
	alignItemWithTrigger = false,
	...props
}: SelectPrimitive.Popup.Props & {
	sideOffset?: SelectPrimitive.Positioner.Props["sideOffset"];
	alignItemWithTrigger?: SelectPrimitive.Positioner.Props["alignItemWithTrigger"];
	align?: SelectPrimitive.Positioner.Props["align"];
}) {
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Positioner
				align={align}
				alignItemWithTrigger={alignItemWithTrigger}
				className="z-50 select-none"
				data-slot="select-positioner"
				sideOffset={sideOffset}
			>
				<SelectPrimitive.Popup
					className="min-w-(--anchor-width) origin-(--transform-origin) rounded-none bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 transition-[scale,opacity] data-ending-style:scale-98 data-ending-style:opacity-0 data-starting-style:scale-98 data-starting-style:opacity-0"
					data-slot="select-popup"
					{...props}
				>
					<SelectPrimitive.ScrollUpArrow
						className="top-0 z-50 flex h-6 w-full cursor-default items-center justify-center bg-popover text-muted-foreground"
						data-slot="select-scroll-up-arrow"
					>
						<ChevronUpIcon className="size-4" />
					</SelectPrimitive.ScrollUpArrow>
					<SelectPrimitive.List
						className={cn(
							"max-h-(--available-height) min-w-(--anchor-width) overflow-y-auto p-1",
							className,
						)}
						data-slot="select-list"
					>
						{children}
					</SelectPrimitive.List>
					<SelectPrimitive.ScrollDownArrow
						className="bottom-0 z-50 flex h-6 w-full cursor-default items-center justify-center bg-popover text-muted-foreground"
						data-slot="select-scroll-down-arrow"
					>
						<ChevronDownIcon className="size-4" />
					</SelectPrimitive.ScrollDownArrow>
				</SelectPrimitive.Popup>
			</SelectPrimitive.Positioner>
		</SelectPrimitive.Portal>
	);
}

function SelectItem({
	className,
	children,
	...props
}: SelectPrimitive.Item.Props) {
	return (
		<SelectPrimitive.Item
			className={cn(
				"grid cursor-default grid-cols-[1rem_1fr] items-center gap-2 rounded-none py-1.5 ps-2 pe-4 text-xs outline-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
				className,
			)}
			data-slot="select-item"
			{...props}
		>
			<SelectPrimitive.ItemIndicator className="col-start-1">
				<CheckIcon className="size-3.5" />
			</SelectPrimitive.ItemIndicator>
			<SelectPrimitive.ItemText className="col-start-2">
				{children}
			</SelectPrimitive.ItemText>
		</SelectPrimitive.Item>
	);
}

function SelectSeparator({
	className,
	...props
}: SelectPrimitive.Separator.Props) {
	return (
		<SelectPrimitive.Separator
			className={cn("-mx-1 my-1 h-px bg-border", className)}
			data-slot="select-separator"
			{...props}
		/>
	);
}

function SelectGroup(props: SelectPrimitive.Group.Props) {
	return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectGroupLabel({
	className,
	...props
}: SelectPrimitive.GroupLabel.Props) {
	return (
		<SelectPrimitive.GroupLabel
			className={cn(
				"px-2 py-1.5 text-[10px] font-medium tracking-widest text-muted-foreground uppercase",
				className,
			)}
			data-slot="select-group-label"
			{...props}
		/>
	);
}

export {
	Select,
	SelectTrigger,
	SelectValue,
	SelectPopup,
	SelectPopup as SelectContent,
	SelectItem,
	SelectSeparator,
	SelectGroup,
	SelectGroupLabel,
};
