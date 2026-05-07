import type { NavBarLink, ProfileConfig } from "@/types/config";

export const moclabSite = {
	siteName: "MocLab",
	name: "Zhongxu / Moc",
	identity: "Computer Science Graduate Student",
	blogTagline: "妈妈，人生不是旷野",
	description:
		"A personal research and engineering space for AI Agents, AI Security, AIGC Detection, Model Attribution, RAG, Memory Systems, and AI System Evaluation.",
	chineseDescription:
		"MocLab 是 Zhongxu / Moc 的个人技术与学术空间，用于记录 AI Agent、AI 安全、AIGC 检测、模型溯源、系统评测、论文阅读、工程实践和项目复盘。",
	blogBio:
		"I document research notes, engineering experiments, paper reading, and open-source projects around AI Agents, AI Security, AIGC Detection, and System Practice.",
	avatar: "/assets/images/icon3.jpg",
	avatarFallback: "Moc",
	github: "https://github.com/Zhong0118",
	email: "mailto:Zx21372128@163.com",
	academicSite: "https://academic.moclab.top",
} as const;

export const blogNavigation: NavBarLink[] = [
	{ name: "首页", url: "/", icon: "material-symbols:home-outline-rounded" },
	{
		name: "归档",
		url: "/archive/",
		icon: "material-symbols:archive-outline-rounded",
	},
	{
		name: "分类",
		url: "/categories/",
		icon: "material-symbols:category-outline-rounded",
	},
	{ name: "标签", url: "/tags/", icon: "material-symbols:tag-rounded" },
	{
		name: "学术",
		url: moclabSite.academicSite,
		external: true,
		icon: "material-symbols:school-outline-rounded",
	},
	{
		name: "关于",
		url: "/about/",
		icon: "material-symbols:info-outline-rounded",
		children: [
			{
				name: "关于我",
				url: "/about/",
				icon: "material-symbols:person-outline-rounded",
			},
			{
				name: "友链",
				url: "/friends/",
				icon: "material-symbols:groups-2-outline-rounded",
			},
			{
				name: "赞赏",
				url: "/sponsor/",
				icon: "material-symbols:volunteer-activism-outline-rounded",
			},
		],
	},
];

export const profileLinks: ProfileConfig["links"] = [
	{
		name: "GitHub",
		icon: "fa7-brands:github",
		url: moclabSite.github,
		showName: false,
	},
	{
		name: "Email",
		icon: "fa7-solid:envelope",
		url: moclabSite.email,
		showName: false,
	},
	{
		name: "Academic",
		icon: "material-symbols:school-outline-rounded",
		url: moclabSite.academicSite,
		showName: false,
	},
];
