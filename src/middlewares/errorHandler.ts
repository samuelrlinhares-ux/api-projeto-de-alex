import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Verifica se há um ID de usuário na sessão
    if (req.session && (req.session as any).usuarioId) {
        // Se sim, o usuário está autenticado, prossegue para a próxima rota/middleware
        return next();
    }
    // Se não, redireciona para a página de login
    res.redirect('/auth/login');
};
