import request from "supertest";
import app from "../src/app";

describe(" Veículos", () => {

  it("Cadastrar veículo", async () => {
    const res = await request(app)
      .post("/veiculos")
      .send({
        placa: "ABC1D23",
        modelo: "Gol",
        marca: "Volkswagen",
        ano: 2020,
        clienteId: 1
      });

    expect(res.statusCode).toBe(201);
  });

  it("Listar veículos", async () => {
    const res = await request(app).get("/veiculos");

    expect(res.statusCode).toBe(200);
  });

  it("Editar veículo", async () => {
    const res = await request(app)
      .put("/veiculos/1")
      .send({
        modelo: "Gol G7"
      });

    expect(res.statusCode).toBe(200);
  });

  it("Excluir veículo", async () => {
    const res = await request(app)
      .delete("/veiculos/1");

    expect(res.statusCode).toBe(200);
  });

});