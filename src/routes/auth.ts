// Gerencia as rotas de autenticação, incluindo login, registro e logout.
import { Router } from 'express';
import bcrypt from 'bcrypt';
import { UsuarioRepository } from '../models/UsuarioRepository';
import { Usuario } from '../entities/Usuario';

const router = Router();
const usuarioRepo = new UsuarioRepository();

// Rota para exibir o formulário de login
router.get('/login', (req, res) => {
    res.render('auth/login', { erro: req.query.erro });
});

// Rota para processar o login
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    const usuario = usuarioRepo.buscarPorEmail(email);

    if (usuario && await usuario.verificarSenha(senha)) {
        (req.session as any).usuarioId = usuario.id;
        return res.redirect('/clientes'); // Redireciona para a página de clientes após o login
    }
    res.render('auth/login', { erro: 'E-mail ou senha inválidos.' });
});

// Rota para exibir o formulário de registro
router.get('/registro', (req, res) => {
    res.render('auth/registro', { erro: null });
});

// Rota para processar o registro de um novo usuário
router.post('/registro', async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
        if (usuarioRepo.buscarPorEmail(email)) {
            return res.render('auth/registro', { erro: 'E-mail já cadastrado.' });
        }
        const novoUsuario = new Usuario(0, nome, email, ''); // ID será gerado no repositório
        await novoUsuario.setSenha(senha);
        await usuarioRepo.criar(novoUsuario);
        res.redirect('/auth/login?sucesso=true');
    } catch (error: any) {
        res.render('auth/registro', { erro: error.message });
    }
});

// Rota para logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao destruir sessão:', err);
        }
        res.redirect('/auth/login');
    });
});

export default router;
