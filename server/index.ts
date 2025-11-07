import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './utils/db';
import userRouter from './routes/user.routes';
import imageRouter from './routes/image.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(cors({
  origin: 'https://www-pinterest-clone.netlify.app', 
  credentials: true,               
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello Bun!');
});

app.use('/api/auth', userRouter);
app.use('/api/image', imageRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
