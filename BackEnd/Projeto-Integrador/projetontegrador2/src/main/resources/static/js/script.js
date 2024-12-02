const API_URL = "https://projetoint-haf7a8ece2fygwg9.brazilsouth-01.azurewebsites.net/zoo";
const IMAGE_UPLOAD_URL = "https://projetoint-haf7a8ece2fygwg9.brazilsouth-01.azurewebsites.net/zoo/image/upload";
let isFiltered = false; // Variável para verificar se o filtro está ativo

document.addEventListener("DOMContentLoaded", () => {
    setupEventListeners();
    loadAnimals(); // Carrega a lista inicial de animais
    setInterval(() => {
        if (!isFiltered) loadAnimals(); // Atualiza a lista somente se não estiver filtrada
    }, 5000); // Atualiza a lista a cada 5 segundos
});

// Configura eventos
function setupEventListeners() {
    const form = document.getElementById("animal-form");
    form.addEventListener("submit", handleSubmit);

    const imageInput = document.getElementById("image");
    imageInput.addEventListener("change", previewImage);

    const filterForm = document.getElementById("filter-form");
    filterForm.addEventListener("submit", handleFilterSubmit);

    const clearFilterButton = document.getElementById("clear-filter");
    clearFilterButton.addEventListener("click", clearFilter); // Adiciona evento para remover filtro
}

// Pré-visualização da imagem
function previewImage() {
    const file = document.getElementById("image").files[0];
    const preview = document.getElementById("image-preview");
    const previewContainer = document.getElementById("preview-container");

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            previewContainer.classList.remove("hidden");
        };
        reader.readAsDataURL(file);
    } else {
        preview.src = "";
        previewContainer.classList.add("hidden");
    }
}

// Submissão do formulário de filtro
function handleFilterSubmit(event) {
    event.preventDefault();
    const species = document.getElementById("filter-species").value.trim();
    if (species) {
        isFiltered = true; // Marca que o filtro foi aplicado
        loadFilteredAnimals(species);
    } else {
        showMessage("Por favor, informe uma espécie para buscar.", "error");
    }
}

// Remove o filtro e recarrega todos os animais
function clearFilter() {
    isFiltered = false; // Reseta o estado do filtro
    document.getElementById("filter-form").reset(); // Limpa o campo de filtro
    loadAnimals(); // Recarrega a lista completa de animais
}

// Carrega a lista de animais
async function loadAnimals() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Erro ao carregar a lista de animais.");
        const animals = await response.json();
        populateAnimalList(animals);
    } catch (error) {
        console.error("Erro ao carregar animais:", error);
        showMessage("Erro ao carregar a lista de animais.", "error");
    }
}

// Popula a tabela com os animais
function populateAnimalList(animals) {
    const list = document.getElementById("animal-list");
    list.innerHTML = "";
    animals.forEach((animal) => {
        list.innerHTML += `
            <tr>
                <td><img src="${animal.imageURL || "placeholder.png"}" alt="Imagem do animal" style="max-width: 50px; max-height: 50px;"></td>
                <td>${animal.nome}</td>
                <td>${animal.especie}</td>
                <td>${animal.genero}</td>
                <td>${animal.idade}</td>
                <td>
                    <button class="edit" onclick="editAnimal(${animal.id})">Editar</button>
                    <button class="delete" onclick="deleteAnimal(${animal.id})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

// Submissão do formulário de cadastro
async function handleSubmit(event) {
    event.preventDefault();

    const id = document.getElementById("animal-id").value;
    const nome = document.getElementById("nome").value;
    const especie = document.getElementById("especie").value;
    const genero = document.getElementById("genero").value;
    const idade = parseInt(document.getElementById("idade").value, 10);
    const imageFile = document.getElementById("image").files[0];

    if (!nome || !especie || !genero || isNaN(idade)) {
        showMessage("Todos os campos são obrigatórios.", "error");
        return;
    }

    const animal = { nome, especie, genero, idade };

    try {
        const method = id ? "PUT" : "POST";
        const url = id ? `${API_URL}/${id}` : API_URL;

        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(animal),
        });

        if (response.ok) {
            const animalData = await response.json();
            if (imageFile) {
                await uploadImage(animalData.id, imageFile);
            }
            showMessage("Operação realizada com sucesso!", "success");

            // Redireciona para a tela de listagem de animais
            document.getElementById("addAnimalFormContainer").classList.add("hidden");
            document.querySelector(".animal-list-section").classList.remove("hidden");

            document.getElementById("animal-form").reset();
            document.getElementById("image-preview").src = "";
            document.getElementById("preview-container").classList.add("hidden");

            loadAnimals();
        } else {
            throw new Error(await response.text());
        }
    } catch (error) {
        console.error("Erro ao cadastrar animal:", error);
        showMessage("Erro ao cadastrar animal.", "error");
    }
}

// Faz upload da imagem
async function uploadImage(animalId, file) {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch(`${IMAGE_UPLOAD_URL}/${animalId}`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) throw new Error("Erro ao fazer upload da imagem.");
    } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        showMessage("Erro ao fazer upload da imagem.", "error");
    }
}

// Editar animal
function editAnimal(id) {
    fetch(`${API_URL}/${id}`)
        .then((response) => {
            if (!response.ok) throw new Error("Animal não encontrado.");
            return response.json();
        })
        .then((animal) => {
            document.getElementById("animal-id").value = animal.id;
            document.getElementById("nome").value = animal.nome;
            document.getElementById("especie").value = animal.especie;
            document.getElementById("genero").value = animal.genero;
            document.getElementById("idade").value = animal.idade;

            const preview = document.getElementById("image-preview");
            const previewContainer = document.getElementById("preview-container");

            if (animal.imageURL) {
                preview.src = animal.imageURL;
                previewContainer.classList.remove("hidden");
            } else {
                preview.src = "";
                previewContainer.classList.add("hidden");
            }

            document.getElementById("addAnimalFormContainer").classList.remove("hidden");
            document.querySelector(".animal-list-section").classList.add("hidden");
        })
        .catch((error) => {
            console.error("Erro ao editar animal:", error);
            showMessage("Erro ao carregar os dados do animal.", "error");
        });
}

// Excluir animal
function deleteAnimal(id) {
    if (confirm("Tem certeza que deseja excluir este animal?")) {
        fetch(`${API_URL}/${id}`, { method: "DELETE" })
            .then((response) => {
                if (response.ok) {
                    showMessage("Animal excluído com sucesso!", "success");
                    loadAnimals();
                } else {
                    throw new Error("Erro ao excluir animal.");
                }
            })
            .catch((error) => {
                console.error("Erro ao excluir animal:", error);
                showMessage("Erro ao excluir animal.", "error");
            });
    }
}

// Exibe mensagens de erro ou sucesso
function showMessage(message, type) {
    const messageBox = document.getElementById("message-box");
    if (messageBox) {
        messageBox.textContent = message;
        messageBox.className = type;
        messageBox.classList.remove("hidden");
        setTimeout(() => messageBox.classList.add("hidden"), 3000);
    }
}

// Carrega animais filtrados
function loadFilteredAnimals(species) {
    fetch(`${API_URL}/species/${encodeURIComponent(species)}`)
        .then((response) => {
            if (!response.ok) throw new Error("Nenhum animal encontrado.");
            return response.json();
        })
        .then((animals) => {
            populateAnimalList(animals);
        })
        .catch((error) => {
            console.error("Erro ao carregar animais filtrados:", error);
            showMessage(error.message, "error");
        });
}
