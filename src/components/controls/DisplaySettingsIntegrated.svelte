<script lang="ts">
import {
	DARK_MODE,
	LIGHT_MODE,
	SYSTEM_MODE,
	WALLPAPER_BANNER,
	WALLPAPER_NONE,
	WALLPAPER_OVERLAY,
} from "@constants/constants";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { onMount } from "svelte";
import Icon from "@/components/common/Icon.svelte";
import { backgroundWallpaper, siteConfig } from "@/config";
import type { LIGHT_DARK_MODE, WALLPAPER_MODE } from "@/types/config";
import {
	getDefaultHue,
	getHue,
	getStoredBannerTitleEnabled,
	getStoredTheme,
	getStoredWallpaperMode,
	getStoredWavesEnabled,
	setBannerTitleEnabled,
	setHue,
	setTheme,
	setWallpaperMode,
	setWavesEnabled,
} from "@/utils/setting-utils";

let currentLayout: "list" | "grid" = $state(siteConfig.postListLayout.defaultMode);
let themeMode: LIGHT_DARK_MODE = $state(
	siteConfig.themeColor.defaultMode ?? SYSTEM_MODE,
);
let hue = $state(getDefaultHue());
let wallpaperMode: WALLPAPER_MODE = $state(backgroundWallpaper.mode);
let bannerTitleEnabled = $state(
	backgroundWallpaper.banner?.homeText?.enable ?? true,
);
let wavesEnabled = $state(false);

const defaultLayout = siteConfig.postListLayout.defaultMode;
const mobileDefaultLayout =
	siteConfig.postListLayout.mobileDefaultMode || defaultLayout;
const defaultHue = getDefaultHue();
const allowLayoutSwitch = siteConfig.postListLayout.allowSwitch;
const allowHueControl = !siteConfig.themeColor.fixed;
const allowWallpaperSwitch = backgroundWallpaper.switchable ?? true;
const allowBannerTitleSwitch =
	backgroundWallpaper.banner?.homeText?.switchable ?? false;
const allowWavesSwitch = backgroundWallpaper.banner?.waves?.switchable ?? false;

let mounted = $state(false);
let isSwitching = $state(false);
let isMobileWidth = $state(
	typeof window !== "undefined" ? window.innerWidth < 780 : false,
);
let effectiveDefaultLayout = $derived(
	isMobileWidth ? mobileDefaultLayout : defaultLayout,
);

function dispatchLayoutChange(layout: "list" | "grid") {
	window.dispatchEvent(
		new CustomEvent("layoutChange", {
			detail: { layout },
		}),
	);
}

function checkScreenSize() {
	isMobileWidth = window.innerWidth < 780;
	if (window.innerWidth < 380 && currentLayout === "list") {
		currentLayout = "grid";
		localStorage.setItem("postListLayout", "grid");
		dispatchLayoutChange("grid");
	}
}

function resetLayout() {
	currentLayout = effectiveDefaultLayout;
	localStorage.removeItem("postListLayout");
	dispatchLayoutChange(effectiveDefaultLayout);
}

function switchToLayout(layout: "list" | "grid") {
	if (!mounted || isSwitching || currentLayout === layout) return;

	isSwitching = true;
	currentLayout = layout;
	localStorage.setItem("postListLayout", layout);
	dispatchLayoutChange(layout);

	setTimeout(() => {
		isSwitching = false;
	}, 250);
}

function switchTheme(mode: LIGHT_DARK_MODE) {
	themeMode = mode;
	setTheme(mode);
}

function updateHue(value: number) {
	hue = value;
	setHue(value);
}

function resetHue() {
	updateHue(defaultHue);
}

function switchWallpaper(mode: WALLPAPER_MODE) {
	wallpaperMode = mode;
	setWallpaperMode(mode);
}

function toggleBannerTitle() {
	bannerTitleEnabled = !bannerTitleEnabled;
	setBannerTitleEnabled(bannerTitleEnabled);
}

function toggleWaves() {
	wavesEnabled = !wavesEnabled;
	setWavesEnabled(wavesEnabled);
}

onMount(() => {
	mounted = true;
	checkScreenSize();

	themeMode = getStoredTheme();
	hue = getHue();
	wallpaperMode = getStoredWallpaperMode();
	bannerTitleEnabled = getStoredBannerTitleEnabled();
	wavesEnabled = getStoredWavesEnabled();

	const savedLayout = localStorage.getItem("postListLayout");
	if (savedLayout === "list" || savedLayout === "grid") {
		currentLayout = savedLayout;
	} else {
		currentLayout =
			window.innerWidth < 780 ? mobileDefaultLayout : defaultLayout;
	}

	window.addEventListener("resize", checkScreenSize);
	return () => {
		window.removeEventListener("resize", checkScreenSize);
	};
});

onMount(() => {
	const handleLayoutChange = (event: Event) => {
		const customEvent = event as CustomEvent<{ layout: "list" | "grid" }>;
		currentLayout = customEvent.detail.layout;
	};

	const handleThemeChange = () => {
		themeMode = getStoredTheme();
	};

	const handleWallpaperChange = (event: Event) => {
		const customEvent = event as CustomEvent<{ mode: WALLPAPER_MODE }>;
		wallpaperMode = customEvent.detail.mode;
	};

	window.addEventListener("layoutChange", handleLayoutChange);
	window.addEventListener("theme-change", handleThemeChange);
	window.addEventListener("wallpaperModeChange", handleWallpaperChange);

	return () => {
		window.removeEventListener("layoutChange", handleLayoutChange);
		window.removeEventListener("theme-change", handleThemeChange);
		window.removeEventListener("wallpaperModeChange", handleWallpaperChange);
	};
});
</script>

<div
	id="display-setting"
	class="float-panel float-panel-closed absolute right-4 w-72 px-3.5 py-3.5 transition-all"
>
	{#if allowHueControl}
		<section class="mb-4">
			<div class="mb-2.5 flex items-center justify-between">
				<div
					class="relative ml-3 flex gap-2 text-base font-bold text-neutral-900 transition dark:text-neutral-100 before:absolute before:-left-3 before:top-1/2 before:h-3.5 before:w-1 before:-translate-y-1/2 before:rounded-md before:bg-(--primary)"
				>
					{i18n(I18nKey.themeColor)}
					<button
						aria-label="Reset Hue"
						class="btn-regular ml-0.5 h-6 w-6 rounded-md active:scale-90"
						class:opacity-0={hue === defaultHue}
						class:pointer-events-none={hue === defaultHue}
						onclick={resetHue}
					>
						<Icon icon="fa7-solid:arrow-rotate-left" class="text-[0.75rem]" />
					</button>
				</div>
				<div class="btn-regular flex h-7 min-w-10 items-center justify-center rounded-md px-2 text-xs font-bold">
					{hue}
				</div>
			</div>
			<div class="rounded-lg bg-black/4 px-1.5 py-2 dark:bg-white/6">
				<input
					aria-label={i18n(I18nKey.themeColor)}
					type="range"
					min="0"
					max="360"
					step="5"
					value={hue}
					class="color-slider w-full"
					oninput={(event) =>
						updateHue(Number((event.currentTarget as HTMLInputElement).value))}
				/>
			</div>
		</section>
	{/if}

	{#if allowWallpaperSwitch}
		<section class="mb-4">
			<div
				class="relative mb-2.5 ml-3 flex gap-2 text-base font-bold text-neutral-900 transition dark:text-neutral-100 before:absolute before:-left-3 before:top-1/2 before:h-3.5 before:w-1 before:-translate-y-1/2 before:rounded-md before:bg-(--primary)"
			>
				{i18n(I18nKey.wallpaperMode)}
			</div>
			<div class="space-y-1.5">
				<button
					class="settings-option"
					class:is-active={wallpaperMode === WALLPAPER_BANNER}
					onclick={() => switchWallpaper(WALLPAPER_BANNER)}
				>
					<div class="flex items-center gap-3">
						<Icon icon="material-symbols:image-outline-rounded" class="text-[1.2rem]" />
						<span>{i18n(I18nKey.wallpaperBannerMode)}</span>
					</div>
					{#if wallpaperMode === WALLPAPER_BANNER}
						<Icon icon="material-symbols:check-circle" class="text-[1.15rem] text-(--primary)" />
					{/if}
				</button>
				<button
					class="settings-option"
					class:is-active={wallpaperMode === WALLPAPER_OVERLAY}
					onclick={() => switchWallpaper(WALLPAPER_OVERLAY)}
				>
					<div class="flex items-center gap-3">
						<Icon icon="material-symbols:wallpaper" class="text-[1.2rem]" />
						<span>{i18n(I18nKey.wallpaperOverlayMode)}</span>
					</div>
					{#if wallpaperMode === WALLPAPER_OVERLAY}
						<Icon icon="material-symbols:check-circle" class="text-[1.15rem] text-(--primary)" />
					{/if}
				</button>
				<button
					class="settings-option"
					class:is-active={wallpaperMode === WALLPAPER_NONE}
					onclick={() => switchWallpaper(WALLPAPER_NONE)}
				>
					<div class="flex items-center gap-3">
						<Icon icon="material-symbols:hide-image-outline-rounded" class="text-[1.2rem]" />
						<span>{i18n(I18nKey.wallpaperNoneMode)}</span>
					</div>
					{#if wallpaperMode === WALLPAPER_NONE}
						<Icon icon="material-symbols:check-circle" class="text-[1.15rem] text-(--primary)" />
					{/if}
				</button>
			</div>
		</section>
	{/if}

	{#if allowBannerTitleSwitch || allowWavesSwitch}
		<section class="mb-4">
			<div class="mb-2.5 flex items-center justify-between">
				<div
					class="relative ml-3 flex gap-2 text-base font-bold text-neutral-900 transition dark:text-neutral-100 before:absolute before:-left-3 before:top-1/2 before:h-3.5 before:w-1 before:-translate-y-1/2 before:rounded-md before:bg-(--primary)"
				>
					{i18n(I18nKey.bannerSettings)}
				</div>
			</div>
			<div class="space-y-1.5">
				{#if allowBannerTitleSwitch}
					<button class="settings-toggle" onclick={toggleBannerTitle}>
						<div class="flex items-center gap-3">
							<Icon icon="material-symbols:title-rounded" class="text-[1.2rem]" />
							<span>{i18n(I18nKey.bannerTitle)}</span>
						</div>
						<span class="toggle-pill" class:is-on={bannerTitleEnabled}>
							<span class="toggle-thumb"></span>
						</span>
					</button>
				{/if}
				{#if allowWavesSwitch}
					<button class="settings-toggle" onclick={toggleWaves}>
						<div class="flex items-center gap-3">
							<Icon icon="material-symbols:water-rounded" class="text-[1.2rem]" />
							<span>{i18n(I18nKey.wavesAnimation)}</span>
						</div>
						<span class="toggle-pill" class:is-on={wavesEnabled}>
							<span class="toggle-thumb"></span>
						</span>
					</button>
				{/if}
			</div>
		</section>
	{/if}



	{#if allowLayoutSwitch}
		<section>
			<div class="mb-2.5 flex items-center justify-between border-t border-(--line-divider) pt-3.5">
				<div
					class="relative ml-3 flex gap-2 text-base font-bold text-neutral-900 transition dark:text-neutral-100 before:absolute before:-left-3 before:top-1/2 before:h-3.5 before:w-1 before:-translate-y-1/2 before:rounded-md before:bg-(--primary)"
				>
					{i18n(I18nKey.postListLayout)}
				</div>
				<button
					aria-label="Reset Layout"
					class="btn-regular h-6 w-6 rounded-md active:scale-90"
					class:opacity-0={currentLayout === effectiveDefaultLayout}
					class:pointer-events-none={currentLayout === effectiveDefaultLayout}
					onclick={resetLayout}
				>
					<Icon icon="fa7-solid:arrow-rotate-left" class="text-[0.75rem]" />
				</button>
			</div>
			<div class="grid grid-cols-2 gap-1.5">
				<button
					aria-label={i18n(I18nKey.postListLayoutList)}
					class="settings-option justify-center"
					class:is-active={currentLayout === "list"}
					disabled={isSwitching}
					onclick={() => switchToLayout("list")}
				>
					<div class="flex items-center gap-2">
						<Icon icon="material-symbols:view-list-outline-rounded" class="text-[1.1rem]" />
						<span>{i18n(I18nKey.postListLayoutList)}</span>
					</div>
					{#if currentLayout === "list"}
						<Icon icon="material-symbols:check-circle" class="text-[1.15rem] text-(--primary)" />
					{/if}
				</button>
				<button
					aria-label={i18n(I18nKey.postListLayoutGrid)}
					class="settings-option justify-center"
					class:is-active={currentLayout === "grid"}
					disabled={isSwitching}
					onclick={() => switchToLayout("grid")}
				>
					<div class="flex items-center gap-2">
						<Icon icon="material-symbols:grid-view-outline-rounded" class="text-[1.1rem]" />
						<span>{i18n(I18nKey.postListLayoutGrid)}</span>
					</div>
					{#if currentLayout === "grid"}
						<Icon icon="material-symbols:check-circle" class="text-[1.15rem] text-(--primary)" />
					{/if}
				</button>
			</div>
		</section>
	{/if}
</div>

<style lang="stylus">
	#display-setting
		.color-slider
			-webkit-appearance none
			appearance none
			background-color transparent
			height 0.4rem
			border-radius 999px

		.color-slider::-webkit-slider-runnable-track
			height 0.4rem
			border-radius 999px
			background-image var(--color-selection-bar)
			box-shadow inset 0 0 0 1px rgba(255, 255, 255, 0.18)

		.color-slider::-moz-range-track
			height 0.4rem
			border-radius 999px
			background-image var(--color-selection-bar)
			box-shadow inset 0 0 0 1px rgba(255, 255, 255, 0.18)

		.color-slider::-webkit-slider-thumb
			-webkit-appearance none
			margin-top -0.28rem
			height 0.95rem
			width 0.95rem
			border-radius 999px
			border 2px solid rgba(255, 255, 255, 0.9)
			background rgba(255, 255, 255, 0.96)
			box-shadow 0 2px 10px rgba(0, 0, 0, 0.14)

		.color-slider::-moz-range-thumb
			height 0.95rem
			width 0.95rem
			border-radius 999px
			border 2px solid rgba(255, 255, 255, 0.9)
			background rgba(255, 255, 255, 0.96)
			box-shadow 0 2px 10px rgba(0, 0, 0, 0.14)

		.settings-option
			display flex
			align-items center
			justify-content space-between
			width 100%
			padding 0.72rem 0.85rem
			border-radius 0.8rem
			background var(--btn-regular-bg)
			color var(--btn-content)
			transition all 0.2s ease
			font-size 0.92rem

		.settings-option:hover
			background var(--btn-regular-bg-hover)

		.settings-option.is-active
			background var(--btn-regular-bg-hover)
			outline 1px solid rgba(128, 128, 255, 0.28)

		.settings-toggle
			display flex
			align-items center
			justify-content space-between
			width 100%
			padding 0.72rem 0.85rem
			border-radius 0.8rem
			background var(--btn-regular-bg)
			color var(--btn-content)
			transition all 0.2s ease
			font-size 0.92rem

		.settings-toggle:hover
			background var(--btn-regular-bg-hover)

		.toggle-pill
			position relative
			display inline-flex
			align-items center
			width 2.7rem
			height 1.55rem
			padding 0 0.2rem
			border-radius 999px
			background rgba(120, 120, 160, 0.28)
			transition all 0.2s ease

		.toggle-pill.is-on
			background rgba(128, 128, 255, 0.72)

		.toggle-thumb
			display block
			width 1.12rem
			height 1.12rem
			border-radius 999px
			background white
			box-shadow 0 2px 6px rgba(0, 0, 0, 0.12)
			transition transform 0.2s ease

		.toggle-pill.is-on .toggle-thumb
			transform translateX(1rem)
</style>
