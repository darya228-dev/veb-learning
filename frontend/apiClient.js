import { API_CONFIG } from "./config.js";

async function request(url, options = {}, retries = 2) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    try {
        const res = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers: {
                "Content-Type": "application/json",
                "X-Demo-UserId": localStorage.getItem("demoUserId") || "1",
                ...(options.headers || {})
            }
        });

        const data = await res.json().catch(() => null);

        clearTimeout(timeout);

        if (!res.ok) {
            const error = {
                status: res.status,
                message: data?.message || "Request error",
                errors: data?.errors || data?.details || null,
                code: data?.code || null
            };

            if (retries > 0 && (res.status === 429 || res.status === 503)) {
                return request(url, options, retries - 1);
            }

            throw error;
        }

        return {
            data: data?.data ?? data,
            meta: data?.meta ?? null
        };

    } catch (err) {
        clearTimeout(timeout);

        if (err.name === "AbortError") {
            throw { message: "Timeout error" };
        }

        throw err;
    }
}

export const apiClient = {
    getList: (page, limit) =>
        request(`${API_CONFIG.BASE_URL}?page=${page}&limit=${limit}`),

    getById: (id) =>
        request(`${API_CONFIG.BASE_URL}/${id}`),

    create: (dto) =>
        request(API_CONFIG.BASE_URL, {
            method: "POST",
            body: JSON.stringify(dto)
        }),

    update: (id, dto) =>
        request(`${API_CONFIG.BASE_URL}/${id}`, {
            method: "PUT",
            body: JSON.stringify(dto)
        }),

    remove: (id) =>
        request(`${API_CONFIG.BASE_URL}/${id}`, {
            method: "DELETE"
        }),

    getStats: () =>
        request(`${API_CONFIG.BASE_URL}/stats`),

    getClientStats: () =>
        request("http://localhost:3000/api/v1/users/client-stats")
};