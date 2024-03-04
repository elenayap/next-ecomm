import express from "express"
import prisma from "../utils/prisma.js"
import { Prisma } from "@prisma/client"


const router = express.Router()

//sign in user can upload image
router.post('/', async(req,res) => {
    const data = req.body;

    prisma.image.create({
        data: {
            userId: req.user.payload.id,
            ...data // ...data is using the spread syntax to include all properties of the data object into the new object
        }

    }).then(image => {
        return res.json(image);
    }).catch(err => {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
          const formattedError = {}
          formattedError[`${err.meta.target[0]}`] = 'already taken'
    
          return res.status(500).send({
            error: formattedError
          });  // friendly error handling
        }
        throw err  // if this happens, our backend application will crash and not respond to the client. because we don't recognize this error yet, we don't know how to handle it in a friendly manner. we intentionally throw an error so that the error monitoring service we'll use in production will notice this error and notify us and we can then add error handling to take care of previously unforeseen errors.
      })
    })

//anyone can view image
// router.get('/',async (req,res) => {
//     const allimages = await prisma.image.findMany()
//     res.json(allimages)
// });



//user who upload image can update image by imageId
//router.put('/')


//go in image page by imageId
// router.get('/:id')






//user who upload image can delete image by imageId
router.delete('/:id', async (req, res) => {
    const image = await prisma.image.findUnique({
      where: {
        id: req.params.id
      }
    })
    
    // we have access to `req.user` from our auth middleware function (see code above where the assignment was made)
    if (req.user.id != image.user_id) {
        return res.status(401).send({"error": "Unauthorized"})
    }
    
    // some code
  })


export default router