import express from "express"
import prisma from "../utils/prisma.js"
import { Prisma } from "@prisma/client"
import bcrypt from "bcryptjs"
import { validateLogin } from "../validators/auth.js"
import { filtered } from "../utils/common.js"
import { signAccessToken } from "../utils/jwt.js"
const router = express.Router()


// POST sign in endpoint
router.post('/',async (req,res) => {
    const data = req.body;
    console.log(data)
    const validationErrors = validateLogin(data)
  
    if (Object.keys(validationErrors).length != 0) return res.status(401).send({
      error: validationErrors
    })
  
    const user = await prisma.user.findUnique({
      where: {
        email: data.email
      } 
    
  });
  //user not found return error message
  if (!user) return res.status(401).send({
    error: 'Email address or password not valid'
  }) 
  
  //if found,compare passwords
  const checkPassword = bcrypt.compareSync(data.password, user.password)
  
  // If password does not match, return error
  if (!checkPassword) return res.status(401).send({ 
    error: 'Email address or password not valid' 
  })
  
  // If email and password are correct, return success
  const userFiltered = filtered(user, 'id', 'name', 'email')
    const accessToken = await signAccessToken(userFiltered)
    const userId = user.id
    return res.json({ accessToken,userId })
  })
  
  
  export default router