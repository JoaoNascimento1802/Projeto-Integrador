const API_URL = "http://localhost:8080/zoo";

document.addEventListener("DOMContentLoaded", () => {
    loadAnimals();

    const form = document.getElementById("animal-form");
    form.addEventListener("submit", handleSubmit);
});

function showMessage(message, type) {
    const messageBox = document.getElementById("message-box");
    messageBox.textContent = message;
    messageBox.className = type === "success" ? "success" : "error";
    messageBox.classList.remove("hidden");

    // Ocultar a mensagem após 3 segundos
    setTimeout(() => {
        messageBox.classList.add("hidden");
    }, 3000);
}

async function loadAnimals() {
    try {
        const response = await fetch(API_URL);
        const animals = await response.json();

        const list = document.getElementById("animal-list");
        list.innerHTML = "";
        animals.forEach(animal => {
            list.innerHTML += `
                <tr>
                    <td>${animal.id}</td>
                    <td>${animal.nome}</td>
                    <td>${animal.especie}</td>
                    <td>${animal.genero}</td>
                    <td>${animal.idade}</td>
                    <td>
                        <button onclick="editAnimal(${animal.id})">Editar</button>
                        <button onclick="deleteAnimal(${animal.id})">Excluir</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Erro ao carregar os animais:", error);
        showMessage("Erro ao carregar a lista de animais.", "error");
    }
}

async function handleSubmit(event) {
    event.preventDefault();

    const id = document.getElementById("animal-id").value;
    const nome = document.getElementById("nome").value;
    const especie = document.getElementById("especie").value;
    const genero = document.getElementById("genero").value;
    const idade = document.getElementById("idade").value;

    const animal = { nome, especie, genero, idade: parseInt(idade) };

    try {
        let response;
        if (id) {
            // Update
            response = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(animal),
            });
        } else {
            // Create
            response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(animal),
            });
        }

        if (response.ok) {
            showMessage("Cadastrado com sucesso!", "success");
            document.getElementById("animal-form").reset();
            loadAnimals();
        } else {
            showMessage("Erro ao cadastrar. Verifique os dados.", "error");
        }
    } catch (error) {
        console.error("Erro:", error);
        showMessage("Erro ao conectar com o servidor.", "error");
    }
}

async function editAnimal(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const animal = await response.json();

        document.getElementById("animal-id").value = animal.id;
        document.getElementById("nome").value = animal.nome;
        document.getElementById("especie").value = animal.especie;
        document.getElementById("genero").value = animal.genero;
        document.getElementById("idade").value = animal.idade;
    } catch (error) {
        console.error("Erro ao carregar os dados do animal:", error);
        showMessage("Erro ao carregar os dados do animal.", "error");
    }
}

async function deleteAnimal(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (response.ok) {
            showMessage("Animal excluído com sucesso!", "success");
            loadAnimals();
        } else {
            showMessage("Erro ao excluir o animal.", "error");
        }
    } catch (error) {
        console.error("Erro ao excluir o animal:", error);
        showMessage("Erro ao conectar com o servidor.", "error");
    }
}

