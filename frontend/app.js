// стата
const STORAGE_KEY = "lr1_tickets";
let items = loadFromStorage();
let editingId = null;

// елементі з дома
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
//фільтрація
filterStatus.addEventListener("change", renderTable);
filterPriority.addEventListener("change", renderTable);


form.addEventListener("submit", (e) => {
    e.preventDefault(); //не релоуд

    const dto = readForm();
    if (!validate(dto)) return;

    if (editingId) {
        updateItem(dto);
    } else {
        addItem(dto);
    }

    saveToStorage();
    renderTable();
    resetForm();
});


function addItem(dto) {
    items.push({
        id: Date.now(),
        createdAt: new Date().toLocaleDateString(),
        ...dto
    });
}

function updateItem(dto) {
    items = items.map(item =>
        item.id === editingId ? { ...item, ...dto } : item
    );
}

function deleteItem(id) {
    items = items.filter(item => item.id !== id);
}

/* рендер */
function renderTable() {
    tableBody.innerHTML = "";

    let filteredItems = items;

    if (filterStatus.value) {
        filteredItems = filteredItems.filter(
            item => item.status === filterStatus.value
        );
    }

    if (filterPriority.value) {
        filteredItems = filteredItems.filter(
            item => item.priority === filterPriority.value
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


tableBody.addEventListener("click", (e) => {
    if (e.target.dataset.delete) {
        deleteItem(Number(e.target.dataset.delete));
        saveToStorage();
        renderTable();
    }

    if (e.target.dataset.edit) {
        startEdit(Number(e.target.dataset.edit));
    }
});


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
    let valid = true;

    if (!dto.subject) showError("subjectInput", "subjectError", "Обовʼязкове поле"), valid = false;
    if (!dto.status) showError("statusSelect", "statusError", "Оберіть статус"), valid = false;
    if (!dto.priority) showError("prioritySelect", "priorityError", "Оберіть пріоритет"), valid = false;
    if (dto.message.length < 5) showError("messageInput", "messageError", "Мінімум 5 символів"), valid = false;
    if (!dto.author) showError("authorInput", "authorError", "Вкажіть автора"), valid = false;
    const duplicate = items.find(item =>
        item.subject.toLowerCase() === dto.subject.toLowerCase() &&
        item.author.toLowerCase() === dto.author.toLowerCase() &&
        item.id !== editingId
    );

    if (duplicate) {
        showError("subjectInput", "subjectError", "Така заявка вже існує");
        valid = false;
    }
    return valid;
}

function startEdit(id) {
    const item = items.find(x => x.id === id);
    editingId = id;

    subjectInput.value = item.subject;
    statusSelect.value = item.status;
    prioritySelect.value = item.priority;
    messageInput.value = item.message;
    authorInput.value = item.author;

    formTitle.textContent = "Редагування заявки";
    cancelEditBtn.classList.remove("hidden");
}

cancelEditBtn.addEventListener("click", resetForm);

function resetForm() {
    editingId = null;
    form.reset();
    clearErrors();
    formTitle.textContent = "Нова заявка";
    cancelEditBtn.classList.add("hidden");
}

/* Помилки */
function showError(inputId, errorId, message) {
    document.getElementById(inputId).classList.add("invalid");
    document.getElementById(errorId).textContent = message;
}

function clearErrors() {
    document.querySelectorAll(".invalid").forEach(e => e.classList.remove("invalid"));
    document.querySelectorAll(".error-text").forEach(e => e.textContent = "");
}

/* склад */
function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function loadFromStorage() {
    const json = localStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
}

renderTable();