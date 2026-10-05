import { Link, useNavigate } from "@tanstack/react-router";
import { Github, LogOut, Package, User } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DiscordIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthSession } from "@/hooks/use-auth-session";

function initials(name: string | undefined) {
	if (!name) return "?";
	return name
		.split(/\s+/)
		.map((part) => part.charAt(0))
		.slice(0, 2)
		.join("")
		.toUpperCase();
}

export function AccountMenu() {
	const { t } = useTranslation();
	const { user, signOut } = useAuthSession();
	const navigate = useNavigate();

	if (!user) return null;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						aria-label={t("account.menu")}
						className="border-border"
						size="icon-sm"
						variant="outline"
					/>
				}
				title={user.name}
			>
				{user.image ? (
					<img
						alt={user.name}
						className="size-full object-cover"
						referrerPolicy="no-referrer"
						src={user.image}
					/>
				) : (
					<span className="bg-accent-primary grid size-full place-items-center text-[10px] font-bold text-white">
						{initials(user.name)}
					</span>
				)}
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="min-w-56">
				<DropdownMenuGroup>
					<DropdownMenuLabel className="normal-case">
						<span className="grid gap-0.5">
							<span className="text-foreground text-xs font-medium tracking-normal">
								{user.name}
							</span>
							<span className="text-muted-foreground text-[10px] font-normal tracking-normal">
								{user.email}
							</span>
						</span>
					</DropdownMenuLabel>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => {
						void navigate({ to: "/modpacks" });
					}}
				>
					<Package /> {t("account.browse")}
				</DropdownMenuItem>
				<DropdownMenuItem render={<Link to="/auth" />}>
					<User /> {t("account.account")}
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => {
						void signOut().then(() => navigate({ to: "/" }));
					}}
					variant="destructive"
				>
					<LogOut /> {t("account.signOut")}
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<div className="flex items-center gap-1 px-2 py-1.5">
					<a
						aria-label="GitHub"
						className="text-muted-foreground hover:text-foreground"
						href="https://github.com/lovelesscodes/storyforge"
						rel="noopener noreferrer"
						target="_blank"
					>
						<Github className="size-3.5" />
					</a>
					<a
						aria-label="Discord"
						className="text-muted-foreground hover:text-foreground"
						href="https://discord.gg/gByx63peUC"
						rel="noopener noreferrer"
						target="_blank"
					>
						<DiscordIcon className="size-3.5" />
					</a>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
