import type { CommentConfig } from "../types/config";

const walineServerURL = import.meta.env.PUBLIC_WALINE_SERVER_URL?.trim() || "";

export const commentConfig: CommentConfig = {
	type: walineServerURL ? "waline" : "none",

	twikoo: {
		envId: "https://twikoo.vercel.app",
		lang: "zh-CN",
		visitorCount: true,
	},

	waline: {
		serverURL: walineServerURL,
		lang: "zh-CN",
		emoji: [
			"https://unpkg.com/@waline/emojis@1.4.0/weibo",
			"https://unpkg.com/@waline/emojis@1.4.0/bilibili",
			"https://unpkg.com/@waline/emojis@1.4.0/bmoji",
		],
		meta: ["nick", "mail"],
		requiredMeta: ["nick"],
		login: "disable",
		wordLimit: [2, 300],
		pageSize: 10,
		comment: true,
		visitorCount: true,
	},

	artalk: {
		server: "https://artalk.example.com/",
		locale: "zh-CN",
		visitorCount: true,
	},

	giscus: {
		repo: "your-name/moclab",
		repoId: "R_kgD2gfdFGd",
		category: "General",
		categoryId: "DIC_kwDOKy9HOc4CegmW",
		mapping: "title",
		strict: "0",
		reactionsEnabled: "1",
		emitMetadata: "1",
		inputPosition: "top",
		lang: "zh-CN",
		loading: "lazy",
	},

	disqus: {
		shortname: "moclab",
	},
};
