document.addEventListener("DOMContentLoaded", () => {
    // ініціалізація
});

const form = document.getElementById("createForm");
const tableBody = document.getElementById("itemsTableBody");

const firstError = document.querySelector(".error-text");
const allFields = document.querySelectorAll(".field input");

const userName = document.getElementById("userInput").value;
const status = document.getElementById("statusSelect").value;
const comment = document.getElementById("commentInput").value;

const capacity = Number(document.getElementById("capacityInput").value);

const title = document.getElementById("titleInput").value.trim();

const el = document.getElementById("userInput");
el.classList.add("invalid");
el.classList.remove("invalid");

document.getElementById("saveBtn").setAttribute("disabled", "disabled");

document.getElementById("saveBtn").disabled = true;
const emptyState = document.getElementById("emptyState");
emptyState.classList.toggle("hidden", items.length > 0);

function renderTable(items) {
    const tbody = document.getElementById("itemsTableBody");
    const rowsHtml = items.map((item, index) => `
 <tr>
 <td>${index + 1}</td>
 <td>${item.title}</td>
 <td>${item.status}</td>
 <td>${item.createdAt}</td>
 <td>
 <button type="button" class="delete-btn" data-id="${item.id}">Видалити</button>
 </td>
 </tr>
 `).join("");
    tbody.innerHTML = rowsHtml;
}

element.addEventListener("eventName", handlerFunction);

const form = document.getElementById("createForm");
form.addEventListener("submit", (event) => {
    event.preventDefault();
    // 1) зчитати поля
    // 2) перевірити дані
    // 3) додати/оновити запис у масиві
    // 4) оновити таблицю (render)
});

const tbody = document.getElementById("itemsTableBody");
tbody.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("delete-btn")) {
        const id = Number(target.dataset.id);
        deleteItemById(id);
        renderTable(items);
        return;
    }
    if (target.classList.contains("edit-btn")) {
        const id = Number(target.dataset.id);
        startEdit(id); // підставити дані в форму
        return;
    }
});


