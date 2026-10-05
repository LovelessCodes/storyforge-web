import { createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { MotionConfig } from "motion/react";
import {
	AnimatedOutlet,
	AnimatedOutletWrapper,
} from "@/components/AnimatedOutlet";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageScroll } from "@/components/layout/PageScroll";

const RootLayout = () => (
	<MotionConfig reducedMotion="user">
		<AnimatedOutletWrapper>
			<div className="flex h-svh flex-col overflow-hidden bg-background text-foreground">
				<Header />
				<PageScroll>
					<AnimatedOutlet
						enter={{
							animate: { opacity: 1, y: 0 },
							initial: { opacity: 0, y: 10 },
						}}
						exit={{
							animate: { opacity: 0, y: -10 },
							initial: { opacity: 1, y: 0 },
						}}
						transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
					/>
					<Footer />
				</PageScroll>
			</div>
			<TanStackRouterDevtools />
		</AnimatedOutletWrapper>
	</MotionConfig>
);

export const Route = createRootRoute({ component: RootLayout });
