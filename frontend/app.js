const API_URL = "http://localhost:3000/api/v1/tasks";

const state = {
    items: [], // Тепер завантажуємо з сервера
    editingId: null,
    filters: {
        status: "",
        priority: "",
        sort: null
    },
    sort: { field: null, direction: "asc" }
};

// DOM елементи (залишаються без змін)
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

// Точка входу
(async function init() {
    attachHandlers();
    await loadFromServer(); // Замість localStorage
    render();
})();

function attachHandlers() {
    form.addEventListener("submit", onSubmit);
    tableBody.addEventListener("click", onTableClick);

    filterStatus.addEventListener("change", (e) => {
        state.filters.status = e.target.value;
        render();
    });

    filterPriority.addEventListener("change", (e) => {
        state.filters.priority = e.target.value;
        render();
    });

    cancelEditBtn.addEventListener("click", resetForm);

    tableHead.addEventListener("click", function (e) {
        const col = e.target.dataset.sort;
        if (!col) return;

        if (state.filters.sort === col) {
            state.sort.direction = state.sort.direction === "asc" ? "desc" : "asc";
        } else {
            state.filters.sort = col;
            state.sort.direction = "asc";
        }
        render();
    });
}

// Взаємодія з API
async function loadFromServer() {
    try {
        const response = await fetch(API_URL);
        state.items = await response.json();
        render(); // Не забудь викликати функцію малювання таблиці після завантаження
    } catch (err) {
        console.error("Помилка завантаження:", err);
    }
}

async function onSubmit(e) {
    e.preventDefault();
    const dto = readForm();
    if (!validate(dto)) return;

    try {
        if (state.editingId) {
            // PUT запит для оновлення
            const response = await fetch(`${API_URL}/${state.editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dto)
            });
            const updated = await response.json();
            state.items = state.items.map(item => item.id === state.editingId ? updated : item);
        } else {
            // POST запит для створення
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dto)
            });
            const newItem = await response.json();
            state.items.push(newItem);
        }

        resetForm();
        render();
    } catch (err) {
        alert("Помилка при збереженні даних");
    }
}

async function onTableClick(e) {
    const deleteId = e.target.dataset.delete;
    const editId = e.target.dataset.edit;

    if (deleteId) {
        try {
            await fetch(`${API_URL}/${deleteId}`, { method: "DELETE" });
            state.items = state.items.filter(item => item.id !== deleteId);
            render();
        } catch (err) {
            console.error("Не вдалося видалити:", err);
        }
    }

    if (editId) {
        startEdit(editId);
    }
}

// Функції рендеру та логіки (залишаються майже такими самими)
function render() {
    tableBody.innerHTML = "";
    let filteredItems = [...state.items];

    if (state.filters.status) {
        filteredItems = filteredItems.filter(item => item.status === state.filters.status);
    }
    if (state.filters.priority) {
        filteredItems = filteredItems.filter(item => item.priority === state.filters.priority);
    }

    // Сортування
    if (state.filters.sort) {
        const dir = state.sort.direction === "asc" ? 1 : -1;
        filteredItems.sort((a, b) => {
            const valA = a[state.filters.sort] || "";
            const valB = b[state.filters.sort] || "";
            return valA.toString().localeCompare(valB.toString()) * dir;
        });
    }

    filteredItems.forEach((item, index) => {
        tableBody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.subject}</td>
                <td>${item.status}</td>
                <td>${item.priority}</td>
                <td>${item.author}</td>
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
    const item = state.items.find(x => x.id === id);
    if (!item) return;
    state.editingId = id;
    subjectInput.value = item.subject;
    statusSelect.value = item.status;
    prioritySelect.value = item.priority;
    messageInput.value = item.message;
    authorInput.value = item.author;
    formTitle.textContent = "Редагування заявки";
    cancelEditBtn.classList.remove("hidden");
}

function resetForm() {
    state.editingId = null;
    form.reset();
    clearErrors();
    formTitle.textContent = "Нова заявка";
    cancelEditBtn.classList.add("hidden");
}

function validate(dto) {
    clearErrors();
    let valid = true;
    if (!dto.subject) showError("subjectInput", "subjectError", "Обовʼязкове поле"), valid = false;
    if (!dto.status) showError("statusSelect", "statusError", "Оберіть статус"), valid = false;
    if (!dto.priority) showError("prioritySelect", "priorityError", "Оберіть пріоритет"), valid = false;
    if (dto.message.length < 5) showError("messageInput", "messageError", "Мінімум 5 символів"), valid = false;
    if (!dto.author) showError("authorInput", "authorError", "Вкажіть автора"), valid = false;
    return valid;
}

function showError(inputId, errorId, message) {
    document.getElementById(inputId).classList.add("invalid");
    document.getElementById(errorId).textContent = message;
}

function clearErrors() {
    document.querySelectorAll(".invalid").forEach(e => e.classList.remove("invalid"));
    document.querySelectorAll(".error-text").forEach(e => e.textContent = "");
}