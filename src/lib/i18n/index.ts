import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import de from "./locales/de.json";
import en from "./locales/en.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";

export const languages = [
	{ code: "en", label: "English" },
	{ code: "de", label: "Deutsch" },
	{ code: "es", label: "Español" },
	{ code: "fr", label: "Français" },
] as const;

export type LanguageCode = (typeof languages)[number]["code"];

const STORAGE_KEY = "sf-language";

function detectLanguage(): LanguageCode {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored && languages.some((language) => language.code === stored)) {
			return stored as LanguageCode;
		}
	} catch {
		// Storage unavailable — fall through to the browser preference.
	}
	const preferred = navigator.language.slice(0, 2).toLowerCase();
	const match = languages.find((language) => language.code === preferred);
	return match?.code ?? "en";
}

void i18n
	.use(initReactI18next)
	.init({
		fallbackLng: "en",
		interpolation: {
			escapeValue: false,
		},
		lng: detectLanguage(),
		resources: {
			de: { translation: de },
			en: { translation: en },
			es: { translation: es },
			fr: { translation: fr },
		},
	})
	.then(() => {
		// `init` doesn't emit languageChanged, so set the document language here
		// as well; the listener below covers later switches.
		document.documentElement.lang = i18n.resolvedLanguage ?? i18n.language;
	});

i18n.on("languageChanged", (language) => {
	document.documentElement.lang = language;
	try {
		localStorage.setItem(STORAGE_KEY, language);
	} catch {
		// Storage unavailable — the language just won't persist.
	}
});

export default i18n;
