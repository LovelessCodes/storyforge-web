import { Popover as PopoverPrimitive } from "@base-ui-components/react/popover";

import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Root;

function PopoverTrigger(props: PopoverPrimitive.Trigger.Props) {
	return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverPopup({
	children,
	className,
	side = "bottom",
	align = "center",
	sideOffset = 8,
	...props
}: PopoverPrimitive.Popup.Props & {
	side?: PopoverPrimitive.Positioner.Props["side"];
	align?: PopoverPrimitive.Positioner.Props["align"];
	sideOffset?: PopoverPrimitive.Positioner.Props["sideOffset"];
}) {
	return (
		<PopoverPrimitive.Portal>
			<PopoverPrimitive.Positioner
				align={align}
				className="z-50"
				data-slot="popover-positioner"
				side={side}
				sideOffset={sideOffset}
			>
				<PopoverPrimitive.Popup
					className={cn(
						"relative max-h-(--available-height) min-w-80 origin-(--transform-origin) overflow-y-auto rounded-none bg-popover p-3 text-popover-foreground shadow-md ring-1 ring-foreground/10 transition-[scale,opacity] data-ending-style:scale-98 data-ending-style:opacity-0 data-starting-style:scale-98 data-starting-style:opacity-0",
						className,
					)}
					data-slot="popover-content"
					{...props}
				>
					{children}
				</PopoverPrimitive.Popup>
			</PopoverPrimitive.Positioner>
		</PopoverPrimitive.Portal>
	);
}

function PopoverClose(props: PopoverPrimitive.Close.Props) {
	return <PopoverPrimitive.Close data-slot="popover-close" {...props} />;
}

function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
	return (
		<PopoverPrimitive.Title
			className={cn("text-sm leading-none font-semibold", className)}
			data-slot="popover-title"
			{...props}
		/>
	);
}

function PopoverDescription({
	className,
	...props
}: PopoverPrimitive.Description.Props) {
	return (
		<PopoverPrimitive.Description
			className={cn("text-xs text-muted-foreground", className)}
			data-slot="popover-description"
			{...props}
		/>
	);
}

export {
	Popover,
	PopoverTrigger,
	PopoverPopup,
	PopoverPopup as PopoverContent,
	PopoverTitle,
	PopoverDescription,
	PopoverClose,
};
