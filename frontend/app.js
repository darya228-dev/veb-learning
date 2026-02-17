// стата

const STORAGE_KEY = "lr1_tickets";

const state = {
    items: loadFromStorage(),
    editingId: null,
    filters: {
        status: "",
        priority: ""
    }
};

// дом

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

// инит

(function init() {
    attachHandlers();
    render();
})();

// хандрелс

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
}

function onSubmit(e) {
    e.preventDefault();

    const dto = readForm();
    if (!validate(dto)) return;

    if (state.editingId) {
        updateItem(dto);
    } else {
        addItem(dto);
    }

    saveToStorage();
    resetForm();
    render();
}

function onTableClick(e) {
    if (e.target.dataset.delete) {
        deleteItem(Number(e.target.dataset.delete));
        saveToStorage();
        render();
    }

    if (e.target.dataset.edit) {
        startEdit(Number(e.target.dataset.edit));
    }
}

// круд

function addItem(dto) {
    state.items.push({
        id: Date.now(),
        createdAt: new Date().toLocaleDateString(),
        ...dto
    });
}

function updateItem(dto) {
    state.items = state.items.map(item =>
        item.id === state.editingId ? { ...item, ...dto } : item
    );
}

function deleteItem(id) {
    state.items = state.items.filter(item => item.id !== id);
}

// рендер

function render() {
    renderTable();
}

function renderTable() {
    tableBody.innerHTML = "";

    let filteredItems = [...state.items];

    if (state.filters.status) {
        filteredItems = filteredItems.filter(
            item => item.status === state.filters.status
        );
    }

    if (state.filters.priority) {
        filteredItems = filteredItems.filter(
            item => item.priority === state.filters.priority
        );
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

// форма

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

// перевірка

function validate(dto) {
    clearErrors();
    let valid = true;

    if (!dto.subject) showError("subjectInput", "subjectError", "Обовʼязкове поле"), valid = false;
    if (!dto.status) showError("statusSelect", "statusError", "Оберіть статус"), valid = false;
    if (!dto.priority) showError("prioritySelect", "priorityError", "Оберіть пріоритет"), valid = false;
    if (dto.message.length < 5) showError("messageInput", "messageError", "Мінімум 5 символів"), valid = false;
    if (!dto.author) showError("authorInput", "authorError", "Вкажіть автора"), valid = false;

    const duplicate = state.items.find(item =>
        item.subject.toLowerCase() === dto.subject.toLowerCase() &&
        item.author.toLowerCase() === dto.author.toLowerCase() &&
        item.id !== state.editingId
    );

    if (duplicate) {
        showError("subjectInput", "subjectError", "Така заявка вже існує");
        valid = false;
    }

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

// сейв в масив

function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
}

function loadFromStorage() {
    const json = localStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
}
