import users from "../DB/db.js";

function authentication(req, res, next) {
    const { email, senha } = req.body;

    const usersAutentic = users.find(
        user => user.senha === senha && user.email === email
    );

    if (!usersAutentic) {
        return res.status(401).json({ message: "Credenciais inválidas" });
    }
    req.user = usersAutentic;
    next();
}

function registerUser(req, res, next) {
    const { nome, email, senha } = req.body;

    const useRegister = users.some(user => user.email === email);

    if (useRegister) {
        return res
            .status(400)
            .json({ message: "Esse email já está cadastrado" });
    }
    const id = users.length + 1;
    const newUser = {
        id: id,
        nome: nome,
        email: email,
        senha: senha,
        tarefas: []
    };

    users.push(newUser);
    res.status(201).json({ message: "Sucesso, gora faça login" });
    next();
}

export { authentication, registerUser };
