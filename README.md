# 📌 Pinterest Clone API


📝 About

Pinterest Clone API is a professional Back-End project for an interactive image sharing application.
It allows registered users to upload, edit, delete, view, and like images, as well as see their own uploads.
All operations are secured with JWT authentication, and images are stored via Cloudinary.

Developed using Node.js + Express.js + TypeScript + MongoDB with JWT authentication and Cloudinary image upload.

🚀 Features

🔐 User registration, login, and JWT authentication

🖼️ Upload images with title and description

✏️ Edit and delete images (owner only)

👤 Fetch all images or your own uploaded images

❤️ Like and unlike images

☁️ Image upload handled via Cloudinary

⚙️ Fully ready API for connection with a professional Front-End

🧩 Technologies Used

Node.js · Express · TypeScript · MongoDB · JWT · bcryptjs · multer · cloudinary · dotenv · CORS · streamifier

⚙️ Setup

1️⃣ Clone the repository

git clone https://github.com/ZenZN99/pinterest-clone-api.git
cd pinterest-clone-api


2️⃣ Install dependencies

npm install


3️⃣ Environment variables (.env)

PORT=your_port
MONGO_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret


4️⃣ Run the server

npm run start


Server will run on http://localhost:PORT

🔗 Main API Endpoints
🔸 Auth
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Login user
GET	/api/auth/me	Get current user info (requires Bearer token)
🔸 Images
Method	Endpoint	Description
GET	/api/image	Get all images
POST	/api/image/upload	Upload new image (Authenticated)
PUT	/api/image/:id	Edit image (Authenticated, owner only)
DELETE	/api/image/:id	Delete image (Authenticated, owner only)
GET	/api/image/imageme	Get your uploaded images (Authenticated)
POST	/api/image/:id/like	Like / Unlike an image (Authenticated)
🧪 Testing (Postman)

Register a new user or log in to get a JWT Token.

Add the token to your request headers:

Authorization: Bearer <your_token>


Try all image routes (upload, edit, delete, like, view your images).

💡 Notes

Only authenticated users can manage and like images.

Users can only edit or delete their own uploads.

Each image keeps track of the number of likes and users who liked it.

🧾 License

MIT License © 2025 Zen Lahham
