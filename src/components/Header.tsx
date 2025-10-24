import { Link } from "@tanstack/react-router";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
	Popover,
	PopoverPopup,
	PopoverPositioner,
	PopoverTrigger,
} from "@/components/ui/popover";

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
	{ label: "Home", to: "/" },
	{ label: "FAQ", to: "/faq" },
	{ label: "Guides", to: "/guide" },
	{ label: "Map Viewer", to: "/map" },
];

export function Header() {
	return (
		<header className="border-b px-4 md:px-36">
			<div className="flex h-fit py-2 md:py-0 md:h-16 justify-between gap-4">
				{/* Left side */}
				<div className="flex gap-2">
					<div className="flex items-center md:hidden">
						{/* Mobile menu trigger */}
						<Popover>
							<PopoverTrigger
								render={(props) => (
									<Button
										className="group size-8 text-white"
										size="icon"
										variant="ghost"
										{...props}
									>
										<svg
											className="pointer-events-none"
											fill="none"
											height={16}
											stroke="currentColor"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											viewBox="0 0 24 24"
											width={16}
											xmlns="http://www.w3.org/2000/svg"
										>
											<title>Menu</title>
											<path
												className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
												d="M4 12L20 12"
											/>
											<path
												className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
												d="M4 12H20"
											/>
											<path
												className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
												d="M4 12H20"
											/>
										</svg>
									</Button>
								)}
							/>
							<PopoverPositioner align="start" className="w-36 p-1 md:hidden">
								<PopoverPopup>
									<NavigationMenu className="max-w-none *:w-full">
										<NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
											{navigationLinks.map((link) => (
												<NavigationMenuItem className="w-full" key={link.label}>
													<NavigationMenuLink
														render={() => (
															<Link
																activeProps={{
																	className:
																		"focus:bg-accent rounded-none hover:bg-accent bg-accent/50 text-accent-foreground",
																}}
																className="hover:bg-accent rounded-none hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 p-2 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4 py-1.5"
																to={link.to}
															>
																{link.label}
															</Link>
														)}
													/>
												</NavigationMenuItem>
											))}
										</NavigationMenuList>
									</NavigationMenu>
								</PopoverPopup>
							</PopoverPositioner>
						</Popover>
					</div>
					{/* Main nav */}
					<div className="flex items-center gap-6">
						<Link to="/">
							<div className="flex items-center space-x-2">
								<img
									alt="Story Forge Logo"
									className="w-8 h-8"
									src="/StoryForge.png"
								/>
								<span className="text-xl text-foreground font-bold">
									Story Forge
								</span>
							</div>
						</Link>
						{/* Navigation menu */}
						<NavigationMenu className="h-full *:h-full max-md:hidden">
							<NavigationMenuList className="h-full gap-2">
								{navigationLinks.map((link) => (
									<NavigationMenuItem className="h-full" key={link.label}>
										<NavigationMenuLink
											render={() => (
												<Link
													activeProps={{
														className:
															"focus:bg-accent hover:bg-accent bg-accent/50 text-accent-foreground border-b-primary bg-transparent!",
													}}
													className="hover:bg-accent rounded-none hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 p-2 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4 text-muted-foreground hover:text-primary hover:border-b-primary h-full justify-center rounded-none border-y-2 border-transparent py-1.5 font-medium hover:bg-transparent"
													to={link.to}
												>
													{link.label}
												</Link>
											)}
										/>
									</NavigationMenuItem>
								))}
							</NavigationMenuList>
						</NavigationMenu>
					</div>
				</div>
				{/* Right side */}
				<div className="flex items-center gap-2 md:flex-row flex-col">
					<a
						href="https://github.com/lovelesscodes/storyforge"
						rel="noopener noreferrer"
						target="_blank"
					>
						<Button size="sm" variant="outline">
							<Github className="w-4 h-4 mr-2" />
							View Source
						</Button>
					</a>
					<a
						href="https://discord.gg/gByx63peUC"
						rel="noopener noreferrer"
						target="_blank"
					>
						<Button size="sm" variant="outline">
							<svg
								className="w-4 h-4 mr-2"
								role="img"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<title>Discord</title>
								<path
									d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"
									fill="currentColor"
								/>
							</svg>
							Connect on Discord
						</Button>
					</a>
				</div>
			</div>
		</header>
	);
}
