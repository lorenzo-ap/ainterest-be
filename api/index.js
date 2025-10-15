import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import connectDB from '../middleware/connectDb.js';
import authRoutes from '../routes/authRoutes.js';
import generateRoutes from '../routes/generateRoutes.js';
import postRoutes from '../routes/postRoutes.js';
import userRoutes from '../routes/userRoutes.js';

const app = express();

app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		credentials: true
	})
);
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/generate', generateRoutes);

app.get('/', (req, res) => {
	res.send('Hello server!');
});

const startServer = async () => {
	try {
		connectDB(process.env.MONGODB_URL);

		app.listen(9999, () => console.log('Server has started on http://localhost:9999'));
	} catch (error) {
		console.log(error);
	}
};

startServer();
