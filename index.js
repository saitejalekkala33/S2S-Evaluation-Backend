const express = require('express');
const cors = require('cors');
const connectDB = require('./db/connect');
require('dotenv').config();

const appRouter = require('./routes/main');

const app = express();

app.use(express.json());
app.use(cors());
// app.use(cors({ origin: 'http://localhost:3000' }));

app.get('/',(req,res)=>{
    res.send('hoasf');
});


app.use('/api',appRouter);

const port = 5000;
const start = async () =>{
    try {   
        await connectDB(process.env.MONGO_URI);
        console.log(`Connected to Db`)
        app.listen(port,()=>{
            console.log(`Server Running on port ${port}`);
        });
    } catch (error) {
        console.log(error)
    }
}

start();
