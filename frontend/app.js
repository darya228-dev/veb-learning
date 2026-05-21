import { apiClient } from "./apiClient.js";

const state = {
    items: [],
    stats: [],
    editingId: null,
    loading: false,
    error: null,
    pagination: { page: 1, limit: 5, totalPages: 1 }
};


const tableBody = document.getElementById("itemsTableBody");
const form = document.getElementById("createForm");
const statsContainer = document.getElementById("statsContainer");

const subjectInput = document.getElementById("subjectInput");
const statusSelect = document.getElementById("statusSelect");
const prioritySelect = document.getElementById("prioritySelect");
const messageInput = document.getElementById("messageInput");
const authorInput = document.getElementById("authorInput");


document.addEventListener("DOMContentLoaded", init);

function init() {
    bindEvents();
    loadData();
}


function bindEvents() {
    form.addEventListener("submit", onSubmit);

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
        const res = await apiClient.getList(
            state.pagination.page,
            state.pagination.limit
        );

        state.items = Array.isArray(res)
            ? res
            : (res?.data || []);

        state.pagination.totalPages = res?.meta?.totalPages || 1;

        const statsRes = await apiClient.getStats();
        state.stats = statsRes.data || statsRes || [];

        state.error = null;
        render();

    } catch (err) {
        state.error = err.message || "Load error";
        renderError();
    } finally {
        setLoading(false);
    }
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
        showError(subjectInput, "subjectError", "Required");
        ok = false;
    }

    if (!dto.status) {
        showError(statusSelect, "statusError", "Select status");
        ok = false;
    }

    if (!dto.priority) {
        showError(prioritySelect, "priorityError", "Select priority");
        ok = false;
    }

    if (!dto.message || dto.message.length < 5) {
        showError(messageInput, "messageError", "Min 5 chars");
        ok = false;
    }

    if (!dto.author) {
        showError(authorInput, "authorError", "Required");
        ok = false;
    }

    return ok;
}

function showError(input, errorId, message) {
    input.classList.add("invalid");
    const el = document.getElementById(errorId);
    if (el) el.textContent = message;
}

function clearErrors() {
    document.querySelectorAll(".invalid").forEach(i => i.classList.remove("invalid"));
    document.querySelectorAll(".error-text").forEach(e => e.textContent = "");
}

function render() {
    if (!state.items.length) {
        tableBody.innerHTML = "<tr><td>No data</td></tr>";
        return;
    }

    tableBody.innerHTML = state.items.map((item, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${item.subject || ""}</td>
            <td>${item.status || ""}</td>
            <td>${item.priority || ""}</td>
            <td>${item.author || ""}</td>
            <td>
                <button onclick="editItem('${item.id}')">Edit</button>
                <button onclick="deleteItem('${item.id}')">Delete</button>
            </td>
        </tr>
    `).join("");

    statsContainer.innerHTML = (state.stats || []).map(s => `
        <div>${s.status} / ${s.priority}: ${s.count}</div>
    `).join("");
}


function setLoading(val) {
    state.loading = val;
    if (val) {
        tableBody.innerHTML = "<tr><td>Loading...</td></tr>";
    }
}


function renderError() {
    tableBody.innerHTML = `<tr><td style="color:red">${state.error}</td></tr>`;
}


window.editItem = async function (id) {
    const item = await apiClient.getById(id);

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