export class OrdemServico {
    private _id: number;
    private _veiculoId: number;
    private _descricao: string;
    private _status: string; // 'Pendente', 'Em Andamento', 'Concluído'

    constructor(id: number, veiculoId: number, descricao: string, status: string = 'Pendente') {
        this._id = id;
        this._veiculoId = veiculoId;
        this._descricao = descricao;
        this._status = status;
        this.validar();
    }

    get id(): number { return this._id; }
    get veiculoId(): number { return this._veiculoId; }
    set veiculoId(valor: number) { this._veiculoId = valor; }
    get descricao(): string { return this._descricao; }
    set descricao(valor: string) { this._descricao = valor; this.validar(); }
    get status(): string { return this._status; }
    set status(valor: string) { this._status = valor; this.validar(); }

    validar(): void {
        if (!this._descricao || this._descricao.length < 5) {
            throw new Error("A descrição da ordem de serviço deve ter pelo menos 5 caracteres.");
            
        }
        const statusValidos = ['Pendente', 'Em Andamento', 'Concluído'];
        if (!statusValidos.includes(this._status)) {
            throw new Error("Status da ordem de serviço inválido.");
        }
    }

    toJSON() {
        return {
            id: this._id,
            veiculoId: this._veiculoId,
            descricao: this._descricao,
            status: this._status
        };
    }

    static fromJSON(dados: any): OrdemServico {
        return new OrdemServico(dados.id, dados.veiculoId, dados.descricao, dados.status);
    }
}
