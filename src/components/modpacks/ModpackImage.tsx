import { Package } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface ModpackImageProps {
	src?: string | null;
	alt: string;
	className?: string;
	iconClassName?: string;
}

/** Cover image with a placeholder fallback when the modpack has none (or it fails to load). */
export function ModpackImage({
	src,
	alt,
	className,
	iconClassName,
}: ModpackImageProps) {
	const [failed, setFailed] = useState(false);

	if (!src || failed) {
		return (
			<div
				className={cn("flex items-center justify-center bg-muted", className)}
			>
				<Package
					className={cn("size-6 text-muted-foreground", iconClassName)}
				/>
			</div>
		);
	}

	return (
		<img
			alt={alt}
			className={cn("bg-muted object-cover", className)}
			loading="lazy"
			onError={() => setFailed(true)}
			src={src}
		/>
	);
}
