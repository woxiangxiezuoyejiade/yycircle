import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { moclabSite } from "@/config/moclabSite";
import { LinkPreset, type NavBarLink } from "@/types/config";

export const LinkPresets: { [key in LinkPreset]: NavBarLink } = {
	[LinkPreset.Home]: {
		name: i18n(I18nKey.home),
		url: "/",
		icon: "material-symbols:home",
	},
	[LinkPreset.About]: {
		name: i18n(I18nKey.about),
		url: "/about/",
		icon: "material-symbols:person",
	},
	[LinkPreset.Archive]: {
		name: i18n(I18nKey.archive),
		url: "/archive/",
		icon: "material-symbols:archive",
	},
	[LinkPreset.Friends]: {
		name: "Academic",
		url: moclabSite.academicSite,
		external: true,
		icon: "material-symbols:school-outline-rounded",
	},
	[LinkPreset.Sponsor]: {
		name: i18n(I18nKey.about),
		url: "/about/",
		icon: "material-symbols:info-outline-rounded",
	},
	[LinkPreset.Guestbook]: {
		name: i18n(I18nKey.about),
		url: "/about/",
		icon: "material-symbols:info-outline-rounded",
	},
	[LinkPreset.Bangumi]: {
		name: "Categories",
		url: "/categories/",
		icon: "material-symbols:category-outline-rounded",
	},
	[LinkPreset.Gallery]: {
		name: "Tags",
		url: "/tags/",
		icon: "material-symbols:tag-rounded",
	},
};
