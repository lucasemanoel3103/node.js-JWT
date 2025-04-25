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
    } else { 
       res.status(401).json({ message: 'Usuário ou senha inválida!' });
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});