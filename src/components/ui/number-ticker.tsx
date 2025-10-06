import { useInView, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

interface NumberTickerProps {
	value: number;
	startValue?: number;
	direction?: "up" | "down";
	delay?: number;
	decimalPlaces?: number;
	className?: string;
}

export function NumberTicker({
	value,
	startValue = 0,
	direction = "up",
	delay = 0,
	className,
	decimalPlaces = 0,
	...props
}: NumberTickerProps) {
	const ref = useRef<HTMLSpanElement>(null);
	const motionValue = useMotionValue(direction === "down" ? value : startValue);
	const springValue = useSpring(motionValue, {
		damping: 60,
		stiffness: 100,
	});
	const isInView = useInView(ref, { margin: "0px", once: true });

	useEffect(() => {
		if (isInView) {
			const timer = setTimeout(() => {
				motionValue.set(direction === "down" ? startValue : value);
			}, delay * 1000);
			return () => clearTimeout(timer);
		}
	}, [motionValue, isInView, delay, value, direction, startValue]);

	useEffect(
		() =>
			springValue.on("change", (latest) => {
				if (ref.current) {
					ref.current.textContent = Intl.NumberFormat("en-US", {
						maximumFractionDigits: decimalPlaces,
						minimumFractionDigits: decimalPlaces,
					}).format(Number(latest.toFixed(decimalPlaces)));
				}
			}),
		[springValue, decimalPlaces],
	);

	return (
		<span
			className={cn(
				"inline-block tabular-nums tracking-wider text-black dark:text-white",
				className,
			)}
			ref={ref}
			{...props}
		>
			{startValue}
		</span>
	);
}
