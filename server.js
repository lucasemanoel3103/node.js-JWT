import express from 'express';
import jwt from 'jsonwebtoken'; 
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const SECRET_KEY = process.env.SECRET;

app.use(express.json());

const users = [
    { id: 1, username: 'Lucas', password: '3103Lucas@', role: 'admin' },
    { id: 2, username: 'Felipe', password: '3103Lucas@', role: 'user' },
];

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    const user = users.find(user => user.username === username);
    if(user) {
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ message: token });  
    } else { 
       res.status(401).json({ message: 'Usuário ou senha inválida!' });
    }
})

// Middleware para autenticação de token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if(!token) return res.status(403).json ({ message: 'Token não fornecido!' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if(err) return res.status(403).json({ message: 'Token inválido!' });
        req.user = user;
        next()
    })
};

// Rota Autenticada
app.get('/protected', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Acesso permitido!'});
});

//Rota autenticada e privada para o usuario admin
app.get('/admin', authenticateToken, (req, res) => {
    if(req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado!' });
    }
    res.status(200).json({ message: 'Bem-vindo ao painel de admin!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});