const API_URL = "http://localhost:3000/api/v1/tasks";

const state = {
    items: [],
    editingId: null,
    filters: {
        status: "",
        priority: ""
    },
    sort: { field: null, direction: "asc" }
};

const form = document.getElementById("createForm");
const tableBody = document.getElementById("itemsTableBody");

const subjectInput = document.getElementById("subjectInput");
const statusSelect = document.getElementById("statusSelect");
const prioritySelect = document.getElementById("prioritySelect");
const messageInput = document.getElementById("messageInput");
const authorInput = document.getElementById("authorInput");

const cancelEditBtn = document.getElementById("cancelEdit");
const formTitle = document.getElementById("formTitle");

const filterStatus = document.getElementById("filterStatus");
const filterPriority = document.getElementById("filterPriority");
const tableHead = document.querySelector("thead");

init();

function init() {
    attachHandlers();
    loadFromServer();
}

function attachHandlers() {
    form.addEventListener("submit", onSubmit);
    tableBody.addEventListener("click", onTableClick);

    filterStatus.addEventListener("change", e => {
        state.filters.status = e.target.value;
        render();
    });

    filterPriority.addEventListener("change", e => {
        state.filters.priority = e.target.value;
        render();
    });

    cancelEditBtn.addEventListener("click", resetForm);

    tableHead.addEventListener("click", e => {
        const col = e.target.dataset.sort;
        if (!col) return;

        if (state.sort.field === col) {
            state.sort.direction = state.sort.direction === "asc" ? "desc" : "asc";
        } else {
            state.sort.field = col;
            state.sort.direction = "asc";
        }

        render();
    });
}

async function loadFromServer() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error();

        const res = await response.json();
        state.items = Array.isArray(res) ? res : (res.data ?? []);
        render();
    } catch {
        tableBody.innerHTML = "<tr><td>Помилка завантаження</td></tr>";
    }
}

async function onSubmit(e) {
    e.preventDefault();

    const dto = readForm();
    if (!validate(dto)) return;

    try {
        if (state.editingId) {
            const response = await fetch(`${API_URL}/${state.editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dto)
            });

            if (!response.ok) throw new Error();

            const res = await response.json();
            const updated = res.data ?? res;

            state.items = state.items.map(i =>
                i.id === state.editingId ? updated : i
            );
        } else {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dto)
            });

            if (!response.ok) throw new Error();

            const res = await response.json();
            const created = res.data ?? res;

            state.items.push(created);
        }

        resetForm();
        render();
    } catch {
        alert("Помилка при збереженні");
    }
}

async function onTableClick(e) {
    const deleteId = e.target.dataset.delete;
    const editId = e.target.dataset.edit;

    if (deleteId) {
        try {
            const res = await fetch(`${API_URL}/${deleteId}`, {
                method: "DELETE"
            });

            if (!res.ok) throw new Error();

            state.items = state.items.filter(i => i.id !== deleteId);
            render();
        } catch {
            alert("Помилка видалення");
        }
    }

    if (editId) {
        startEdit(editId);
    }
}

function render() {
    tableBody.innerHTML = "";

    let list = [...state.items];

    if (state.filters.status) {
        list = list.filter(i => i.status === state.filters.status);
    }

    if (state.filters.priority) {
        list = list.filter(i => i.priority === state.filters.priority);
    }

    if (state.sort.field) {
        const dir = state.sort.direction === "asc" ? 1 : -1;
        list.sort((a, b) =>
            (a[state.sort.field] || "")
                .toString()
                .localeCompare((b[state.sort.field] || "").toString()) * dir
        );
    }

    if (!list.length) {
        tableBody.innerHTML = "<tr><td>Немає даних</td></tr>";
        return;
    }

    list.forEach((item, index) => {
        tableBody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.subject ?? ""}</td>
                <td>${item.status ?? ""}</td>
                <td>${item.priority ?? ""}</td>
                <td>${item.author ?? ""}</td>
                <td>
                    <button data-edit="${item.id}">Редагувати</button>
                    <button data-delete="${item.id}">Видалити</button>
                </td>
            </tr>
        `;
    });
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

function startEdit(id) {
    const item = state.items.find(i => i.id === id);
    if (!item) return;

    state.editingId = id;

    subjectInput.value = item.subject || "";
    statusSelect.value = item.status || "";
    prioritySelect.value = item.priority || "";
    messageInput.value = item.message || "";
    authorInput.value = item.author || "";

    formTitle.textContent = "Редагування";
    cancelEditBtn.classList.remove("hidden");

    clearErrors();
}

function resetForm() {
    state.editingId = null;
    form.reset();
    formTitle.textContent = "Нова заявка";
    cancelEditBtn.classList.add("hidden");
    clearErrors();
}

function validate(dto) {
    clearErrors();
    let ok = true;

    if (!dto.subject) {
        showError("subjectInput", "subjectError", "Обовʼязкове поле");
        ok = false;
    }

    if (!dto.status) {
        showError("statusSelect", "statusError", "Оберіть статус");
        ok = false;
    }

    if (!dto.priority) {
        showError("prioritySelect", "priorityError", "Оберіть пріоритет");
        ok = false;
    }

    if (!dto.message || dto.message.length < 5) {
        showError("messageInput", "messageError", "Мінімум 5 символів");
        ok = false;
    }

    if (!dto.author) {
        showError("authorInput", "authorError", "Вкажіть автора");
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