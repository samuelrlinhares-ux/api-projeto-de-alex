import request from "supertest";
import app from "../src/app";

describe("🔐 Autenticação", () => {

  it("Deve realizar login com sucesso", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "admin@oficina.com",
        senha: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("Não deve permitir login com senha incorreta", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "admin@oficina.com",
        senha: "senhaerrada"
      });

    expect(res.statusCode).toBe(401);
  });

  it("Não deve permitir login sem preencher os campos", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({});

    expect(res.statusCode).toBe(400);
  });

});