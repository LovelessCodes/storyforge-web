import { motion, useReducedMotion } from "motion/react";
import type * as React from "react";

interface RevealProps {
	children: React.ReactNode;
	className?: string;
	delay?: number;
	/** Vertical offset before the element reveals. */
	y?: number;
}

/** Fades/slides its children into view the first time they are visible. */
export function Reveal({ children, className, delay = 0, y = 18 }: RevealProps) {
	const reduceMotion = useReducedMotion();

	if (reduceMotion) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div
			className={className}
			initial={{ opacity: 0, y }}
			transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
			viewport={{ margin: "-60px", once: true }}
			whileInView={{ opacity: 1, y: 0 }}
		>
			{children}
		</motion.div>
	);
}
