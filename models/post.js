import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
	{
		user: {
			type: {
				username: { type: String, required: true },
				email: { type: String, required: true },
				photo: { type: String },
			},
			required: true,
		},
		prompt: { type: String, required: [true, 'Please add a prompt'] },
		photo: { type: String, required: [true, 'Please add a photo'] },
	},
	{
		timestamps: true,
	}
);

export default mongoose.model('Post', postSchema);
