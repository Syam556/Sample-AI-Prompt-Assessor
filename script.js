let prompts = JSON.parse(localStorage.getItem("prompts")) || [];

const form = document.getElementById("promptForm");
const table = document.getElementById("promptTable");
const searchInput = document.getElementById("searchInput");
const noDataMessage = document.getElementById("noDataMessage");

function saveToStorage() {
    localStorage.setItem("prompts", JSON.stringify(prompts));
}

function renderTable(data = prompts) {
    table.innerHTML = "";

    if (data.length === 0) {
        noDataMessage.textContent = "No prompts found.";
        return;
    }

    noDataMessage.textContent = "";

    data.forEach((prompt, index) => {
        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${prompt.title}</td>
            <td>${prompt.category}</td>
            <td>${prompt.status}</td>
            <td>${prompt.rating}</td>
            <td class="actions">
                <button onclick="editPrompt(${index})">Edit</button>
                <button class="delete" onclick="deletePrompt(${index})">Delete</button>
            </td>
        `;

        table.appendChild(row);
    });
}

form.addEventListener("submit", function(e) {
    e.preventDefault();

    let title = document.getElementById("title").value.trim();
    let category = document.getElementById("category").value.trim();
    let content = document.getElementById("content").value.trim();
    let status = document.getElementById("status").value;
    let rating = document.getElementById("rating").value;
    let editIndex = document.getElementById("editIndex").value;

    if (!title || !category || !content || rating < 1 || rating > 5) {
        alert("Please fill all fields correctly.");
        return;
    }

    let newPrompt = { title, category, content, status, rating };

    if (editIndex === "") {
        prompts.push(newPrompt);
    } else {
        prompts[editIndex] = newPrompt;
        document.getElementById("editIndex").value = "";
        document.getElementById("submitBtn").textContent = "Save Prompt";
    }

    saveToStorage();
    renderTable();
    form.reset();
});

function editPrompt(index) {
    let prompt = prompts[index];

    document.getElementById("title").value = prompt.title;
    document.getElementById("category").value = prompt.category;
    document.getElementById("content").value = prompt.content;
    document.getElementById("status").value = prompt.status;
    document.getElementById("rating").value = prompt.rating;

    document.getElementById("editIndex").value = index;
    document.getElementById("submitBtn").textContent = "Update Prompt";
}

function deletePrompt(index) {
    if (confirm("Are you sure you want to delete this prompt?")) {
        prompts.splice(index, 1);
        saveToStorage();
        renderTable();
    }
}

searchInput.addEventListener("input", function() {
    let value = this.value.toLowerCase();

    let filtered = prompts.filter(prompt =>
        prompt.title.toLowerCase().includes(value) ||
        prompt.category.toLowerCase().includes(value)
    );

    renderTable(filtered);
});

renderTable();
