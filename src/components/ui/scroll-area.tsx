import { ScrollArea as ScrollAreaPrimitive } from "@base-ui-components/react/scroll-area";
import type * as React from "react";

import { cn } from "@/lib/utils";

interface ScrollAreaProps extends ScrollAreaPrimitive.Root.Props {
	/** Fade the top/bottom edges while there is more content to scroll to. */
	scrollFade?: boolean;
	viewportRef?: React.Ref<HTMLDivElement>;
}

function ScrollArea({
	className,
	children,
	scrollFade = false,
	viewportRef,
	...props
}: ScrollAreaProps) {
	return (
		<ScrollAreaPrimitive.Root
			className={cn("relative", className)}
			data-slot="scroll-area"
			{...props}
		>
			<ScrollAreaPrimitive.Viewport
				className={cn(
					"size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-1 focus-visible:ring-ring/50",
					scrollFade &&
						"mask-t-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-start)))] mask-b-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-end)))] [--fade-size:2rem]",
				)}
				data-slot="scroll-area-viewport"
				ref={viewportRef}
			>
				{children}
			</ScrollAreaPrimitive.Viewport>
			<ScrollBar />
			<ScrollAreaPrimitive.Corner />
		</ScrollAreaPrimitive.Root>
	);
}

function ScrollBar({
	className,
	orientation = "vertical",
	...props
}: ScrollAreaPrimitive.Scrollbar.Props) {
	return (
		<ScrollAreaPrimitive.Scrollbar
			className={cn(
				"flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-vertical:h-full data-vertical:w-2.5",
				className,
			)}
			data-orientation={orientation}
			data-slot="scroll-area-scrollbar"
			orientation={orientation}
			{...props}
		>
			<ScrollAreaPrimitive.Thumb
				className="bg-border relative flex-1"
				data-slot="scroll-area-thumb"
			/>
		</ScrollAreaPrimitive.Scrollbar>
	);
}

export { ScrollArea, ScrollBar };
