import type { AnnouncementConfig } from "../types/config";
import { moclabSite } from "./moclabSite";

export const announcementConfig: AnnouncementConfig = {
	title: "公告",
	content:
		"欢迎来到 MocLab。这里记录 AI Agent、AI 安全、AIGC 检测、系统实验、论文阅读与工程实践。",
	closable: true,
	link: {
		enable: true,
		text: "了解更多",
		url: moclabSite.academicSite,
		external: true,
	},
};
