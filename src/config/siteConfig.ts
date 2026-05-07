import type { SiteConfig } from "@/types/config";
import { fontConfig } from "./fontConfig";
import { moclabSite } from "./moclabSite";

const SITE_LANG = "zh_CN";
const umamiWebsiteId = import.meta.env.PUBLIC_UMAMI_WEBSITE_ID?.trim() || "";
const umamiScriptUrl =
	import.meta.env.PUBLIC_UMAMI_SCRIPT_URL?.trim() ||
	"https://cloud.umami.is/script.js";
const siteStatsApiUrl =
	import.meta.env.PUBLIC_SITE_STATS_API_URL?.trim() || "/api/site-stats";
const homeEntryEventName =
	import.meta.env.PUBLIC_UMAMI_HOME_ENTRY_EVENT?.trim() || "home-entry";

export const siteConfig: SiteConfig = {
	title: moclabSite.siteName,
	subtitle: moclabSite.blogTagline,
	site_url: "https://www.moclab.top",
	description: moclabSite.description,
	keywords: [
		"MocLab",
		"AI Agents",
		"AI Security",
		"AIGC Detection",
		"Model Attribution",
		"RAG",
		"Memory Systems",
		"Systems",
	],
	themeColor: {
		hue: 250,
		fixed: false,
		defaultMode: "system",
	},
	pageWidth: 100,
	card: {
		border: true,
		followTheme: false,
	},
	favicon: [
		{
			src: "/favicon/Mm.png",
		},
	],
	navbar: {
		logo: {
			type: "image",
			value: "/favicon/Mm.png",
			alt: moclabSite.siteName,
		},
		title: moclabSite.siteName,
		widthFull: false,
		menuAlign: "center",
		followTheme: false,
		stickyNavbar: true,
	},
	siteStartDate: "2026-05-01",
	timezone: "Asia/Shanghai",
	rehypeCallouts: {
		theme: "github",
	},
	showLastModified: true,
	outdatedThreshold: 30,
	sharePoster: true,
	generateOgImages: false,
	bangumi: {
		userId: "",
		categoryOrder: ["anime", "book", "music", "game"],
	},
	pages: {
		friends: true,
		sponsor: true,
		guestbook: false,
		bangumi: false,
		gallery: false,
	},
	categoryBar: true,
	postListLayout: {
		defaultMode: "list",
		mobileDefaultMode: "list",
		showTags: true,
		descriptionLines: 2,
		allowSwitch: true,
		grid: {
			masonry: true,
			columnWidth: 320,
		},
	},
	pagination: {
		postsPerPage: 10,
	},
	analytics: {
		googleAnalyticsId: "",
		microsoftClarityId: "",
		umamiAnalytics: {
			websiteId: umamiWebsiteId,
			scriptUrl: umamiScriptUrl,
			trackOutboundLinks: true,
			collectWebVitals: false,
			statsApiUrl: siteStatsApiUrl,
			homeEntryEventName: homeEntryEventName,
			relpays: {
				enabled: false,
				sampleRate: 0.15,
				maskLevel: "moderate",
				maxDuration: 300000,
				blockSelector: "",
			},
		},
		la51Analytics: {
			Id: "",
			sdkUrl: "",
			ck: "",
			autoTrack: false,
			hashMode: false,
			screenRecord: false,
		},
	},
	imageOptimization: {
		formats: "webp",
		quality: 85,
		noReferrerDomains: [],
	},
	font: fontConfig,
	lang: SITE_LANG,
};
