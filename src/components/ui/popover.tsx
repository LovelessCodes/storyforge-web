import { Popover as PopoverPrimitive } from "@base-ui-components/react/popover";
import type * as React from "react";
import { cn } from "@/lib/utils";

function Popover({
	...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
	return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({
	...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
	return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverPositioner({
	className,
	align = "center",
	sideOffset = 4,
	...props
}: React.ComponentProps<typeof PopoverPrimitive.Positioner>) {
	return (
		<PopoverPrimitive.Portal>
			<PopoverPrimitive.Backdrop data-slot="popover-backdrop" />
			<PopoverPrimitive.Positioner
				align={align}
				className={cn(className)}
				data-slot="popover-positioner"
				sideOffset={sideOffset}
				{...props}
			/>
		</PopoverPrimitive.Portal>
	);
}

function PopoverPopup({
	className,
	...props
}: React.ComponentProps<typeof PopoverPrimitive.Popup>) {
	return (
		<PopoverPrimitive.Popup
			className={cn(
				"bg-popover text-popover-foreground data-[open='']:animate-in animate-out fade-out-0 data-[open='']:fade-in-0 zoom-out-95 data-[open='']:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--transform-origin) rounded-md border p-4 shadow-md outline-hidden",
				className,
			)}
			data-slot="popover-Popup"
			{...props}
		/>
	);
}

export { Popover, PopoverTrigger, PopoverPopup, PopoverPositioner };
