import { PrismaClient, Prisma } from '@prisma/client'
import request from "supertest"
import app from "../../app.js"

//create a fucntion to clean test database
async function cleanupDatabase() {
  const prisma = new PrismaClient();
  const modelNames = Prisma.dmmf.datamodel.models.map((model) => model.name);

  return Promise.all(
    modelNames.map((modelName) => prisma[modelName.toLowerCase()].deleteMany())
  );
}

// declare which endpoint to use (create user endpoint)
describe("POST /users", () => {
  const user = {
    name: 'John',
    email: 'john9@example.com',
    password: 'insecure',
  }
//clear test database before test
  beforeAll(async () => {
    await cleanupDatabase()

  })
//clear test database after test
  afterAll(async () => {
    await cleanupDatabase()
  })

//run test case: positive scenario all correct return 200
it("with valid data should return 200", async () => {
    const response = await request(app) //make http request
      .post("/users")
      .send(user) //send object as payload
      .set('Accept', 'application/json') //expecting json respond

      //expect response to what we hard code
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBeTruthy;
    expect(response.body.name).toBe(user.name);
    expect(response.body.email).toBe(user.email);
    expect(response.body.password).toBe(undefined);
  });


// run test case: failed scenario same email receive error 'already taken'
it("with same email should fail", async () => {
    const response = await request(app)
      .post("/users")
      .send(user)
      .set('Accept', 'application/json')
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBeTruthy;
    expect(response.body.error.email).toBe('already taken');
  });

// run test case: failed scenario invalid password receive error 'should be at least 8 characters'
it("with invalid password should fail", async () => {
    user.email = "unique@example.com"
    user.password = "short"
    const response = await request(app)
      .post("/users")
      .send(user)
      .set('Accept', 'application/json')
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBeTruthy;
    expect(response.body.error.password).toBe('should be at least 8 characters');
  });

//run test case: failed when email is invalid format receive error 'is invalid'
it("with invalid email format should fail", async () => {
    user.email = "_com.";
    const response = await request(app)
      .post("/users")
      .send(user)
      .set('Accept', 'application/json')
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBeTruthy;
    expect(response.body.error.email).toBe('is invalid');
});

//run test case: failed when name is blank receive error 'cannot be blank'
it("with invalid email format should fail", async () => {
    user.name="";
    const response = await request(app)
      .post("/users")
      .send(user)
      .set('Accept', 'application/json')
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBeTruthy;
    expect(response.body.error.name).toBe('cannot be blank');
});
})