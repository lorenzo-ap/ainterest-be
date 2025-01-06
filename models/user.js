import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	username: { type: String, required: [true, 'Please add a username'], unique: true },
	email: { type: String, required: [true, 'Please add an email'], unique: true },
	password: { type: String, required: [true, 'Please add a password'] },
});

export default mongoose.model('User', userSchema);
