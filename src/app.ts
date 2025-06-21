import express, { Application, Request, Response } from "express";
import { bookRouter } from "./app/books/book.controller";
import { borrowRoute } from "./app/borrow/borrow.conttroller";

const app: Application = express();

app.use(express.json());
app.use("/api", bookRouter);
app.use("/api", borrowRoute)

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Library Management Server!')
})

export default app;
