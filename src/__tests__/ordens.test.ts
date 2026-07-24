import request from "supertest";
import app from "../src/app";

describe(" Ordens de Serviço", () => {

  it("Criar ordem de serviço", async () => {
    const res = await request(app)
      .post("/ordens")
      .send({
        clienteId: 1,
        veiculoId: 1,
        descricao: "Troca de óleo",
        valor: 180
      });

    expect(res.statusCode).toBe(201);
  });

  it("Listar ordens", async () => {
    const res = await request(app).get("/ordens");

    expect(res.statusCode).toBe(200);
  });

  it("Atualizar status da ordem", async () => {
    const res = await request(app)
      .put("/ordens/1")
      .send({
        status: "Concluído"
      });

    expect(res.statusCode).toBe(200);
  });

  it("Excluir ordem", async () => {
    const res = await request(app)
      .delete("/ordens/1");

    expect(res.statusCode).toBe(200);
  });

});