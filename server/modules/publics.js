import express from "express";
import { authentication, registerUser } from "./private.js";
import users from "../DB/db.js";
const route = express.Router();

//rota de login
route.post("/login", authentication, (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (err) {
        console.error(`Erro Inesperado: ${err}`);
        res.status(401).json({ message: "O servidor não está respondendo" });
    }
});

//rota de cadastro
route.post("/cadastro", registerUser);

//rota de testes
route.get("/", (req, res) => {
    res.json(users);
});

//cadastra nova tarefa
route.post("/tarefa/cadastro", authentication, (req, res) => {
    try {
        const { content, status } = req.body;
        if (!content) {
            return res
                .status(400)
                .json({ message: "O conteúdo é obrigatório" });
        }
        const id = req.user.tarefas.length + 1;

        const newTafera = { id, content, status };

        req.user.tarefas.push(newTafera);
        res.status(201).json(req.user.tarefas); // Envia a lista atualizada
    } catch (err) {
        console.error(err);
    }
});

//Retorna tarefas
route.post("/tarefas", authentication, (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({ message: "Usuario não encontrado " });
        }
        if (req.user.tarefas.length === 0) {
            return res
                .status(400)
                .json({ message: "Usuario não possuí tarefas ainda" });
        }
        const tarefas = req.user.tarefas;
        res.status(201).json(tarefas);
    } catch (err) {
        res.status(404).json({ message: "Servidor não está respondendo" });
        console.log(`Erro Inesperado: ${err}`);
    }
});

//Rota atualizar status das tarefas
route.put("/tarefas/update", authentication, (req, res) => {
    try {
        const { id, status } = req.body;

        if (req.user.tarefas.length > 0) {
            const task = req.user.tarefas.find(tarefa => tarefa.id === id);

            if (task) {
                task.status = `${status}`;
                return res
                    .status(201)
                    .json({ message: `Tarefa ${task.status}` });
            }
        }
    } catch (err) {
        console.log(err);
    }
});

//rota de deleção de tarefas
route.put("/tarefa/delete/:id", authentication, (req, res) => {
    try {
        const id = Number(req.params.id);

        const task = req.user.tarefas.findIndex(tarefa => tarefa.id === id);

        if (req.user) {
            if (task > -1) {
                req.user.tarefas.splice(task, 1);
                res.status(200).json({ message: "Tarefa excluída" });
            } else {
                res.status(400).json({ message: "Tarefa não encontrada" });
            }
        } else {
            res.status(401).json({ message: "Dados inconsistentes" });
        }
    } catch (err) {
        console.log(err);
    }
});

export default route;
