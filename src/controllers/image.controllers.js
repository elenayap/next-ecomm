import express from "express";
import prisma from "../utils/prisma.js";
import { Prisma } from "@prisma/client";
import auth from "../middlewares/auth.js";

const router = express.Router();

//sign in user can upload image
router.post("/", auth, async (req, res) => {
  const data = req.body;
  // console.log(req.user.payload.id)
  console.log(data);

  prisma.image
    .create({
      data: {
        userId: req.user.payload.id,
        ...data, // ...data is using the spread syntax to include all properties of the data object into the new object
      },
    })
    .then((image) => {
      return res.json(image);
    })
    .catch((err) => {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        const formattedError = {};
        formattedError[`${err.meta.target[0]}`] = "already taken";

        return res.status(500).send({
          error: formattedError,
        }); // friendly error handling
      }
      throw err; // if this happens, our backend application will crash and not respond to the client. because we don't recognize this error yet, we don't know how to handle it in a friendly manner. we intentionally throw an error so that the error monitoring service we'll use in production will notice this error and notify us and we can then add error handling to take care of previously unforeseen errors.
    });
});

//anyone can view image
router.get("/", async (req, res) => {
  const allimages = await prisma.image.findMany();
  res.json(allimages);
});

//user who upload image can update image by imageId
router.put("/:id", auth, async (req, res) => {
  //to retrive imageId from req parameters
  const imageId = parseInt(req.params.id);
  //to retrived updated image data from req body
  const Imagedata = req.body;

  const currentImage = await prisma.image.findUnique({
    where: {
      id: imageId,
    },
  });
  //if image not found, return 404
  if (!currentImage) {
    return res.status(404).send({ error: "Image not found" });
  }

  //update image data in database
  const updateImage = await prisma.image.update({
    where: {
      id: imageId,
    },
    data: Imagedata,
  });
  return res.status(200).json(updateImage);
});

//to view image by imageId
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  console.log(id);
  const imageByUser = await prisma.image.findUnique({
    where: {
      id: id,
    },
  });
  res.json(imageByUser);
});

//user who upload image can delete image by imageId
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const image = await prisma.image.findUnique({
    where: {
      id: id,
    },
  });

  // we have access to `req.user` from our auth middleware function (see code above where the assignment was made)
  if (!image) {
    return res.status(404).send({ error: "Image not found" });
  }
  // Perform actions when the user is authorized
  //  delete the image
  await prisma.image.delete({
    where: {
      id: id,
    },
  });
  // Send a success response
  return res.status(200).send({ message: "Image deleted successfully" });
});

export default router;
