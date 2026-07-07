import { sleep } from "@/utils";

const isBuildPhase =
    process.env.CORE_BUILD === "1" ||
    process.env.NEXT_PHASE === "phase-production-build";

const maxConcurrent = Number(
    process.env.CORE_BUILD_CONCURRENCY || (isBuildPhase ? 4 : 0),
);
const maxAttempts = Number(
    process.env.CORE_RETRY_MAX_ATTEMPTS || (isBuildPhase ? 6 : 4),
);
const baseDelayMs = Number(
    process.env.CORE_RETRY_BASE_MS || (isBuildPhase ? 1500 : 500),
);

const RETRYABLE_STATUSES = new Set([500, 502, 503, 504]);

class Semaphore {
    constructor(limit) {
        this.limit = limit;
        this.active = 0;
        this.queue = [];
    }

    async acquire() {
        if (this.active < this.limit) {
            this.active++;
            return;
        }
        await new Promise((resolve) => this.queue.push(resolve));
        this.active++;
    }

    release() {
        this.active--;
        const next = this.queue.shift();
        if (next) next();
    }
}

// Per worker process — Next.js runs multiple SSG workers, each with its own limit.
const buildSemaphore =
    isBuildPhase && maxConcurrent > 0 ? new Semaphore(maxConcurrent) : null;

const withBuildThrottle = async (fn) => {
    if (!buildSemaphore) return fn();
    await buildSemaphore.acquire();
    try {
        return await fn();
    } finally {
        buildSemaphore.release();
    }
};

const retryDelayMs = (attempt) => {
    const exponential = baseDelayMs * 2 ** (attempt - 1);
    const jitter = Math.floor(Math.random() * 250);
    return exponential + jitter;
};

const shouldRetry = (status, attempt) =>
    attempt < maxAttempts && RETRYABLE_STATUSES.has(status);

/**
 * Shared fetch for all Core API traffic.
 * During `next build`, limits concurrent in-flight requests per worker and retries 5xx.
 */
export const coreFetch = async (url, init) => {
    return withBuildThrottle(async () => {
        let lastResponse;
        let lastError;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const response = await fetch(url, init);

                if (shouldRetry(response.status, attempt)) {
                    lastResponse = response;
                    await sleep(retryDelayMs(attempt));
                    continue;
                }

                return response;
            } catch (error) {
                lastError = error;
                if (attempt >= maxAttempts) break;
                await sleep(retryDelayMs(attempt));
            }
        }

        if (lastResponse) return lastResponse;
        throw lastError ?? new Error("Core request failed after retries");
    });
};
