import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack); // Loga o erro no console do servidor

    // Define o status HTTP e a mensagem de erro
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Se o status ainda for 200, define como 500 (erro interno do servidor)
    res.status(statusCode);

    // Responde com JSON para requisições de API ou renderiza uma página de erro para requisições de página
    if (req.accepts('html')) {
        res.render('error', { message: err.message, error: process.env.NODE_ENV === 'production' ? {} : err });
    } else {
        res.json({ message: err.message, stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack });
    }
};