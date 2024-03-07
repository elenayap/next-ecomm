import express from "express"
import prisma from "./src/utils/prisma.js"
import { Prisma } from "@prisma/client"
import bcrypt from "bcryptjs"
import cors from "cors"
import { signAccessToken } from "./src/utils/jwt.js"
// import { filter } from '../utils/common.js'
import userRouter from "./src/controllers/users.controllers.js"
import authRouter from "./src/controllers/auth.controllers.js"
import morgan from "morgan"
import auth from "./src/middlewares/auth.js" 
import imageRouter from "./src/controllers/image.controllers.js"

const app = express();
// const port = process.env.PORT || 8080



// app.use(cors(corsOptions));
app.use(express.json());
app.use(cors());// Use CORS middleware
app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/image', imageRouter);

app.use(morgan('combined'));

app.get('/protected', auth, (req, res) => {
    res.json({ "hello": "world" })
  })
//view all users endpoint
// app.get('/', async (req, res) => {
//   const allUsers = await prisma.user.findMany()
//   res.json(allUsers)
// })

//sign-in endpoint
// function validateLogin(input) {
//   const validationErrors = {}

//   if (!('email' in input) || input['email'].length == 0) {
//     validationErrors['email'] = 'cannot be blank'
//   }

//   if (!('password' in input) || input['password'].length == 0) {
//     validationErrors['password'] = 'cannot be blank'
//   }

//   if ('email' in input && !input['email'].match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
//     validationErrors['email'] = 'is invalid'
//   }

//   return validationErrors
// }




// function validateUser(input) {
//   const validationErrors = {}

//   if (!('name' in input) || input['name'].length == 0) {
//     validationErrors['name'] = 'cannot be blank'
//   }

//   if (!('email' in input) || input['email'].length == 0) {
//     validationErrors['email'] = 'cannot be blank'
//   }

//   if (!('password' in input) || input['password'].length == 0) {
//     validationErrors['password'] = 'cannot be blank'
//   }

//   if ('password' in input && input['password'].length < 8) {
//     validationErrors['password'] = 'should be at least 8 characters'
//   }


//   if ('email' in input && !input['email'].match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
//     validationErrors['email'] = 'is invalid'
//   }

//   return validationErrors
// }


// function filtered(user) {
//   const { id, name, email } = user;
//   return { id, name, email };
// }

//create user endpoint
// app.post('/users', async (req, res) => {
//   const data = req.body;
//   const validationErrors = validateUser(data);

//   if (Object.keys(validationErrors).length != 0) return res.status(400).send({
//     error: validationErrors
//   });

// // add hashing
//   data.password = bcrypt.hashSync(data.password, 8);
//   prisma.user.create({
//     data
//   }).then(user => {
//     // If created correct, return success
//     return res.json(filtered(user, 'id', 'name', 'email'));

//   }).catch(err => {
//     if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
//       const formattedError = {}
//       formattedError[`${err.meta.target[0]}`] = 'already taken'

//       return res.status(500).send({
//         error: formattedError
//       });  // friendly error handling
//     }
//     throw err  // if this happens, our backend application will crash and not respond to the client. because we don't recognize this error yet, we don't know how to handle it in a friendly manner. we intentionally throw an error so that the error monitoring service we'll use in production will notice this error and notify us and we can then add error handling to take care of previously unforeseen errors.
//   })
// })

// POST sign in endpoint
// app.post('/auth',async (req,res) => {
//   const data = req.body;
//   console.log(data)
//   const validationErrors = validateLogin(data)

//   if (Object.keys(validationErrors).length != 0) return res.status(401).send({
//     error: validationErrors
//   })

//   const user = await prisma.user.findUnique({
//     where: {
//       email: data.email
//     } 
  
// });
// //user not found return error message
// if (!user) return res.status(401).send({
//   error: 'Email address or password not valid'
// }) 

// //if found,compare passwords
// const checkPassword = bcrypt.compareSync(data.password, user.password)

// // If password does not match, return error
// if (!checkPassword) return res.status(401).send({ 
//   error: 'Email address or password not valid' 
// })

// // If email and password are correct, return success
// const userFiltered = filtered(user, 'id', 'name', 'email')
//   const accessToken = await signAccessToken(userFiltered)
//   const userId = user.id
//   return res.json({ accessToken,userId })
// })


export default app // added this for test

// Start the server
// app.listen(port, () => {
//   console.log(`App started; listening on port ${port}`)
// });