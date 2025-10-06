import { createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import {
	AnimatedOutlet,
	AnimatedOutletWrapper,
} from "@/components/AnimatedOutlet";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const RootLayout = () => (
	<AnimatedOutletWrapper>
		<div className="min-h-screen bg-background dark">
			<Header />
			<AnimatedOutlet
				enter={{
					animate: { opacity: 1, x: 0 },
					initial: { opacity: 0, x: 20 },
				}}
				exit={{
					animate: { opacity: 0, x: -20 },
					initial: { opacity: 1, x: 0 },
				}}
				transition={{ duration: 0.3 }}
			/>
			<Footer />
		</div>
		<TanStackRouterDevtools />
	</AnimatedOutletWrapper>
);

export const Route = createRootRoute({ component: RootLayout });
