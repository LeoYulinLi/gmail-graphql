import express from "express";
import bodyParser from "body-parser";
import graphqlRoot from "./graphql/graphql-root";

const app = express();
app.use(bodyParser.json());

app.use("/api", graphqlRoot());

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${ port }`));
