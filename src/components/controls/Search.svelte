<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { navigateToPage } from "@utils/navigation-utils";
import { onMount } from "svelte";
import Icon from "@/components/common/Icon.svelte";
import { getSearchUrl, url as formatUrl } from "@/utils/url-utils";

type SearchPostMeta = {
	id: string;
	title: string;
	description?: string;
	category?: string;
	password?: boolean;
};

type SimpleSearchResult = {
	url: string;
	title: string;
	excerpt: string;
};

let keywordDesktop = "";
let keywordMobile = "";
let result: SimpleSearchResult[] = [];
let isSearching = false;
let initialized = false;
let posts: SearchPostMeta[] = [];
let debounceTimer: ReturnType<typeof setTimeout> | undefined;

const searchDataUrl = formatUrl("/api/allPostMeta.json");

const escapeRegExp = (value: string): string =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const highlightText = (text: string, keyword: string): string => {
	if (!keyword.trim()) return text;
	const pattern = new RegExp(`(${escapeRegExp(keyword.trim())})`, "gi");
	return text.replace(pattern, "<mark>$1</mark>");
};

const togglePanel = () => {
	document
		.getElementById("search-panel")
		?.classList.toggle("float-panel-closed");
};

const setPanelVisibility = (show: boolean, isDesktop: boolean): void => {
	const panel = document.getElementById("search-panel");
	if (
		!panel ||
		(isDesktop && !keywordDesktop.trim()) ||
		(!isDesktop && !keywordMobile.trim())
	) {
		return;
	}
	show
		? panel.classList.remove("float-panel-closed")
		: panel.classList.add("float-panel-closed");
};

const closeSearchPanel = (): void => {
	document.getElementById("search-panel")?.classList.add("float-panel-closed");
	keywordDesktop = "";
	keywordMobile = "";
	result = [];
};

const handleResultClick = (event: Event, url: string): void => {
	event.preventDefault();
	closeSearchPanel();
	navigateToPage(url);
};

const buildResults = (keyword: string): SimpleSearchResult[] => {
	const normalizedKeyword = keyword.trim().toLowerCase();
	if (!normalizedKeyword) return [];

	return posts
		.filter((post) => !post.password)
		.map((post) => {
			const title = post.title || "";
			const titleMatched = title.toLowerCase().includes(normalizedKeyword);

			if (!titleMatched) {
				return null;
			}

			return {
				url: formatUrl(`/posts/${post.id}/`),
				title: highlightText(title, keyword),
				excerpt: post.description || title,
				score: 1,
			};
		})
		.filter((item): item is SimpleSearchResult & { score: number } => !!item)
		.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
		.map(({ score: _score, ...item }) => item);
};

const search = async (keyword: string, isDesktop: boolean): Promise<void> => {
	const normalizedKeyword = keyword.trim();
	if (!normalizedKeyword) {
		setPanelVisibility(false, isDesktop);
		result = [];
		return;
	}
	if (!initialized) return;

	isSearching = true;
	if (debounceTimer) clearTimeout(debounceTimer);

	debounceTimer = setTimeout(() => {
		result = buildResults(normalizedKeyword);
		setPanelVisibility(true, isDesktop);
		isSearching = false;
	}, 200);
};

onMount(() => {
	const initializeSearch = async () => {
		try {
			const response = await fetch(searchDataUrl);
			if (!response.ok) {
				throw new Error(`Search data unavailable: ${response.status}`);
			}
			posts = await response.json();
		} catch (error) {
			console.error("Failed to load search data:", error);
			posts = [];
		} finally {
			initialized = true;
			if (keywordDesktop) search(keywordDesktop, true);
			if (keywordMobile) search(keywordMobile, false);
		}
	};

	initializeSearch();
});

$: if (initialized) {
	search(keywordDesktop, true);
}

$: if (initialized) {
	search(keywordMobile, false);
}
</script>

<div
	id="search-bar"
	class="hidden h-11 items-center rounded-lg bg-black/4 transition-all hover:bg-black/6 focus-within:bg-black/6 dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10 lg:flex"
>
	<Icon
		icon="material-symbols:search"
		class="pointer-events-none absolute my-auto ml-3 text-[1.25rem] text-black/30 transition dark:text-white/30"
	/>
	<input
		placeholder={i18n(I18nKey.search)}
		bind:value={keywordDesktop}
		onfocus={() => search(keywordDesktop, true)}
		class="h-full w-40 bg-transparent pl-10 text-sm text-black/50 outline-0 transition-all active:w-60 focus:w-60 dark:text-white/50"
	/>
</div>

<button
	onclick={togglePanel}
	aria-label="Search Panel"
	id="search-switch"
	class="btn-plain scale-animation h-11 w-11 rounded-lg active:scale-90 lg:hidden!"
>
	<Icon icon="material-symbols:search" class="text-[1.25rem]" />
</button>

<div
	id="search-panel"
	class="search-panel float-panel float-panel-closed absolute left-4 right-4 top-20 rounded-2xl p-2 shadow-2xl md:w-120 md:left-[unset]"
>
	<div
		id="search-bar-inside"
		class="relative flex h-11 items-center rounded-xl bg-black/4 transition-all hover:bg-black/6 focus-within:bg-black/6 dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10 lg:hidden"
	>
		<Icon
			icon="material-symbols:search"
			class="pointer-events-none absolute my-auto ml-3 text-[1.25rem] text-black/30 transition dark:text-white/30"
		/>
		<input
			placeholder={i18n(I18nKey.search)}
			bind:value={keywordMobile}
			class="absolute inset-0 bg-transparent pl-10 text-sm text-black/50 outline-0 focus:w-60 dark:text-white/50"
		/>
	</div>

	{#if isSearching}
		<div class="mt-2 block rounded-xl px-3 py-2 text-lg text-50">
			{i18n(I18nKey.searchLoading)}
		</div>
	{:else if result.length > 0}
		{#each result.slice(0, 5) as item}
			<a
				href={item.url}
				onclick={(e) => handleResultClick(e, item.url)}
				class="group mt-2 block rounded-xl px-3 py-2 text-lg transition hover:bg-(--btn-plain-bg-hover) active:bg-(--btn-plain-bg-active)"
			>
				<div class="inline-flex font-bold text-90 transition group-hover:text-(--primary)">
					{@html item.title}
					<Icon
						icon="fa7-solid:chevron-right"
						class="my-auto translate-x-1 text-[0.75rem] text-(--primary) transition"
					/>
				</div>
				<div class="mt-1 text-sm text-50">
					{@html item.excerpt}
				</div>
			</a>
		{/each}
		{#if result.length > 5}
			<a
				href={getSearchUrl(keywordDesktop || keywordMobile)}
				onclick={(e) =>
					handleResultClick(e, getSearchUrl(keywordDesktop || keywordMobile))}
				class="mt-2 block rounded-xl px-3 py-2 text-center text-lg font-bold text-(--primary) transition hover:bg-(--btn-plain-bg-hover) active:bg-(--btn-plain-bg-active)"
			>
				<span class="inline-flex items-center">
					{i18n(I18nKey.searchViewMore).replace("{count}", (result.length - 5).toString())}
					<Icon icon="fa7-solid:arrow-right" class="ml-1 text-[0.75rem] transition" />
				</span>
			</a>
		{/if}
	{:else if keywordDesktop || keywordMobile}
		<div class="mt-2 block rounded-xl px-3 py-2 text-lg text-50">
			{i18n(I18nKey.searchNoResults)}
		</div>
	{:else}
		<div class="mt-2 block rounded-xl px-3 py-2 text-lg text-50">
			{i18n(I18nKey.searchTypeSomething)}
		</div>
	{/if}
</div>

<style>
	input:focus {
		outline: 0;
	}

	.search-panel {
		max-height: calc(100vh - 100px);
		overflow-y: auto;
	}

	:global(mark) {
		background: transparent;
		color: var(--primary);
		font-weight: 600;
		padding: 0 0.1em;
	}
</style>
