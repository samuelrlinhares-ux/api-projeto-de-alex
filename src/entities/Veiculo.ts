export class Veiculo {
    private _id: number;
    private _modelo: string;
    private _placa: string;
    private _clienteId: number;
    private _imagem?: string;

    constructor(
        id: number,
        modelo: string,
        placa: string,
        clienteId: number,
        imagem?: string
    ) {
        this._id = id;
        this._modelo = modelo;
        this._placa = placa;
        this._clienteId = clienteId;
        this._imagem = imagem;

        this.validar();
    }

    get id(): number {
        return this._id;
    }

    get modelo(): string {
        return this._modelo;
    }

    set modelo(valor: string) {
        this._modelo = valor;
        this.validar();
    }

    get placa(): string {
        return this._placa;
    }

    set placa(valor: string) {
        this._placa = valor;
        this.validar();
    }

    get clienteId(): number {
        return this._clienteId;
    }

    set clienteId(valor: number) {
        this._clienteId = valor;
    }

    get imagem(): string | undefined {
        return this._imagem;
    }

    set imagem(valor: string | undefined) {
        this._imagem = valor;
    }

    validar(): void {
        if (!this._modelo || this._modelo.trim().length < 2) {
            throw new Error(
                "O modelo do veículo deve ter pelo menos 2 caracteres."
            );
        }

        if (!this._placa || this._placa.trim().length !== 7) {
            throw new Error(
                "A placa do veículo deve ter exatamente 7 caracteres."
            );
        }
    }

    toJSON() {
        return {
            id: this._id,
            modelo: this._modelo,
            placa: this._placa,
            clienteId: this._clienteId,
            imagem: this._imagem
        };
    }

    static fromJSON(dados: any): Veiculo {
        return new Veiculo(
            dados.id,
            dados.modelo,
            dados.placa,
            dados.clienteId,
            dados.imagem
        );
    }
}