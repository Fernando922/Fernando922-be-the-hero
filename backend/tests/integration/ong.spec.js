const request = require("supertest");
const app = require("../../src/app");
const connection = require("../../src/database/connection");

describe("ONG", () => {
  beforeEach(async () => {
    await connection.migrate.rollback(); //importante desfazer todas as migrations antes! evite lotação desnecessária
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("should be able to create a new ONG, authentication,  new case, and delete this case", async () => {
    const newOng = await request(app)
      .post("/ongs")
      .send({
        name: "APAD22",
        email: "email@mailapad.com",
        whatsapp: "16994153565",
        city: "Franca",
        uf: "SP"
      });

    expect(newOng.body).toHaveProperty("id");
    expect(newOng.body.id).toHaveLength(8);

    //session test
    const sessionResponse = await request(app)
      .post("/sessions")
      .send({
        id: newOng.body.id
      });
    expect(sessionResponse.body).toHaveProperty("name");

    //new case add test
    const newCaseResponse = await request(app)
      .post("/incidents")
      .set("Authorization", newOng.body.id)
      .send({
        title: "titulo do caso",
        description: "é um caso bem da hora",
        value: "120"
      });

    expect(newCaseResponse.body).toHaveProperty("id");

    // delete case
    const deleteCase = await request(app)
      .delete(`/incidents/${newCaseResponse.body.id}`)
      .set("Authorization", newOng.body.id);


    expect(deleteCase.statusCode === 204)
  });
});
