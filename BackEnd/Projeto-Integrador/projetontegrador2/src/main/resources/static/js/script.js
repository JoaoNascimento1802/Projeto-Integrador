const API_URL = "http://localhost:8080/zoo";
const IMAGE_UPLOAD_URL = "http://localhost:8080/zoo/image/upload"; // URL para upload da imagem

document.addEventListener("DOMContentLoaded", () => {
    loadAnimals();

    const form = document.getElementById("animal-form");
    form.addEventListener("submit", handleSubmit);

    const imageInput = document.getElementById("image");
    imageInput.addEventListener("change", previewImage);

    // Atualiza a lista de animais a cada 5 segundos
    setInterval(loadAnimals, 5000);
});

function previewImage() {
    const file = document.getElementById("image").files[0];
    const preview = document.getElementById("image-preview");
    const previewContainer = document.getElementById("preview-container");

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            previewContainer.classList.remove("hidden");
            preview.classList.remove("hidden");
        };
        reader.readAsDataURL(file);
    } else {
        previewContainer.classList.add("hidden");
    }
}

async function handleSubmit(event) {
    event.preventDefault();

    const id = document.getElementById("animal-id").value;
    const nome = document.getElementById("nome").value;
    const especie = document.getElementById("especie").value;
    const genero = document.getElementById("genero").value;
    const idade = document.getElementById("idade").value;
    const imageFile = document.getElementById("image").files[0];

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
            const animalData = await response.json();
            if (imageFile) {
                await uploadImage(animalData.id, imageFile);
            }
            showMessage(" Cadastrado com sucesso!", "success");

            // Limpar os campos do formulário e ocultar a pré-visualização da imagem
            document.getElementById("animal-form").reset();
            document.getElementById("image-preview").src = ""; // Limpa a pré-visualização
            document.getElementById("preview-container").classList.add("hidden"); // Oculta o container de pré-visualização

            loadAnimals(); // Atualiza a lista imediatamente após salvar
        } else {
            showMessage("Erro ao cadastrar. Verifique os dados.", "error");
        }
    } catch (error) {
        console.error("Erro:", error);
        showMessage("Erro ao conectar com o servidor.", "error");
    }
}

async function uploadImage(animalId, file) {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch(`${IMAGE_UPLOAD_URL}/${animalId}`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Erro ao fazer upload da imagem.");
        }
    } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        showMessage("Erro ao fazer upload da imagem.", "error");
    }
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
                    <td><img src="${animal.imagURL}" alt="Imagem do animal" style="max-width: 50px; max-height: 50px;"></td>
                    <td>
                        <button onclick="editAnimal(${animal.id})">Editar</button>
                        <button onclick="deleteAnimal(${animal.id})">Excluir</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Erro ao carregar animais:", error);
        showMessage("Erro ao carregar a lista de animais.", "error");
    }
}

function editAnimal(id) {
    // Função para carregar os dados do animal e preencher o formulário para edição
    fetch(`${API_URL}/${id}`)
        .then(response => response.json())
        .then(animal => {
            document.getElementById("animal-id").value = animal.id;
            document.getElementById("nome").value = animal.nome;
            document.getElementById("especie").value = animal.especie;
            document.getElementById("genero").value = animal.genero;
            document.getElementById("idade").value = animal.idade;
            document.getElementById("image-preview").src = animal.imagURL; // Exibe a imagem atual
            document.getElementById("preview-container").classList.remove("hidden"); // Mostra o container de pré-visualização

            // Limpa a seleção do arquivo de imagem para que o evento de pré-visualização funcione corretamente
            document.getElementById("image").value = "";
        })
        .catch(error => {
            console.error("Erro ao editar animal:", error);
            showMessage("Erro ao carregar os dados do animal.", "error");
        });
}

function deleteAnimal(id) {
    // Função para excluir um animal
    if (confirm("Tem certeza que deseja excluir este animal?")) {
        fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        })
            .then(response => {
                if (response.ok) {
                    showMessage("Animal excluído com sucesso!", "success");
                    loadAnimals(); // Atualiza a lista após a exclusão
                } else {
                    showMessage("Erro ao excluir o animal.", "error");
                }
            })
            .catch(error => {
                console.error("Erro ao excluir animal:", error);
                showMessage("Erro ao conectar com o servidor.", "error");
            });
    }
}

function showMessage(message, type) {
    const messageBox = document.getElementById("message-box");
    messageBox.textContent = message;
    messageBox.className = type; // Adiciona a classe correspondente ao tipo de mensagem
    messageBox.classList.remove("hidden");

    setTimeout(() => {
        messageBox.classList.add("hidden");
    }, 3000); // Oculta a mensagem após 3 segundos
}