import type { ProfileConfig } from "../types/config";
import { moclabSite, profileLinks } from "./moclabSite";

export const profileConfig: ProfileConfig = {
	avatar: moclabSite.avatar,
	avatarFallback: moclabSite.avatarFallback,
	name: moclabSite.name,
	subtitle: moclabSite.identity,
	signature: moclabSite.blogTagline,
	bio: moclabSite.blogBio,
	links: profileLinks,
};
