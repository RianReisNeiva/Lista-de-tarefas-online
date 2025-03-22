const users = [
    {
        id: 1,
        nome: "Sergio",
        email: "sergio@gmail.com",
        senha: "12345",
        tarefas: [
            { id: 1, content: "comprar pão", status: "Em andamento" },
            { id: 2, content: "estudar", status: "Em andamento" }
        ]
    },
    {
        id: 2,
        nome: "Maria",
        email: "mariaave@gmail.com",
        senha: "54321",
        tarefas: [{ id: 1, content: "limpar a casa", status: "Em andamento" }]
    }
];

export default users;
