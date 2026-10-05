import { Info, Lightbulb, TriangleAlert } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

/* ── Step ───────────────────────────────────────────────────────────── */

interface StepProps {
	n: number;
	title: string;
	children: React.ReactNode;
}

export function Step({ n, title, children }: StepProps) {
	return (
		<div className="grid gap-3 border-b border-border/60 py-6 first:pt-0 last:border-b-0 last:pb-0">
			<div className="flex items-center gap-3">
				<span className="grid size-6 shrink-0 place-items-center border border-accent-primary/40 bg-accent-primary/10 text-[10px] font-bold text-accent-primary">
					{n}
				</span>
				<h2 className="text-sm font-bold tracking-tight">{title}</h2>
			</div>
			<div className="grid gap-3 pl-9 text-xs/relaxed text-muted-foreground">
				{children}
			</div>
		</div>
	);
}

/* ── Callout ────────────────────────────────────────────────────────── */

const calloutVariants = {
	info: {
		icon: Info,
		styles: "border-info/30 bg-info/5 [&_svg]:text-info",
	},
	tip: {
		icon: Lightbulb,
		styles: "border-success/30 bg-success/5 [&_svg]:text-success",
	},
	warning: {
		icon: TriangleAlert,
		styles:
			"border-accent-amber/30 bg-accent-amber/5 [&_svg]:text-accent-amber",
	},
} as const;

interface CalloutProps {
	children: React.ReactNode;
	variant?: keyof typeof calloutVariants;
}

export function Callout({ children, variant = "info" }: CalloutProps) {
	const { icon: Icon, styles } = calloutVariants[variant];
	return (
		<div className={cn("flex gap-3 border p-3 text-[11px]/relaxed", styles)}>
			<Icon className="mt-0.5 size-3.5 shrink-0" />
			<div className="text-muted-foreground">{children}</div>
		</div>
	);
}

/* ── Misc prose helpers ─────────────────────────────────────────────── */

export function Code({ children }: { children: React.ReactNode }) {
	return (
		<code className="border border-border bg-background px-1 font-mono text-[10px] text-foreground">
			{children}
		</code>
	);
}
