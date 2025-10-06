import ReactDOM from "react-dom/client";
import "./tailwind.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createHashHistory,
	createRouter,
	RouterProvider,
} from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const queryClient = new QueryClient();

// Create a new router instance
const router = createRouter({
	context: { queryClient },
	defaultPreload: "intent",
	defaultStaleTime: 5000,
	defaultViewTransition: {
		types: ({ fromLocation, toLocation }) => {
			let direction = "none";

			if (fromLocation) {
				const fromIndex = fromLocation.state.__TSR_index;
				const toIndex = toLocation.state.__TSR_index;

				direction = fromIndex > toIndex ? "right" : "left";
			}

			return [`slide-${direction}`];
		},
	},
	history: createHashHistory(),
	routeTree,
	scrollRestoration: true,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// Render the app
const rootElement = document.getElementById("app");
if (!rootElement) throw new Error("No root element found");
ReactDOM.createRoot(rootElement).render(
	<QueryClientProvider client={queryClient}>
		<RouterProvider router={router} />
	</QueryClientProvider>,
);
