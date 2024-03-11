import express from "express";
import prisma from "../utils/prisma.js";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { validateUser } from "../validators/users.js";
import { filtered } from "../utils/common.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const data = req.body;
  const validationErrors = validateUser(data);

  if (Object.keys(validationErrors).length != 0)
    return res.status(400).send({
      error: validationErrors,
    });

  // add hashing
  data.password = bcrypt.hashSync(data.password, 8);
  prisma.user
    .create({
      data,
    })
    .then((user) => {
      // If created correct, return success
      return res.json(filtered(user, "id", "name", "email"));
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

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  return res.json(user);
});

export default router;
