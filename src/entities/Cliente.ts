export class Cliente {
    private _id: number;
    private _nome: string;
    private _telefone: string;
    private _email: string;
    private _endereco?: string;

    constructor(id: number, nome: string, telefone: string, email: string, endereco?: string) {
        this._id = id;
        this._nome = nome;
        this._telefone = telefone;
        this._email = email;
        this._endereco = endereco;
        this.validar();
    }

    get id(): number { return this._id; }
    get nome(): string { return this._nome; }
    set nome(valor: string) { this._nome = valor; this.validar(); }
    get telefone(): string { return this._telefone; }
    set telefone(valor: string) { this._telefone = valor; }
    get email(): string { return this._email; }
    set email(valor: string) { this._email = valor; }
    get endereco(): string | undefined { return this._endereco; }
    set endereco(valor: string | undefined) { this._endereco = valor; }

    validar(): void {
        if (!this._nome || this._nome.length < 3) {
            throw new Error("O nome do cliente deve ter pelo menos 3 caracteres.");
        }
        if (this._email && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this._email)) {
            throw new Error("E-mail inválido.");
        }
    }

    toJSON() {
        return {
            id: this._id,
            nome: this._nome,
            telefone: this._telefone,
            email: this._email,
            endereco: this._endereco
        };
    }

    static fromJSON(dados: any): Cliente {
        return new Cliente(dados.id, dados.nome, dados.telefone, dados.email, dados.endereco);
    }
}
