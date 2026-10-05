import { Input as InputPrimitive } from "@base-ui-components/react/input";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

type InputProps = Omit<InputPrimitive.Props, "size"> & {
	className?: string;
	size?: "sm" | "default" | "lg" | number;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, size = "default", ...props }, ref) => {
		return (
			<InputPrimitive
				className={cn(
					"h-8 w-full min-w-0 rounded-none border border-input bg-transparent px-2.5 py-1 text-xs transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none",
					size === "sm" && "h-7 px-2",
					size === "lg" && "h-9 px-3",
					className,
				)}
				data-slot="input"
				ref={ref}
				size={typeof size === "number" ? size : undefined}
				{...props}
			/>
		);
	},
);

export { Input };
