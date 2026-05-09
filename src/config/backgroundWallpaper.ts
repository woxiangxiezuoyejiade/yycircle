import type { BackgroundWallpaperConfig } from "@/types/config";

export const backgroundWallpaper: BackgroundWallpaperConfig = {
	// 壁纸模式："banner" 横幅壁纸 / "overlay" 全屏覆盖 / "none" 纯色背景
	mode: "banner",
	// 是否允许访客通过导航栏切换壁纸模式
	switchable: true,

	/**
	 * 壁纸图片路径
	 *
	 * ─ 三种写法 ─
	 *   1. src 目录(自动优化,推荐):  "assets/images/DesktopWallpaper/d1.avif"   ← 不带开头 /
	 *   2. public 目录(原样输出):    "/assets/images/banner.avif"               ← 带开头 /
	 *   3. 远程 URL:                 "https://t.alcy.cc/pc"
	 *
	 * ─ 推荐路径 ─
	 *   桌面: src/assets/images/DesktopWallpaper/*.avif
	 *   移动: src/assets/images/MobileWallpaper/*.avif
	 *   把图片丢进上述目录,然后把文件名按下面的格式列出来即可。
	 *
	 * ─ 多张随机 ─
	 *   数组形式可一次配置多张,刷新随机展示一张;开启 banner.carousel.enable 后还能轮播。
	 */
	src: {
		desktop: [
			// "assets/images/DesktopWallpaper/d1.avif",
			"assets/images/DesktopWallpaper/1.png",
			"assets/images/DesktopWallpaper/2.png",
			"assets/images/DesktopWallpaper/4.png",
			"assets/images/DesktopWallpaper/8.png",
			"assets/images/DesktopWallpaper/11.png",
			"assets/images/DesktopWallpaper/12.png",
			"assets/images/DesktopWallpaper/13.png",
			"assets/images/DesktopWallpaper/14.png",
		],
		mobile: [
			// "assets/images/MobileWallpaper/m1.avif",
			// "assets/images/MobileWallpaper/m2.avif",
			"assets/images/DesktopWallpaper/1.png",
			"assets/images/DesktopWallpaper/2.png",
			"assets/images/DesktopWallpaper/4.png",
			"assets/images/DesktopWallpaper/8.png",
			"assets/images/DesktopWallpaper/11.png",
			"assets/images/DesktopWallpaper/12.png",
			"assets/images/DesktopWallpaper/13.png",
			"assets/images/DesktopWallpaper/14.png",
		],
	},

	// Banner 横幅模式配置
	banner: {
		// 图片定位,等同于 CSS object-position
		// 常用值: 'center' / 'top' / 'bottom' / 'left' / 'right' / '0% 20%' / '50% 30%'
		position: "center",

		// 首页横幅文字
		homeText: {
			enable: true,
			switchable: true,
			title: "YYCircle空间",
			titleSize: "3.8rem",
			subtitle: [
				"xxxxx",
				
			],
			subtitleSize: "1.5rem",
			typewriter: {
				enable: true,
				speed: 100,
				deleteSpeed: 50,
				pauseTime: 2000,
			},
		},

		// 图片来源标注(右上角小标签);如果用的是自己拍的图可以把 enable 关掉
		credit: {
			enable: {
				desktop: false,
				mobile: false,
			},
			text: {
				desktop: "",
				mobile: "",
			},
			url: {
				desktop: "",
				mobile: "",
			},
		},

		// 横幅模式下的导航栏样式
		navbar: {
			// "semi" 半透明 / "full" 全透明 / "semifull" 滚动时变化
			transparentMode: "semi",
			// 毛玻璃模糊;关闭可省一点性能
			enableBlur: true,
			blur: 5,
		},

		// 多图轮播(仅 src 配多张时生效)
		carousel: {
			enable: false,
			interval: 5000,
			switchable: false,
		},

		// 横幅底部水波纹动画
		waves: {
			enable: {
				desktop: true,
				mobile: false,
			},
			switchable: true,
		},
	},

	// Overlay 全屏覆盖模式配置
	overlay: {
		switchable: {
			opacity: true,
			blur: true,
			cardOpacity: true,
		},
		zIndex: -1,
		opacity: 0.8,
		blur: 10,
		cardOpacity: 0.5,
	},
};
