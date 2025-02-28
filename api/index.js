import cors from 'cors';
import express from 'express';
import connectDB from '../middleware/connectDb.js';
import authRoutes from '../routes/authRoutes.js';
import postRoutes from '../routes/postRoutes.js';
import userRoutes from '../routes/userRoutes.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/posts', postRoutes);

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
