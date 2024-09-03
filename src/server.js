import express from 'express';
import bodyParser from 'body-parser'; 
import viewEngine from "./config/viewEngine";
import initWebRoutes from './routes/web';
import connectDB from './config/connectDB';
import cors from "cors";

require('dotenv').config();

let app = express();

// const corsOptions = {
//     credentials: true,
//     origin: ['http://localhost:3000', 'http://localhost:8080'] // Whitelist the domains you want to allow
// };

// app.use(cors(corsOptions)); 
app.use(cors({origin: true})); 

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//     extended: true
// }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
    limit: '50mb', extended: true
}));

viewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 8000
app.listen(port,()=>{
    console.log('Backend is running on the port:', port)
})



