import express from "express";
import Stripe from "stripe";
import prisma from "../utils/prisma.js";

const router = express.Router();
const stripeInstance = new Stripe(process.env.STRIPE_PRIVATE_KEY);

//anyone can make payment
router.post("/", async (req, res) => {
  //request image.body
  const id = req.body;
  // console.log(id)
  const image = await prisma.image.findUnique({
    where: {
      id: id.id, //req.body.id
    },
  });
  const session = await stripeInstance.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: image.image_title,
            description: image.image_description,
          },
          unit_amount: image.image_price * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:5173/",
    cancel_url: `http://localhost:5173/collections/${image.id}`,
  });
  return res.json(session.url);
});

export default router;
