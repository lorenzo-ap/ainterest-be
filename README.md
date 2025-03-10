# Image Generator BE Documentation

## Overview

**image-generator-be** is a lightweight backend application designed to support image generation, likely interfacing with an AI-based service. Created by [**lorenzo-ap**](https://github.com/lorenzo-ap), it provides API endpoints for the **image-generator-fe** front-end.

## Features

- **API Endpoints**: Handles prompt-based image generation requests.
- **AI Integration**: Connects to an external AI service for image creation.
- **Simple Structure**: Minimalist backend for efficient processing.

## Prerequisites

- **Node.js**: Version 14.x or higher.
- **npm**: For dependency management.
- **.env setup**: See `.env.example` as an example.

## Configuration with .env

Create a `.env` file in the root directory with required variables, e.g.:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
MONGODB_URL=your-mongodb-url
JWT_SECRET=random-string
```

## Author

Created by **lorenzo-ap**.

## Last Updated

March 10, 2025
