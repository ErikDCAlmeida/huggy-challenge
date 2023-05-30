import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyparser from "body-parser";
import axios from "axios";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyparser.json());

app.use("/api", async (request, response) => {
  delete request.headers.host;
  delete request.headers.origin;
  const { data, status } = await axios({
    baseURL: "https://api.huggy.app/v3",
    url: request.url,
    method: request.method,
    data: request.body,
    params: request.query,
    headers: request.headers,
  });

  response.status(status);
  response.send(data);
});

app.use("/oauth", async (request, response) => {
  delete request.headers.host;
  delete request.headers.origin;
  const { data, status } = await axios({
    baseURL: "https://auth.huggy.app/oauth",
    url: request.url,
    method: request.method,
    data: request.body,
    params: request.query,
    headers: request.headers,
  });
  response.status(status);
  response.send(data);
});

// app.post("/login", async (request: Request, response: Response) => {
//   const result = await axios("https://auth.huggy.app/oauth/access_token", {
//     method: "POST",
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       "Content-Type": "application/json",
//       Accept: "application/json",
//     },
//     data: request.body,
//   });

//   response.send(result.data);
// });

// app.get("/contacts", async (request: Request, response: Response) => {
//   const result = await axios("https://api.huggy.app/v3/contacts", {
//     method: "GET",
//     headers: {
//       Accept: request.headers.accept,
//       Authorization: request.headers.authorization,
//     },
//     params: request.query,
//   });
//   response.send(result.data);
// });

// app.get("/contacts:id", async (request: Request, response: Response) => {
//   const result = await axios(
//     `https://api.huggy.app/v3/contacts${request.params.id}`,
//     {
//       method: "GET",
//       headers: {
//         Accept: request.headers.accept,
//         Authorization: request.headers.authorization,
//       },
//     }
//   );
//   response.send(result.data);
// });

// app.post("/contacts", async (request: Request, response: Response) => {
//   const result = await axios("https://api.huggy.app/v3/contacts", {
//     method: "POST",
//     headers: {
//       Accept: request.headers.accept,
//       Authorization: request.headers.authorization,
//     },
//     data: request.body,
//   });
//   response.send(result.data);
// });

// app.put("/contacts/:id", async (request: Request, response: Response) => {
//   const result = await axios(
//     `https://api.huggy.app/v3/contacts/${request.params.id}`,
//     {
//       method: "PUT",
//       headers: {
//         Accept: request.headers.accept,
//         Authorization: request.headers.authorization,
//       },
//       data: request.body,
//     }
//   );
//   response.send(result.data);
// });

// app.delete("/contacts/:id", async (request: Request, response: Response) => {
//   const result = await axios(
//     `https://api.huggy.app/v3/contacts/${request.params.id}`,
//     {
//       method: "DELETE",
//       headers: {
//         Accept: request.headers.accept,
//         Authorization: request.headers.authorization,
//       },
//     }
//   );
//   response.send(result.data);
// });

app.listen(8080, () => {
  console.log("Servidor funcionando!");
});

export default app;
