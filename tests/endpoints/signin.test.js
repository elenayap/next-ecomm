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



//create signup endpoint
describe("POST /users", () => {
    const user = {
        name: 'Alex',
        email: 'alex9@example.com',
        password: 'insecure',
      }

//create wrong signin
//    const wrongSignIn = {
//      name: 'Alex',
//      email: 'alex123@example.com',
//      password: 'insecure',
//    }

//create correct signin
// const signIn = {
//     email: 'john9@example.com',
//     password: 'insecure',
// }

//clear test database before test
  beforeAll(async () => {
    await cleanupDatabase()

  })
//clear test database after test
  afterAll(async () => {
    await cleanupDatabase()
  })

//1. inside the test, create a user using signup endpoint 
// then test signin endpoint to make sure accessToken returned

// run test case: positive scenario accessToken returned
it("with accessToken correct return", async () => {
    await request(app) //make http request
      .post("/users")
      .send(user) //send object as payload
      .set('Accept', 'application/json') //expecting json respond

//test sign in endpoint
      const response = await request(app)
      .post("/auth")
      .send(user) 
      .set('Accept', 'application/json')
      expect(response.statusCode).toBe(200);
      expect(response.body.accessToken).toBeTruthy(); // Check if accessToken exist
  });

// 2. create a user using sign up endpoint then test signin endpoint with a wrong email 
//to makesure it returns 401 and does not return accessToken
// run test case: failed scenario wrong email receive error 401 'Email address or password not valid' 
it("with wrong email should fail return 401", async () => {
    user.email = "alex123example.com"
    await request(app) //make http request
    .post("/users")
    .send(user) //send object as payload
    .set('Accept', 'application/json') //expecting json respond

    const response = await request(app)
      .post("/auth")
      .send(user)
      .set('Accept', 'application/json')
      expect(response.statusCode).toBe(401);
      expect(response.body.accessToken).toBeFalsy;
      expect(response.body.error.email).toBe('is invalid');
    });

//3. create user using sign up endpoint then test signin endpoint with wrong password to make sure it doesnt work
// run test case: failed scenario wrong password receive error 401 'Email address or password not valid' 
it("with wrong password should fail", async () => {
    user.password = ""
    await request(app) //make http request
    .post("/users")
    .send(user) //send object as payload
    .set('Accept', 'application/json') //expecting json respond

    const response = await request(app)
      .post("/auth")
      .send(user)
      .set('Accept', 'application/json')
      expect(response.statusCode).toBe(401);
      expect(response.body.error.password).toBe('cannot be blank');
    });



})