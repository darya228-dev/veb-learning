import { apiClient } from "./apiClient.js";

const state = {
    items: [],
    stats: [],
    clientStats: [],
    editingId: null,
    loading: false,
    error: null,
    pagination: { page: 1, limit: 5, totalPages: 1 },
    sort: { field: null, direction: "asc" },
    statsSort: { field: null, direction: "asc" },
    clientStatsSort: { field: null, direction: "asc" }
};

const tableBody = document.getElementById("itemsTableBody");
const form = document.getElementById("createForm");
const demoUserSelect = document.getElementById("demoUserSelect");
const detailsModal = document.getElementById("detailsModal");
const closeDetailsModal = document.getElementById("closeDetailsModal");

const detailsSubject = document.getElementById("detailsSubject");
const detailsStatus = document.getElementById("detailsStatus");
const detailsPriority = document.getElementById("detailsPriority");
const detailsAuthor = document.getElementById("detailsAuthor");
const detailsMessage = document.getElementById("detailsMessage");

const subjectInput = document.getElementById("subjectInput");
const statusSelect = document.getElementById("statusSelect");
const prioritySelect = document.getElementById("prioritySelect");
const messageInput = document.getElementById("messageInput");
const authorInput = document.getElementById("authorInput");

window.addEventListener("DOMContentLoaded", init);

function init() {
    const savedUserId = localStorage.getItem("demoUserId") || "1";

    if (demoUserSelect) {
        demoUserSelect.value = savedUserId;
    }

    bindEvents();
    loadData();
}

function bindEvents() {
    form.addEventListener("submit", onSubmit);

    if (demoUserSelect) {
        demoUserSelect.addEventListener("change", () => {
            localStorage.setItem("demoUserId", demoUserSelect.value);
            state.pagination.page = 1;
            loadData();
        });
    }

    document.querySelectorAll("[data-sort]").forEach(th => {
        th.addEventListener("click", () => {
            const field = th.dataset.sort;

            if (state.sort.field === field) {
                state.sort.direction = state.sort.direction === "asc" ? "desc" : "asc";
            } else {
                state.sort.field = field;
                state.sort.direction = "asc";
            }

            renderTable();
        });
    });

    document.querySelectorAll("[data-stats-sort]").forEach(th => {
        th.addEventListener("click", () => {
            const field = th.dataset.statsSort;

            if (state.statsSort.field === field) {
                state.statsSort.direction = state.statsSort.direction === "asc" ? "desc" : "asc";
            } else {
                state.statsSort.field = field;
                state.statsSort.direction = "asc";
            }

            renderStats();
        });
    });

    document.querySelectorAll("[data-user-sort]").forEach(th => {
        th.addEventListener("click", () => {
            const field = th.dataset.userSort;

            if (state.clientStatsSort.field === field) {
                state.clientStatsSort.direction = state.clientStatsSort.direction === "asc" ? "desc" : "asc";
            } else {
                state.clientStatsSort.field = field;
                state.clientStatsSort.direction = "asc";
            }

            renderClientStats();
        });
    });
    if (closeDetailsModal) {
        closeDetailsModal.addEventListener("click", () => {
            detailsModal.classList.add("hidden");
        });
    }

    if (detailsModal) {
        detailsModal.addEventListener("click", (e) => {
            if (e.target === detailsModal) {
                detailsModal.classList.add("hidden");
            }
        });
    }

    document.getElementById("prevPage").onclick = () => {
        if (state.pagination.page > 1) {
            state.pagination.page--;
            loadData();
        }
    };

    document.getElementById("nextPage").onclick = () => {
        if (state.pagination.page < state.pagination.totalPages) {
            state.pagination.page++;
            loadData();
        }
    };
}


async function loadData() {
    setLoading(true);

    try {
        await Promise.all([
            loadTasks(),
            loadStats(),
            loadClientStats()
        ]);

        render();
        state.error = null;

    } catch (err) {
        state.error = err.message || "Load error";
        renderError();
    } finally {
        setLoading(false);
    }
}

async function loadTasks() {
    const res = await apiClient.getList(
        state.pagination.page,
        state.pagination.limit
    );

    state.items = Array.isArray(res)
        ? res
        : (res?.data || []);

    state.pagination.totalPages = res?.meta?.totalPages || 1;
}

async function loadStats() {
    const res = await apiClient.getStats();

    state.stats = res.data || [];
}

async function loadClientStats() {
    const res = await apiClient.getClientStats();
    state.clientStats = res.data || [];
}


async function onSubmit(e) {
    e.preventDefault();

    const dto = readForm();

    if (!validate(dto)) return;

    try {
        if (state.editingId) {
            await apiClient.update(state.editingId, dto);
        } else {
            await apiClient.create(dto);
        }

        resetForm();
        await loadData();

    } catch (err) {
        if (err.status === 400 && err.errors) {
            Object.entries(err.errors).forEach(([field, message]) => {
                const input = document.getElementById(field + "Input");
                const error = document.getElementById(field + "Error");

                if (input) input.classList.add("invalid");
                if (error) error.textContent = message;
            });
            return;
        }

        alert(err.message || "Save error");
    }
}

function readForm() {
    return {
        subject: subjectInput.value.trim(),
        status: statusSelect.value,
        priority: prioritySelect.value,
        message: messageInput.value.trim(),
        author: authorInput.value.trim()
    };
}


function validate(dto) {
    clearErrors();
    let ok = true;

    if (!dto.subject) {
        showError("subjectInput", "subjectError", "Required");
        ok = false;
    }

    if (!dto.status) {
        showError("statusSelect", "statusError", "Select status");
        ok = false;
    }

    if (!dto.priority) {
        showError("prioritySelect", "priorityError", "Select priority");
        ok = false;
    }

    if (!dto.message || dto.message.length < 5) {
        showError("messageInput", "messageError", "Min 5 chars");
        ok = false;
    }

    if (!dto.author) {
        showError("authorInput", "authorError", "Required");
        ok = false;
    }

    return ok;
}

function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);

    if (input) input.classList.add("invalid");
    if (error) error.textContent = message;
}

function clearErrors() {
    document.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));
    document.querySelectorAll(".error-text").forEach(el => el.textContent = "");
}


function render() {
    renderTable();
    renderStats();
    renderClientStats();
}


function sortArray(data, sortConfig) {
    if (!sortConfig.field) return [...data];

    return [...data].sort((a, b) => {
        let aValue;
        let bValue;

        if (sortConfig.field === "index") {
            aValue = state.items.indexOf(a) + 1;
            bValue = state.items.indexOf(b) + 1;
        } else {
            aValue = a[sortConfig.field];
            bValue = b[sortConfig.field];
        }

        if (aValue === undefined || aValue === null) aValue = "";
        if (bValue === undefined || bValue === null) bValue = "";

        if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
            aValue = Number(aValue);
            bValue = Number(bValue);
        } else {
            aValue = String(aValue).toLowerCase();
            bValue = String(bValue).toLowerCase();
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
    });
}


function renderTable() {
    tableBody.replaceChildren();

    const sortedItems = sortArray(state.items, state.sort);

    if (!sortedItems.length) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.textContent = "No data";
        tr.appendChild(td);
        tableBody.appendChild(tr);
        return;
    }

    sortedItems.forEach((item, i) => {
        const tr = document.createElement("tr");

        const values = [
            i + 1,
            item.subject || "",
            item.status || "",
            item.priority || "",
            item.author || ""
        ];

        values.forEach(value => {
            const td = document.createElement("td");
            td.textContent = value;
            tr.appendChild(td);
        });

        const actionsTd = document.createElement("td");

        const detailsBtn = document.createElement("button");
        detailsBtn.textContent = "Опис";
        detailsBtn.onclick = () => showDetails(item.id);

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = () => editItem(item.id);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteItem(item.id);

        actionsTd.appendChild(detailsBtn);
        actionsTd.appendChild(editBtn);
        actionsTd.appendChild(deleteBtn);

        tr.appendChild(actionsTd);
        tableBody.appendChild(tr);
    });
}

function renderStats() {
    const tbody = document.getElementById("statsTableBody");
    if (!tbody) return;

    tbody.replaceChildren();

    const stats = sortArray(state.stats || [], state.statsSort);

    if (!stats.length) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");

        td.colSpan = 3;
        td.textContent = "No data";

        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    stats.forEach(s => {
        const tr = document.createElement("tr");

        const values = [
            s.status ?? "-",
            s.priority ?? "-",
            s.count ?? 0
        ];

        values.forEach(value => {
            const td = document.createElement("td");
            td.textContent = value;
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });
}

function renderClientStats() {
    const tbody = document.getElementById("userRoleStatsTableBody");
    if (!tbody) return;

    tbody.replaceChildren();

    const clientStats = sortArray(state.clientStats || [], state.clientStatsSort);

    if (!clientStats.length) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");

        td.colSpan = 2;
        td.textContent = "No data";

        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    clientStats.forEach(r => {
        const tr = document.createElement("tr");

        const values = [
            r.client ?? "-",
            r.count ?? 0
        ];

        values.forEach(value => {
            const td = document.createElement("td");
            td.textContent = value;
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });
}

function setLoading(val) {
    state.loading = val;

    if (val) {
        tableBody.innerHTML = "<tr><td>Loading...</td></tr>";
    }
}

function renderError() {
    tableBody.replaceChildren();

    const tr = document.createElement("tr");
    const td = document.createElement("td");

    td.style.color = "red";
    td.textContent = state.error || "Error";

    tr.appendChild(td);
    tableBody.appendChild(tr);
}

async function showDetails(id) {
    try {
        const res = await apiClient.getById(id);
        const item = res.data || res;

        detailsSubject.textContent = item.subject || "-";
        detailsStatus.textContent = item.status || "-";
        detailsPriority.textContent = item.priority || "-";
        detailsAuthor.textContent = item.author || "-";
        detailsMessage.textContent = item.message || "Опис не вказано";

        detailsModal.classList.remove("hidden");
    } catch (err) {
        alert(err.message || "Не вдалося завантажити опис");
    }
}


window.editItem = async function (id) {
    const res = await apiClient.getById(id);
    const item = res.data || res;

    state.editingId = id;

    subjectInput.value = item.subject || "";
    statusSelect.value = item.status || "";
    prioritySelect.value = item.priority || "";
    messageInput.value = item.message || "";
    authorInput.value = item.author || "";
};

window.deleteItem = async function (id) {
    if (!confirm("Delete?")) return;

    try {
        await apiClient.remove(id);
        await loadData();
    } catch (err) {
        alert(err.message);
    }
};

function resetForm() {
    state.editingId = null;
    form.reset();
}