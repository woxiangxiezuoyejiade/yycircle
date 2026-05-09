import type { AnnouncementConfig } from "../types/config";
import { moclabSite } from "./moclabSite";

export const announcementConfig: AnnouncementConfig = {
	title: "公告",
	content:
		"欢迎来到 yycircle空间。这里记录山大女生日常生活",
	closable: true,
	link: {
		enable: true,
		text: "了解更多",
		url: moclabSite.academicSite,
		external: true,
	},
};
