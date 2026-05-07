const DEFAULT_TIMEZONE = process.env.SITE_TIMEZONE || "Asia/Shanghai";
const DEFAULT_EVENT_NAME =
	process.env.PUBLIC_UMAMI_HOME_ENTRY_EVENT || "home-entry";

function normalizeBaseUrl(value) {
	return String(value || "").replace(/\/+$/, "");
}

function getDatePartsInTimeZone(date, timeZone) {
	const formatter = new Intl.DateTimeFormat("en-CA", {
		timeZone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hourCycle: "h23",
	});

	const parts = formatter.formatToParts(date);
	const get = (type) => Number(parts.find((part) => part.type === type)?.value);

	return {
		year: get("year"),
		month: get("month"),
		day: get("day"),
		hour: get("hour"),
		minute: get("minute"),
		second: get("second"),
	};
}

function getTimeZoneOffsetMs(date, timeZone) {
	const parts = getDatePartsInTimeZone(date, timeZone);
	const asUtc = Date.UTC(
		parts.year,
		parts.month - 1,
		parts.day,
		parts.hour,
		parts.minute,
		parts.second,
	);

	return asUtc - date.getTime();
}

function zonedTimeToUtc(parts, timeZone) {
	const guess = new Date(
		Date.UTC(
			parts.year,
			parts.month - 1,
			parts.day,
			parts.hour || 0,
			parts.minute || 0,
			parts.second || 0,
			parts.millisecond || 0,
		),
	);

	return new Date(guess.getTime() - getTimeZoneOffsetMs(guess, timeZone));
}

function getTodayRange(timeZone) {
	const now = new Date();
	const today = getDatePartsInTimeZone(now, timeZone);
	const startAt = zonedTimeToUtc(
		{
			year: today.year,
			month: today.month,
			day: today.day,
			hour: 0,
			minute: 0,
			second: 0,
			millisecond: 0,
		},
		timeZone,
	);

	const nextDayUtc = new Date(Date.UTC(today.year, today.month - 1, today.day) + 86400000);
	const endAt = new Date(
		zonedTimeToUtc(
			{
				year: nextDayUtc.getUTCFullYear(),
				month: nextDayUtc.getUTCMonth() + 1,
				day: nextDayUtc.getUTCDate(),
				hour: 0,
				minute: 0,
				second: 0,
				millisecond: 0,
			},
			timeZone,
		).getTime() - 1,
	);

	return {
		startAt: startAt.getTime(),
		endAt: endAt.getTime(),
	};
}

async function getAuthHeaders(baseUrl) {
	const apiKey = process.env.UMAMI_API_KEY?.trim();
	if (apiKey) {
		return {
			Accept: "application/json",
			"x-umami-api-key": apiKey,
		};
	}

	const username = process.env.UMAMI_USERNAME?.trim();
	const password = process.env.UMAMI_PASSWORD?.trim();

	if (!username || !password) {
		throw new Error("Missing Umami credentials.");
	}

	const response = await fetch(`${baseUrl}/api/auth/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({ username, password }),
	});

	if (!response.ok) {
		throw new Error(`Umami login failed with status ${response.status}.`);
	}

	const payload = await response.json();
	if (!payload?.token) {
		throw new Error("Umami login did not return a token.");
	}

	return {
		Accept: "application/json",
		Authorization: `Bearer ${payload.token}`,
	};
}

async function fetchUmamiJson(baseUrl, path, headers, query = {}) {
	const url = new URL(`${baseUrl}${path}`);
	Object.entries(query).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== "") {
			url.searchParams.set(key, String(value));
		}
	});

	const response = await fetch(url, { headers });
	if (!response.ok) {
		const body = await response.text();
		throw new Error(`Umami request failed: ${response.status} ${body}`);
	}

	return response.json();
}

function sumSeries(series) {
	if (!Array.isArray(series)) return 0;
	return series.reduce((total, item) => total + Number(item?.y || 0), 0);
}

export default async function handler(req, res) {
	const baseUrl = normalizeBaseUrl(
		process.env.UMAMI_API_BASE_URL || process.env.UMAMI_BASE_URL,
	);
	const websiteId =
		process.env.UMAMI_WEBSITE_ID ||
		process.env.PUBLIC_UMAMI_WEBSITE_ID ||
		req.query?.websiteId;
	const timezone =
		typeof req.query?.timezone === "string" && req.query.timezone
			? req.query.timezone
			: DEFAULT_TIMEZONE;
	const homeEntryEventName =
		typeof req.query?.homeEntryEventName === "string" && req.query.homeEntryEventName
			? req.query.homeEntryEventName
			: DEFAULT_EVENT_NAME;

	res.setHeader("Content-Type", "application/json; charset=utf-8");
	res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");

	if (!baseUrl || !websiteId) {
		res.status(200).json({
			enabled: false,
			reason: "Umami is not configured.",
		});
		return;
	}

	try {
		const headers = await getAuthHeaders(baseUrl);
		const { startAt: todayStartAt, endAt: todayEndAt } = getTodayRange(timezone);
		const now = Date.now();

		const [dateRange, todayStats] = await Promise.all([
			fetchUmamiJson(
				baseUrl,
				`/api/websites/${websiteId}/daterange`,
				headers,
			),
			fetchUmamiJson(
				baseUrl,
				`/api/websites/${websiteId}/stats`,
				headers,
				{
					startAt: todayStartAt,
					endAt: todayEndAt,
				},
			),
		]);

		const totalStartAt = dateRange?.startDate
			? new Date(dateRange.startDate).getTime()
			: todayStartAt;

		const [totalStats, homeEntryMetrics] = await Promise.all([
			fetchUmamiJson(
				baseUrl,
				`/api/websites/${websiteId}/stats`,
				headers,
				{
					startAt: totalStartAt,
					endAt: now,
				},
			),
			fetchUmamiJson(
				baseUrl,
				`/api/websites/${websiteId}/events/series`,
				headers,
				{
					startAt: totalStartAt,
					endAt: now,
					unit: "day",
					timezone,
					event: homeEntryEventName,
				},
			).catch(() => []),
		]);

		res.status(200).json({
			enabled: true,
			provider: "umami",
			timezone,
			todayVisitors: Number(todayStats?.visitors || 0),
			totalVisitors: Number(totalStats?.visitors || 0),
			homeEntries: sumSeries(homeEntryMetrics),
			updatedAt: new Date().toISOString(),
		});
	} catch (error) {
		res.status(500).json({
			enabled: false,
			reason: error instanceof Error ? error.message : "Unknown error",
		});
	}
}
