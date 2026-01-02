import 'dotenv/config';
import express from 'express';
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
