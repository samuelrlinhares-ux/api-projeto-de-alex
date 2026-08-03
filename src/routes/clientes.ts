import { Router } from 'express';
import { ClienteRepository } from '../models/ClienteRepository';
import { Cliente } from '../entities/Cliente'
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const clienteRepo = new ClienteRepository();

// Listar todos os clientes (página EJS)
router.get('/', authMiddleware, (req, res) => {
    const termoBusca = req.query.busca as string || '';
    let clientes = clienteRepo.listar();
    if (termoBusca) {
        clientes = clienteRepo.buscar(termoBusca);
    }
    res.render('clientes/index', { clientes, termoBusca });
});

// Exibir formulário para novo cliente
router.get('/novo', authMiddleware, (req, res) => {
    res.render('clientes/novo', { cliente: null, erro: null });
});

// Criar um novo cliente
router.post('/', authMiddleware, (req, res) => {
    try {
        const { nome, telefone, email, endereco } = req.body;
        const novoCliente = new Cliente(0, nome, telefone, email, endereco); // ID será gerado no repositório
        clienteRepo.criar(novoCliente);
        res.redirect('/clientes');
    } catch (error: any) {
        res.render('clientes/novo', { cliente: req.body, erro: error.message });
    }
});

// Exibir detalhes de um cliente
router.get('/:id', authMiddleware, (req, res) => {
    const cliente = clienteRepo.buscarPorId(parseInt(req.params.id));
    if (cliente) {
        res.render('clientes/detalhes', { cliente });
    } else {
        res.status(404).send('Cliente não encontrado');
    }
});

// Exibir formulário para editar cliente
router.get('/:id/editar', authMiddleware, (req, res) => {
    const cliente = clienteRepo.buscarPorId(parseInt(req.params.id));
    if (cliente) {
        res.render('clientes/editar', { cliente, erro: null });
    } else {
        res.status(404).send('Cliente não encontrado');
    }
});

// Atualizar um cliente existente
router.post('/:id', authMiddleware, (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { nome, telefone, email, endereco } = req.body;
        const sucesso = clienteRepo.atualizar(id, { nome, telefone, email, endereco });
        if (sucesso) {
            res.redirect('/clientes');
        } else {
            res.status(404).send('Cliente não encontrado para atualização');
        }
    } catch (error: any) {
        const cliente = clienteRepo.buscarPorId(parseInt(req.params.id));
        res.render('clientes/editar', { cliente: { ...cliente?.toJSON(), ...req.body }, erro: error.message });
    }
});

// Excluir um cliente
router.post('/:id/excluir', authMiddleware, (req, res) => {
    const id = parseInt(req.params.id);
    const sucesso = clienteRepo.excluir(id);
    if (sucesso) {
        res.redirect('/clientes');
    } else {
        res.status(404).send('Cliente não encontrado para exclusão');
    }
});

export default router;
