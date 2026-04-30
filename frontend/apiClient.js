const API_URL = "http://localhost:3000/api/v1/tasks";

async function request(url, options = {}, timeout = 10000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            }
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw {
                status: response.status,
                message: data?.message || "Request error",
                details: data?.details || []
            };
        }

        return data;
    } finally {
        clearTimeout(id);
    }
}

export const apiClient = {
    getAll: () => request(API_URL),
    getById: (id) => request(`${API_URL}/${id}`),

    create: (dto) =>
        request(API_URL, {
            method: "POST",
            body: JSON.stringify(dto)
        }),

    update: (id, dto) =>
        request(`${API_URL}/${id}`, {
            method: "PUT",
            body: JSON.stringify(dto)
        }),

    remove: (id) =>
        request(`${API_URL}/${id}`, {
            method: "DELETE"
        })
};