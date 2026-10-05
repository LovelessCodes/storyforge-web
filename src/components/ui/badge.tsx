import { mergeProps } from "@base-ui-components/react/merge-props";
import { useRender } from "@base-ui-components/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-none border border-transparent px-2 py-0.5 text-[10px] font-medium whitespace-nowrap transition-all [&>svg]:pointer-events-none [&>svg]:size-3!",
	{
		defaultVariants: {
			variant: "default",
		},
		variants: {
			variant: {
				accent: "bg-accent-primary text-white",
				amber: "bg-accent-amber text-[#0f1117]",
				default: "bg-primary text-primary-foreground",
				destructive: "bg-destructive/10 text-destructive",
				ghost: "hover:bg-muted hover:text-muted-foreground",
				link: "text-primary underline-offset-4 hover:underline",
				outline: "border-border text-foreground",
				secondary: "bg-secondary text-secondary-foreground",
				success: "bg-success/10 text-success",
			},
		},
	},
);

function Badge({
	className,
	variant = "default",
	render,
	...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
	return useRender({
		defaultTagName: "span",
		props: mergeProps<"span">(
			{
				className: cn(badgeVariants({ variant }), className),
			},
			props,
		),
		render,
		state: {
			slot: "badge",
			variant,
		},
	});
}

export { Badge, badgeVariants };
