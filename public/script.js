const connection = "http://localhost:8090/api/";
//Elementos de Cadastro e Login
const register = document.getElementById("register");
const login = document.getElementById("forme-login");
const cadastro = document.getElementById("forme-cadastro");
const deash = document.getElementById("deash");
let troca = true;

function loginOrCadastro() {
    if (troca) {
        login.style.display = "none";
        cadastro.style.display = "flex";
        troca = false;
    } else if (!troca) {
        login.style.display = "flex";
        cadastro.style.display = "none";
        troca = true;
    }
}

//Realiza o cadastro
document
    .getElementById("forme-cadastro")
    .addEventListener("submit", async event => {
        event.preventDefault();
        const nome = document.getElementById("nome-cadastro").value;
        const email = document.getElementById("email-cadastro").value;
        const senha = document.getElementById("senha-cadastro").value;

        const response = await fetch(`${connection}cadastro`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, email, senha })
        });

        const data = await response.json();

        if (data.message === "Sucesso, gora faça login") {
            troca = false;
            loginOrCadastro();
            document.getElementById("message-login").innerHTML = data.message;
            document.getElementById("message-login").style.color = "green";
        } else {
            document.getElementById("message-cadastro").innerHTML =
                data.message;
        }
    });

//Realiza o Login
document
    .getElementById("forme-login")
    .addEventListener("submit", async event => {
        event.preventDefault();
        const email = document.getElementById("email-login").value;
        const senha = document.getElementById("senha-login").value;

        const response = await fetch(`${connection}login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, senha })
        });
        const data = await response.json();
        atualizarTarefas();
        if (data.message) {
            document.getElementById("message-login").innerHTML = data.message;
            document.getElementById("message-login").style.color = "red";
        } else {
            dadosuser = data;
            deash.style.display = "block";
            register.style.display = "none";
            document.getElementById(
                "nome-print"
            ).innerHTML = `<b>Olá, ${data.nome}<b>`;
        }
    });

//Elementos de criação de novo card
let visibly = true;
const create = document.getElementById("create");
const cancelar = document.getElementById("cancelar");
function createVisi() {
    if (visibly) {
        create.style.display = "block";
        visibly = false;
    } else if (!visibly) {
        create.style.display = "none";
        visibly = true;
    }
}

cancelar.addEventListener("click", function () {
    create.style.display = "none";
    visibly = true;
});

//elemenos das tarefas
const painelTask = document.getElementById("tasks");

//cadastra uma nova tarefa
const createTask = document.getElementById("create-task");

createTask.addEventListener("click", async () => {
    let content = document.getElementById("content-create").value;

    const email = document.getElementById("email-login").value;
    const senha = document.getElementById("senha-login").value;
    let status = "Em andamento";

    const response = await fetch(`${connection}tarefa/cadastro`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, senha, content, status })
    });
    const data = await response.json();
    visibly = true;
    create.style.display = "none";
    if (data) {
        return await atualizarTarefas();
    }
});

//Retorna tarefas
async function atualizarTarefas() {
    const email = document.getElementById("email-login").value;
    const senha = document.getElementById("senha-login").value;

    const response = await fetch(`${connection}tarefas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
    });

    const data = await response.json();

    if (data.message) {
        document.getElementById("message-text").style.display = "flex";
        document.getElementById("message-text").innerHTML = data.message;
    } else {
        document.getElementById("message-text").style.display = "none";

        data.forEach(task => {
            if (data.length === 0) {
                return (document.getElementById("message-text").style.display =
                    "flex");
            }

            if (!document.querySelector(`[data-task-id="${task.id}"]`)) {
                const card = document.createElement("div");
                card.classList.add("task");
                card.setAttribute("data-task-id", task.id);

                const titulo = document.createElement("h2");
                titulo.classList.add("content");
                titulo.textContent = task.content;
                card.appendChild(titulo);

                const sts = document.createElement("span");
                sts.classList.add("status");
                sts.textContent = task.status;
                if (sts.textContent === "Em andamento") {
                    sts.style.color = "red";
                } else {
                    sts.style.color = "green";
                }
                card.appendChild(sts);

                const contentButtons = document.createElement("div");
                contentButtons.classList.add("buttons");
                card.appendChild(contentButtons);

                const conclude = document.createElement("button");
                conclude.classList.add("conclude");
                conclude.textContent = "Concluir";
                contentButtons.appendChild(conclude);

                const deleteBtn = document.createElement("button");
                deleteBtn.classList.add("delete");
                deleteBtn.textContent = "Excluir";
                contentButtons.appendChild(deleteBtn);
                painelTask.appendChild(card);
            }
        });
    }
}

//Concluir tarefa
document.addEventListener("click", async event => {
    const email = document.getElementById("email-login").value;
    const senha = document.getElementById("senha-login").value;

    if (event.target.classList.contains("conclude")) {
        // Encontra o elemento pai mais próximo com a classe "task"
        const taskElement = event.target.closest(".task");

        if (taskElement) {
            const taskId = taskElement.dataset.taskId; // Captura o data-task-id

            // Faz a requisição para atualizar o status da tarefa
            const response = await fetch(`${connection}tarefas/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: Number(taskId),
                    status: "Concluída",
                    email,
                    senha
                })
            });

            const data = await response.json();
            alert(data.message);

            // Atualiza o status visualmente
            const statusElement = taskElement.querySelector(".status");
            if (statusElement) {
                statusElement.textContent = "Concluída";
                statusElement.style.color = "green";
            }
        }
    }
});

//excluir tarefa
document.addEventListener("click", async event => {
    const email = document.getElementById("email-login").value;
    const senha = document.getElementById("senha-login").value;

    if (event.target.classList.contains("delete")) {
        // Encontra o elemento pai mais próximo com a classe "task"
        const taskElement = event.target.closest(".task");

        if (taskElement) {
            const taskId = taskElement.dataset.taskId; // Captura o data-task-id

            // Faz a requisição para atualizar o status da tarefa
            const response = await fetch(
                `${connection}tarefa/delete/${taskId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, senha })
                }
            );

            const data = await response.json();
            alert(data.message);
            if (data) {
                // Atualiza visualmente
                taskElement.remove();
                atualizarTarefas();
            }
        }
    }
});
