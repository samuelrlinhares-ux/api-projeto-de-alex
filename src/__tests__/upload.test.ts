import request from "supertest";
import path from "path";
import app from "../src/app";

describe(" Upload", () => {

  it("Enviar imagem do veículo", async () => {
    const res = await request(app)
      .post("/upload")
      .attach("imagem", path.resolve(__dirname, "carro.jpg"));

    expect([200, 201]).toContain(res.statusCode);
  });

  it("Não deve aceitar arquivo inválido", async () => {
    const res = await request(app)
      .post("/upload")
      .attach("imagem", path.resolve(__dirname, "arquivo.txt"));

    expect([400, 415]).toContain(res.statusCode);
  });

});