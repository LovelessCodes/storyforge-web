import type { ComponentType } from "react";

import { InstallGuide } from "./install";
import { MigrateGuide } from "./migrate";
import { ModConfigsGuide } from "./mod-configs";
import { ModpacksGuide } from "./modpacks";
import { ModsGuide } from "./mods";
import { OtherLaunchersGuide } from "./other-launchers";
import { ProfilesGuide } from "./profiles";
import { ServerHostingGuide } from "./server-hosting";
import { WorldMapsGuide } from "./world-maps";

/** Guide slug → page content. Keys must match entries in `@/lib/guides`. */
export const guideContent: Record<string, ComponentType> = {
	install: InstallGuide,
	migrate: MigrateGuide,
	"mod-configs": ModConfigsGuide,
	modpacks: ModpacksGuide,
	mods: ModsGuide,
	"other-launchers": OtherLaunchersGuide,
	profiles: ProfilesGuide,
	"server-hosting": ServerHostingGuide,
	"world-maps": WorldMapsGuide,
};
