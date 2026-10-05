import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import type { TFunction } from "i18next";
import { Check, Globe, Loader2, LogOut, Mail, ShieldCheck, User } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { DiscordIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuthSession } from "@/hooks/use-auth-session";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { authClient } from "@/lib/auth";
import { api } from "@/lib/modpacks";

type Mode = "signin" | "signup";
type FieldName = "email" | "name" | "password";
type FieldErrors = Partial<Record<FieldName, string>>;

interface AuthSearch {
	mode?: Mode;
	redirect?: string;
}

export const Route = createFileRoute("/auth")({
	component: AuthPage,
	validateSearch: (search: Record<string, unknown>): AuthSearch => ({
		mode: search.mode === "signup" ? "signup" : undefined,
		redirect:
			typeof search.redirect === "string" &&
			search.redirect.startsWith("/") &&
			!search.redirect.startsWith("//")
				? search.redirect
				: undefined,
	}),
});

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const providerIcons: Record<string, React.ReactNode> = {
	discord: <DiscordIcon className="size-3.5" />,
};

function validate(mode: Mode, values: Record<FieldName, string>, t: TFunction): FieldErrors {
	const errors: FieldErrors = {};
	if (mode === "signup" && !values.name.trim()) {
		errors.name = t("auth.errors.nameRequired");
	}
	if (!EMAIL_PATTERN.test(values.email)) {
		errors.email = t("auth.errors.invalidEmail");
	}
	if (values.password.length < 8) {
		errors.password = t("auth.errors.passwordMin");
	}
	return errors;
}

function AccountCard() {
	const { t } = useTranslation();
	const { user, signOut } = useAuthSession();
	const navigate = useNavigate();

	if (!user) return null;

	return (
		<div className="grid gap-5">
			<div className="flex items-center gap-3">
				{user.image ? (
					<img
						alt={user.name}
						className="border-border size-12 border object-cover"
						referrerPolicy="no-referrer"
						src={user.image}
					/>
				) : (
					<span className="border-border bg-secondary grid size-12 place-items-center border text-sm font-bold">
						{user.name?.charAt(0)?.toUpperCase() ?? "?"}
					</span>
				)}
				<div className="grid gap-0.5">
					<span className="text-sm font-medium">{user.name}</span>
					<span className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
						<Mail className="size-3" /> {user.email}
					</span>
				</div>
			</div>

			<Separator />

			<div className="text-muted-foreground grid gap-2 text-[11px]">
				<span className="flex items-center gap-2">
					<ShieldCheck className="text-success size-3.5" /> {t("auth.signedInAs")}
				</span>
				<span className="flex items-center gap-2">
					<Check className="text-success size-3.5" /> {t("auth.ownsModpacks")}
				</span>
			</div>

			<div className="flex gap-2">
				<Button variant="accent" render={<Link to="/modpacks" />}>
					{t("account.browse")}
				</Button>
				<Button
					variant="outline"
					onClick={() => {
						void signOut().then(() => navigate({ to: "/" }));
					}}
				>
					<LogOut /> {t("auth.signOut")}
				</Button>
			</div>
		</div>
	);
}

function AuthPage() {
	const { t } = useTranslation();
	const search = Route.useSearch();
	const redirect = search.redirect;
	const mode = search.mode ?? "signin";
	const navigate = useNavigate();
	const reduceMotion = useReducedMotion();
	const { user, isLoading } = useAuthSession();

	const [values, setValues] = useState<Record<FieldName, string>>({
		email: "",
		name: "",
		password: "",
	});
	const [errors, setErrors] = useState<FieldErrors>({});
	const [formError, setFormError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	useDocumentTitle(user ? t("auth.docTitleAccount") : t("auth.docTitleSignIn"));

	const { data: providers } = useQuery({
		enabled: !user,
		queryFn: api.getSocialProviders,
		queryKey: ["social-providers"],
		staleTime: Number.POSITIVE_INFINITY,
	});

	const isSignUp = mode === "signup";
	const target = redirect ?? "/modpacks";

	const setValue = (field: FieldName, value: string) => {
		setValues((prev) => ({ ...prev, [field]: value }));
		setErrors((prev) => ({ ...prev, [field]: undefined }));
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setFormError(null);
		const nextErrors = validate(mode, values, t);
		if (Object.keys(nextErrors).length > 0) {
			setErrors(nextErrors);
			return;
		}
		setSubmitting(true);
		try {
			const result = isSignUp
				? await authClient.signUp.email({
						email: values.email,
						name: values.name,
						password: values.password,
					})
				: await authClient.signIn.email({
						email: values.email,
						password: values.password,
					});

			if (result.error) {
				setFormError(
					result.error.message ??
						(isSignUp ? t("auth.errors.signUpFailed") : t("auth.errors.signInFailed")),
				);
			} else {
				void navigate({ to: target });
			}
		} catch (error) {
			setFormError(error instanceof Error ? error.message : t("auth.errors.unexpected"));
		} finally {
			setSubmitting(false);
		}
	};

	const toggleMode = () => {
		setFormError(null);
		setErrors({});
		void navigate({
			replace: true,
			search: { mode: isSignUp ? undefined : "signup", redirect },
			to: "/auth",
		});
	};

	const socialProviders = (providers ?? []).filter((provider) =>
		[
			"github",
			"discord",
			"google",
			"apple",
			"gitlab",
			"reddit",
			"microsoft",
			"twitch",
			"twitter",
		].includes(provider),
	);

	return (
		<main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-16">
			<div className="pointer-events-none absolute inset-0">
				<div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)] opacity-40" />
				<div className="bg-accent-primary/12 absolute top-1/4 left-1/2 h-[380px] w-[560px] -translate-x-1/2 blur-[130px]" />
			</div>

			<motion.div
				animate={{ opacity: 1, y: 0 }}
				className="border-border bg-card relative w-full max-w-md border shadow-2xl shadow-black/40"
				initial={reduceMotion ? false : { opacity: 0, y: 16 }}
				transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
			>
				<div className="border-border border-b p-6 pb-5">
					<div className="flex items-center gap-2.5">
						<img alt="Story Forge" className="size-8 object-contain" src="/StoryForge.svg" />
						<span className="grid leading-tight">
							<span className="text-xs font-bold tracking-wide">STORY FORGE</span>
							<span className="text-accent-amber text-[9px] font-medium tracking-widest uppercase">
								{t("account.account")}
							</span>
						</span>
					</div>
					<h1 className="mt-5 text-lg font-bold tracking-tight">
						{user
							? t("auth.yourAccount")
							: isSignUp
								? t("auth.createAccount")
								: t("auth.welcomeBack")}
					</h1>
					<p className="text-muted-foreground mt-1 text-[11px]">
						{user
							? t("auth.accountDescription")
							: isSignUp
								? t("auth.signUpDescription")
								: t("auth.signInDescription")}
					</p>
				</div>

				<div className="p-6">
					{isLoading ? (
						<div className="text-muted-foreground flex items-center gap-2 py-8 text-xs">
							<Loader2 className="size-4 animate-spin" /> {t("auth.checkingSession")}
						</div>
					) : user ? (
						<AccountCard />
					) : (
						<>
							{socialProviders.length > 0 && (
								<>
									<div className="grid gap-2">
										{socialProviders.map((provider) => (
											<Button
												key={provider}
												variant="outline"
												onClick={() => {
													void authClient.signIn.social({
														callbackURL: `${window.location.origin}/#${target}`,
														provider,
													});
												}}
											>
												{providerIcons[provider] ?? <Globe className="size-3.5" />}
												<span className="capitalize">{t("auth.continueWith", { provider })}</span>
											</Button>
										))}
									</div>
									<div className="my-4 flex items-center gap-3">
										<Separator className="flex-1" />
										<span className="text-muted-foreground text-[10px] tracking-widest uppercase">
											{t("auth.or")}
										</span>
										<Separator className="flex-1" />
									</div>
								</>
							)}

							<form className="grid gap-4" onSubmit={(event) => void handleSubmit(event)}>
								{isSignUp && (
									<div className="grid gap-1.5">
										<label className="text-[11px] font-medium" htmlFor="name">
											{t("auth.name")}
										</label>
										<Input
											autoComplete="name"
											id="name"
											placeholder={t("auth.namePlaceholder")}
											value={values.name}
											onChange={(event) => setValue("name", event.target.value)}
										/>
										{errors.name && <p className="text-destructive text-[10px]">{errors.name}</p>}
									</div>
								)}

								<div className="grid gap-1.5">
									<label className="text-[11px] font-medium" htmlFor="email">
										{t("auth.email")}
									</label>
									<Input
										autoComplete="email"
										id="email"
										placeholder="you@example.com"
										type="email"
										value={values.email}
										onChange={(event) => setValue("email", event.target.value)}
									/>
									{errors.email && <p className="text-destructive text-[10px]">{errors.email}</p>}
								</div>

								<div className="grid gap-1.5">
									<label className="text-[11px] font-medium" htmlFor="password">
										{t("auth.password")}
									</label>
									<Input
										autoComplete={isSignUp ? "new-password" : "current-password"}
										id="password"
										placeholder={
											isSignUp ? t("auth.passwordNewPlaceholder") : t("auth.passwordPlaceholder")
										}
										type="password"
										value={values.password}
										onChange={(event) => setValue("password", event.target.value)}
									/>
									{errors.password && (
										<p className="text-destructive text-[10px]">{errors.password}</p>
									)}
								</div>

								{formError && (
									<p className="border-destructive/30 bg-destructive/10 text-destructive border px-3 py-2 text-[11px]">
										{formError}
									</p>
								)}

								<Button
									className="w-full"
									size="lg"
									type="submit"
									variant="accent"
									disabled={submitting}
								>
									{submitting ? <Loader2 className="animate-spin" /> : <User />}
									{submitting
										? t("auth.submitting")
										: isSignUp
											? t("auth.submitSignUp")
											: t("auth.submitSignIn")}
								</Button>
							</form>

							<Separator className="my-4" />

							<p className="text-muted-foreground text-center text-[11px]">
								{isSignUp ? t("auth.hasAccount") : t("auth.noAccount")}{" "}
								<button
									className="text-accent-primary hover:underline"
									onClick={toggleMode}
									type="button"
								>
									{isSignUp ? t("auth.submitSignIn") : t("auth.createOne")}
								</button>
							</p>
						</>
					)}
				</div>
			</motion.div>
		</main>
	);
}
