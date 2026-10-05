import { mergeProps } from "@base-ui-components/react/merge-props";
import { useRender } from "@base-ui-components/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"group/button relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-none border border-transparent bg-clip-padding text-xs font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	{
		defaultVariants: {
			size: "default",
			variant: "default",
		},
		variants: {
			size: {
				default: "h-8 px-2.5",
				icon: "size-8",
				"icon-lg": "size-9",
				"icon-sm": "size-7",
				"icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
				lg: "h-9 gap-1.5 px-2.5",
				sm: "h-7 gap-1.5 px-2.5 [&_svg:not([class*='size-'])]:size-3.5",
				xl: "h-10 gap-2 px-4 text-sm [&_svg:not([class*='size-'])]:size-4.5",
				xs: "h-6 gap-1 px-2 text-[11px] [&_svg:not([class*='size-'])]:size-3",
			},
			variant: {
				accent:
					"bg-accent-primary text-white hover:bg-accent-primary-hover focus-visible:border-accent-primary/40 focus-visible:ring-accent-primary/30",
				amber:
					"bg-accent-amber text-[#0f1117] hover:bg-accent-amber-hover focus-visible:border-accent-amber/40 focus-visible:ring-accent-amber/30",
				default: "bg-primary text-primary-foreground hover:bg-primary/80",
				destructive:
					"bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
				ghost:
					"hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
				info: "bg-info text-[#0f1117] hover:bg-info/80",
				link: "text-primary underline-offset-4 hover:underline",
				outline:
					"border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
				"outline-accent":
					"border-accent-primary/40 bg-transparent text-accent-primary hover:bg-accent-primary/10 hover:text-accent-primary",
				"outline-amber":
					"border-accent-amber/40 bg-transparent text-accent-amber hover:bg-accent-amber/10 hover:text-accent-amber",
				"outline-success":
					"border-success/40 bg-transparent text-success hover:bg-success/10 hover:text-success",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary",
				success:
					"bg-success text-white hover:bg-success/80 focus-visible:border-success/40 focus-visible:ring-success/30",
				warning: "bg-warning text-[#0f1117] hover:bg-warning/80",
			},
		},
	},
);

interface ButtonProps extends useRender.ComponentProps<"button"> {
	variant?: VariantProps<typeof buttonVariants>["variant"];
	size?: VariantProps<typeof buttonVariants>["size"];
}

function Button({ className, variant, size, render, ...props }: ButtonProps) {
	const typeValue: React.ButtonHTMLAttributes<HTMLButtonElement>["type"] = render
		? undefined
		: "button";

	const defaultProps = {
		className: cn(buttonVariants({ className, size, variant })),
		"data-slot": "button",
		type: typeValue,
	};

	return useRender({
		defaultTagName: "button",
		props: mergeProps<"button">(defaultProps, props),
		render,
	});
}

export { Button, buttonVariants };
