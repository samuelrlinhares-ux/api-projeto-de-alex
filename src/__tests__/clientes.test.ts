import request from "supertest";
import app from "../src/app";

describe(" Clientes", () => {

  it("Deve cadastrar um cliente", async () => {
    const res = await request(app)
      .post("/clientes")
      .send({
        nome: "João Silva",
        telefone: "(84)99999-9999",
        email: "joao@email.com"
      });

    expect(res.statusCode).toBe(201);
  });

  it("Deve listar todos os clientes", async () => {
    const res = await request(app).get("/clientes");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("Deve atualizar um cliente", async () => {
    const res = await request(app)
      .put("/clientes/1")
      .send({
        nome: "João Pedro"
      });

    expect(res.statusCode).toBe(200);
  });

  it("Deve excluir um cliente", async () => {
    const res = await request(app)
      .delete("/clientes/1");

    expect(res.statusCode).toBe(200);
  });

});