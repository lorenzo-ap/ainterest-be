import express, { json, response } from 'express';
import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const router = express.Router();

router.route('/').get((req, res) => {
    res.send('Hello from Image Generator API!');
});

router.route('/').post(async (req, res) => {
    const { prompt } = req.body;

    const options = {
        method: 'POST',
        url: process.env.RAPIDAPI_URL,
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': process.env.RAPIDAPI_HOST,
            'Content-Type': 'application/json',
        },
        data: {
            negative_prompt: 'white',
            prompt: prompt,
            width: 512,
            height: 512,
            hr_scale: 2,
        },
    };

    try {
        const response = await axios.request(options);
        const data = response.data;

        res.status(200).json({ photo: data });
    } catch (error) {
        res.status(400).send(error);
    }
});

export default router;
