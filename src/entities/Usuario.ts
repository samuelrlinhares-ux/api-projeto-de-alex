import bcrypt from 'bcrypt';

export class Usuario {
    private _id: number;
    private _nome: string;
    private _email: string;
    private _senhaHash: string; // Armazena o hash da senha

    constructor(id: number, nome: string, email: string, senhaHash: string) {
        this._id = id;
        this._nome = nome;
        this._email = email;
        this._senhaHash = senhaHash;
        this.validar();
    }

    get id(): number { return this._id; }
    get nome(): string { return this._nome; }
    set nome(valor: string) { this._nome = valor; this.validar(); }
    get email(): string { return this._email; }
    set email(valor: string) { this._email = valor; this.validar(); }
    get senhaHash(): string { return this._senhaHash; }
    set senhaHash(valor: string) { this._senhaHash = valor; }

    validar(): void {
        if (!this._nome || this._nome.length < 3) {
            throw new Error("O nome do usuário deve ter pelo menos 3 caracteres.");
        }
        if (!this._email || !/^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$/.test(this._email)) {
            throw new Error("E-mail do usuário inválido.");
        }
    }

    async setSenha(senha: string): Promise<void> {
        this._senhaHash = await bcrypt.hash(senha, 10);
    }

    async verificarSenha(senha: string): Promise<boolean> {
        return bcrypt.compare(senha, this._senhaHash);
    }

    toJSON() {
        return {
            id: this._id,
            nome: this._nome,
            email: this._email,
            // NUNCA expor a senhaHash diretamente em JSON para o cliente
        };
    }

    static fromJSON(dados: any): Usuario {
        return new Usuario(dados.id, dados.nome, dados.email, dados.senhaHash);
    }
}
