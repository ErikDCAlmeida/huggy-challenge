import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyparser from "body-parser";
import axios from "axios";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyparser.json());

app.post("/login", async (request: Request, response: Response) => {
  const result = await axios("https://auth.huggy.app/oauth/access_token", {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: request.body,
  });

  response.send(result.data);
});

app.get("/contacts", async (request: Request, response: Response) => {
  const result = await axios("https://api.huggy.app/v3/contacts", {
    method: "GET",
    headers: {
      Accept: request.headers.accept,
      Authorization: request.headers.authorization,
    },
  });
  response.send(result.data);
});

app.listen(8080, () => {
  console.log("Servidor funcionando!");
});

export default app;
