<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { onMount } from "svelte";
import Icon from "@/components/common/Icon.svelte";
import { url as formatUrl } from "@/utils/url-utils";

type SearchPostMeta = {
	id: string;
	title: string;
	description?: string;
	category?: string;
	password?: boolean;
};

type SearchResultItem = {
	url: string;
	title: string;
	excerpt: string;
};

export let title = i18n(I18nKey.search);
export let description = "";

let keyword = "";
let results: SearchResultItem[] = [];
let isSearching = false;
let initialized = false;
let posts: SearchPostMeta[] = [];
let debounceTimer: ReturnType<typeof setTimeout> | undefined;

const searchDataUrl = formatUrl("/api/allPostMeta.json");

const getInitialKeyword = (): string => {
	if (typeof window !== "undefined") {
		const searchParams = new URLSearchParams(window.location.search);
		return searchParams.get("q") || "";
	}
	return "";
};

const escapeRegExp = (value: string): string =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const highlightText = (text: string, currentKeyword: string): string => {
	if (!currentKeyword.trim()) return text;
	const pattern = new RegExp(`(${escapeRegExp(currentKeyword.trim())})`, "gi");
	return text.replace(pattern, "<mark>$1</mark>");
};

const runSearch = () => {
	const normalizedKeyword = keyword.trim().toLowerCase();
	if (!normalizedKeyword) {
		results = [];
		return;
	}

	results = posts
		.filter((post) => !post.password)
		.map((post) => {
			const postTitle = post.title || "";
			const postDescription = post.description || "";
			const titleMatched = postTitle.toLowerCase().includes(normalizedKeyword);

			if (!titleMatched) {
				return null;
			}

			return {
				url: formatUrl(`/posts/${post.id}/`),
				title: highlightText(postTitle, keyword),
				excerpt: postDescription || postTitle,
				score: 1,
			};
		})
		.filter((item): item is SearchResultItem & { score: number } => !!item)
		.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
		.map(({ score: _score, ...item }) => item);
};

const handleInput = () => {
	if (debounceTimer) clearTimeout(debounceTimer);
	isSearching = true;

	debounceTimer = setTimeout(() => {
		runSearch();
		isSearching = false;
	}, 200);
};

onMount(() => {
	const initialize = async () => {
		try {
			const response = await fetch(searchDataUrl);
			if (!response.ok) {
				throw new Error(`Search data unavailable: ${response.status}`);
			}
			posts = await response.json();
		} catch (error) {
			console.error("Search error:", error);
			posts = [];
		} finally {
			initialized = true;
			keyword = getInitialKeyword();
			if (keyword.trim()) {
				runSearch();
			}
		}
	};

	initialize();
});
</script>

<div class="mb-4 rounded-(--radius-large) card-base px-6 py-6 md:px-9 md:py-6">
	<div class="mb-4">
		<div class="mb-3 flex items-center gap-3">
			<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-(--primary) text-white dark:text-black/70">
				<Icon icon="material-symbols:search" class="text-[1.5rem]" />
			</div>
			<div class="text-3xl font-bold text-90">
				{title}
			</div>
		</div>
		{#if description}
			<p class="text-base leading-relaxed text-50">
				{description}
			</p>
		{/if}
	</div>

	<div class="relative flex">
		<div class="relative flex-1">
			<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
				<Icon icon="material-symbols:search" class="text-2xl text-50" />
			</div>
			<input
				type="text"
				class="block w-full rounded-lg border border-black/10 bg-transparent p-4 pl-10 text-sm text-75 outline-hidden transition-colors placeholder:opacity-50 hover:border-black/20 focus:border-(--primary) focus:ring-2 focus:ring-(--primary) dark:border-white/10 dark:hover:border-white/20"
				placeholder={i18n(I18nKey.search)}
				bind:value={keyword}
				oninput={handleInput}
			/>
		</div>
	</div>
</div>

<div class="grid grid-cols-1 gap-4">
	<div>
		{#if isSearching && initialized}
			<div class="flex justify-center py-10">
				<Icon icon="svg-spinners:ring-resize" class="text-4xl text-(--primary)" />
			</div>
		{:else if results.length > 0}
			<div class="space-y-4">
				{#each results as result}
					<div class="block rounded-(--radius-large) card-base p-6">
						<a href={result.url} class="group block">
							<h5 class="mb-2 text-2xl font-bold tracking-tight text-90 transition-colors group-hover:text-(--primary)">
								{@html result.title}
							</h5>
							<p class="font-normal text-75">
								{@html result.excerpt}
							</p>
						</a>
					</div>
				{/each}
			</div>
		{:else if keyword}
			<div class="rounded-(--radius-large) card-base p-10 text-center text-50">
				{i18n(I18nKey.searchNoResults)}
			</div>
		{:else}
			<div class="rounded-(--radius-large) card-base p-10 text-center text-50">
				{i18n(I18nKey.searchTypeSomething)}
			</div>
		{/if}
	</div>
</div>

<style>
	:global(mark) {
		background: transparent;
		color: var(--primary);
		font-weight: 600;
		padding: 0 0.1em;
	}
</style>
