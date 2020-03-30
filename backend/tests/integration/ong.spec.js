const request = require("supertest");
const app = require("../../src/app");
const connection = require("../../src/database/connection");

describe("ONG", () => {
  const newDatabase = async () => {
    await connection.migrate.rollback(); //importante desfazer todas as migrations antes! evite lotação desnecessária
    await connection.migrate.latest();
  };

  const killConnections = async () => {
    await connection.destroy();
  };

  beforeEach(async () => {
    await newDatabase();
  });

  afterAll(async () => {
    await killConnections();
  });

  const createOng = async () => {
    const newOng = await request(app)
      .post("/ongs")
      .send({
        name: "ong teste",
        email: "email@mailapad.com",
        whatsapp: "16994156655",
        city: "Franca",
        uf: "SP"
      });
    return newOng;
  };

  const createCase = async () => {
    const ong = await createOng();
    const newCase = await request(app)
      .post("/incidents")
      .set("Authorization", ong.body.id)
      .send({
        title: "Bootcamp",
        description: "preciso de dinheiro pra bancar o bootcamp GoStack",
        value: "1900"
      });
    return { newCase, ong };
  };

  it("should be able to create a new ONG", async () => {
    const newOng = await createOng();
    expect(newOng.body).toHaveProperty("id");
    expect(newOng.body.id).toHaveLength(8);
  });

  it("should be able to authenticate an ong", async () => {
    const newOng = await createOng();
    const sessionResponse = await request(app)
      .post("/sessions")
      .send({
        id: newOng.body.id
      });
    expect(sessionResponse.body).toHaveProperty("name");
  });

  it("should be able to create a case", async () => {
    const { newCase } = await createCase();
    expect(newCase.body).toHaveProperty("id");
  });

  it("should be able to delete a case", async () => {
    const { newCase, ong } = await createCase();
    const deleteCase = await request(app)
      .delete(`/incidents/${newCase.body.id}`)
      .set("Authorization", ong.body.id);
    expect(deleteCase.status).toEqual(204)
  });
});
