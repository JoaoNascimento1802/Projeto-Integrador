document.addEventListener("DOMContentLoaded", function() {
    const showAddAnimalFormButton = document.getElementById("showAddAnimalForm");
    const addAnimalFormContainer = document.getElementById("addAnimalFormContainer");
    const cancelButton = document.getElementById("cancelButton");

    // Função para mostrar o formulário de adicionar animal
    showAddAnimalFormButton.addEventListener("click", function() {
        addAnimalFormContainer.classList.remove("hidden"); // Mostra o formulário
        document.querySelector(".animal-list-section").classList.add("hidden"); // Esconde a lista de animais
    // Limpa o formulário ao abrir
        document.getElementById('animal-form').reset();
        document.getElementById('message-box').classList.add('hidden'); // Esconde mensagens
    });

    // Função para cancelar e voltar à lista de animais
    cancelButton.addEventListener("click", function() {
        addAnimalFormContainer.classList.add("hidden"); // Esconde o formulário
        document.querySelector(".animal-list-section").classList.remove("hidden"); // Mostra a lista de animais
    });
});
