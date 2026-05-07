import type { FriendLink, FriendsPageConfig } from "@/types/config";

export const friendsPageConfig: FriendsPageConfig = {
	title: "友链",
	description: "研究、工程和写作方向相近的站点收集。",
	showCustomContent: false,
	showComment: false,
	randomizeSort: false,
};

export const friendLinks: FriendLink[] = [
	{
		title: "OpenAI",
		imgurl: "/favicon/Mm.png",
		desc: "AI systems, models, safety, and developer tooling.",
		siteurl: "https://openai.com/",
		tags: ["AI", "Research"],
		weight: 10,
		enabled: true,
	},
	{
		title: "Astro",
		imgurl: "/favicon/Mm.png",
		desc: "The web framework powering this site.",
		siteurl: "https://astro.build/",
		tags: ["Web", "Framework"],
		weight: 9,
		enabled: true,
	},
	{
		title: "Vercel",
		imgurl: "/favicon/Mm.png",
		desc: "Deployment platform for fast iteration and previews.",
		siteurl: "https://vercel.com/",
		tags: ["Deploy", "Platform"],
		weight: 8,
		enabled: true,
	},
];
