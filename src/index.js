import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectDb } from './db/dbconnection.js';
import StockRouter from './routes/stock.routes.js';

const app = express();
const port = 5001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api', StockRouter);

// Database connection and server start
connectDb().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch((error) => {
    console.log('Internal Server Error !!!', error);
});
