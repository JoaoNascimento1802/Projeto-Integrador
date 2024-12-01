const API_URL = "https://projetoint-haf7a8ece2fygwg9.brazilsouth-01.azurewebsites.net/zoo";
const IMAGE_UPLOAD_URL = "https://projetoint-haf7a8ece2fygwg9.brazilsouth-01.azurewebsites.net/zoo/image/upload";

document.addEventListener("DOMContentLoaded", () => {
    loadAnimals();

    const form = document.getElementById("animal-form");
    form.addEventListener("submit", handleSubmit);

    const imageInput = document.getElementById("image");
    imageInput.addEventListener("change", previewImage);

    setInterval(loadAnimals, 5000); // Atualiza a lista a cada 5 segundos
});

function previewImage() {
    const file = document.getElementById("image").files[0];
    const preview = document.getElementById("image-preview");
    const previewContainer = document.getElementById("preview-container");

    if (file) {
        console.log("Arquivo selecionado:", file); // Log do arquivo
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            previewContainer.classList.remove("hidden");
        };
        reader.readAsDataURL(file);
    } else {
        preview.src = "";
        previewContainer.classList.add("hidden");
    }
}

async function handleSubmit(event) {
    event.preventDefault();

    const id = document.getElementById("animal-id").value; // Obter o ID do animal
    const nome = document.getElementById("nome").value;
    const especie = document.getElementById("especie").value;
    const genero = document.getElementById("genero").value;
    const idade = document.getElementById("idade").value;
    const imageFile = document.getElementById("image").files[0];

    // Validar campos obrigatórios
    if (!nome || !especie || !genero || !idade) {
        showMessage("Todos os campos são obrigatórios.", "error");
        return;
    }

    const animal = { nome, especie, genero, idade: parseInt(idade) };

    try {
        let response;
        if (id) {
            // Atualizar
            response = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(animal),
            });
        } else {
            // Criar
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
            showMessage("Operação realizada com sucesso!", "success");

            // Limpar os campos do formulário e ocultar a pré-visualização da imagem
            document.getElementById("animal-form").reset();
            document.getElementById("image-preview").src = "";
            document.getElementById("preview-container").classList.add("hidden");

            // Ocultar o formulário e mostrar a lista de animais
            document.getElementById("addAnimalFormContainer").classList.add("hidden");
            document.querySelector(".animal-list-section").classList.remove("hidden");

            loadAnimals(); // Atualiza a lista imediatamente
        } else {
            const errorMessage = await response.text();
            showMessage(`Erro ao cadastrar: ${errorMessage}`, "error");
        }
    } catch (error) {
        console.error("Erro:", error);
        showMessage("Erro ao conectar com o servidor.", "error");
    }
}

async function uploadImage(animalId, file) {
    const formData = new FormData();
    formData.append("file", file);
    console.log("FormData enviado:", formData); // Log do FormData

    try {
        const response = await fetch(`${IMAGE_UPLOAD_URL}/${animalId}`, {
            method: "POST",
            body: formData,
        });

        const responseData = await response.json(); // Tente obter a resposta
        console.log("Resposta do servidor:", responseData); // Log da resposta do servidor

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
        if (!response.ok) {
            throw new Error("Erro ao carregar a lista de animais.");
        }
        const animals = await response.json();

        const list = document.getElementById("animal-list");
        list.innerHTML = "";

        animals.forEach(animal => {
            list.innerHTML += `
                <tr>
                    <td>
                        <img src="${animal.imageURL || "placeholder.png"}" alt="Imagem do animal" style="max-width: 50px; max-height: 50px;">
                    </td>
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
    } catch (error) {
        console.error("Erro ao carregar animais:", error);
        showMessage("Erro ao carregar a lista de animais.", "error");
    }
}

function editAnimal(id) {
    fetch(`${API_URL}/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Animal não encontrado.");
            }
            return response.json();
        })
        .then(animal => {
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
        .catch(error => {
            console.error("Erro ao editar animal:", error);
            showMessage("Erro ao carregar os dados do animal.", "error");
        });
}

function deleteAnimal(id) {
    if (confirm("Tem certeza que deseja excluir este animal?")) {
        fetch(`${API_URL}/${id}`, { method: "DELETE" })
            .then(response => {
                if (response.ok) {
                    showMessage("Animal excluído com sucesso!", "success");
                    loadAnimals();
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
    if (messageBox) {
        messageBox.textContent = message;
        messageBox.className = type;
        messageBox.classList.remove("hidden");

        setTimeout(() => {
            messageBox.classList.add("hidden");
        }, 3000);
    } else {
        console.error("Elemento 'message-box' não encontrado.");
    }
}
