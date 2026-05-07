import type { SponsorConfig } from "../types/config";

export const sponsorConfig: SponsorConfig = {
	title: "赞赏支持",
	description:
		"如果 MocLab 的内容对你有帮助，欢迎通过下面的方式支持这份持续写作与研究记录。",
	usage:
		"赞赏将用于站点维护、实验环境、内容整理和后续项目记录，也非常感谢每一次分享与传播。",
	showSponsorsList: false,
	showComment: false,
	showButtonInPost: true,
	methods: [
		{
			name: "支付宝",
			icon: "fa7-brands:alipay",
			qrCode: "/assets/images/sponsor/alipay.png",
			description: "使用支付宝扫码支持 MocLab",
			enabled: true,
		},
		{
			name: "微信",
			icon: "fa7-brands:weixin",
			qrCode: "/assets/images/sponsor/wechat.png",
			description: "使用微信扫码支持 MocLab",
			enabled: true,
		},
		{
			name: "GitHub Sponsors",
			icon: "fa7-brands:github",
			link: "https://github.com/sponsors",
			description: "也可以通过 GitHub Sponsors 支持开源创作",
			enabled: true,
		},
	],
	sponsors: [],
};
