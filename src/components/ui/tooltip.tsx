"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui-components/react/tooltip";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

function TooltipTrigger(props: TooltipPrimitive.Trigger.Props) {
	return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipPopup({
	className,
	align = "center",
	sideOffset = 4,
	side = "top",
	children,
	...props
}: TooltipPrimitive.Popup.Props & {
	align?: TooltipPrimitive.Positioner.Props["align"];
	side?: TooltipPrimitive.Positioner.Props["side"];
	sideOffset?: TooltipPrimitive.Positioner.Props["sideOffset"];
}) {
	return (
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Positioner
				align={align}
				className="isolate z-50"
				data-slot="tooltip-positioner"
				side={side}
				sideOffset={sideOffset}
			>
				<TooltipPrimitive.Popup
					className={cn(
						"z-50 w-fit max-w-xs origin-(--transform-origin) rounded-none bg-foreground px-2 py-1 text-[11px] text-balance text-background transition-[scale,opacity] data-ending-style:scale-98 data-ending-style:opacity-0 data-instant:duration-0 data-starting-style:scale-98 data-starting-style:opacity-0",
						className,
					)}
					data-slot="tooltip-content"
					{...props}
				>
					{children}
				</TooltipPrimitive.Popup>
			</TooltipPrimitive.Positioner>
		</TooltipPrimitive.Portal>
	);
}

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipPopup, TooltipPopup as TooltipContent };
