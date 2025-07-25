# Employee Management System

## 🛠 System Requirements

Before running the project, make sure your system meets these requirements:

- **Node.js >= 18.x**  
- **npm >= 9.x**  
- **Docker** (optional, if you want to run MinIO via Docker)  
- **MongoDB >= 5.x** (can be local or remote server)  
- **MinIO** (for file storage, can be hosted locally or on a server)  
- **Git** (if cloning from repository)  
---

## 🚀 Backend Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create the environment configuration file
Add a `.env` file in the backend folder with the following variables:

```env
MINIO_ENDPOINT=<your_minio_endpoint>
MINIO_USERNAME=<your_minio_username>
MINIO_PASSWORD=<your_minio_password>

# If using MongoDB server:
DB_URL=<your_mongodb_server_url>
# If using MongoDB local:
DB_URL_LOCAL=<your_mongodb_local_url>

EMAIL_USERNAME=<your_email_username>
EMAIL_PASSWORD=<your_email_password>

JWT_SECRET=<your_jwt_secret_key>
ENCRYPTION_KEY=<your_encryption_key>
```

### 3. Set up MinIO
Host MinIO on a server or using Docker.

Example Docker command:
```bash
docker run -d --name minio \
-p 9000:9000 -p 9001:9001 \
-e MINIO_ROOT_USER=minioadmin \
-e MINIO_ROOT_PASSWORD=minioadmin \
quay.io/minio/minio server /data --console-address ":9001"
```

After running MinIO, update `MINIO_ENDPOINT`, `MINIO_USERNAME`, and `MINIO_PASSWORD` in `.env`.

### 4. Set up MongoDB
You can use either local MongoDB or MongoDB server.

Update the corresponding URL in the `.env` file.

Make sure to adjust the Database Module to switch between server or local mode.

### 5. Configure Email
Create an email account for sending notifications to employees.

Add `EMAIL_USERNAME` and `EMAIL_PASSWORD` to `.env`.

### 6. Run the backend server
For development:
```bash
npm run dev
```

For production:
```bash
npm start
```

## 💻 Frontend Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create the environment configuration file
Add a `.env` file in the frontend folder.

If running in development mode, create an additional `.env.development` file.

Example:
```env
GENERATE_SOURCEMAP=false
```

### 3. Run the frontend app
```bash
npm run dev
```

It will run on the default port (usually http://localhost:5173 for Vite).

## ✅ Summary

### Backend requires:
- MinIO for file storage
- MongoDB (local or server)
- Email service for notifications
- JWT secret & encryption key

### Frontend requires:
- `.env` or `.env.development` for API URLs

### Once everything is set up, you can:
1. Start MinIO
2. Start MongoDB
3. Run Backend
4. Run Frontend

## 🐳 Optional: Run MinIO with Docker

If you want to host MinIO using Docker, use this command:

```bash
docker run -d --name minio \
-p 9000:9000 -p 9001:9001 \
-e MINIO_ROOT_USER=minioadmin \
-e MINIO_ROOT_PASSWORD=minioadmin \
quay.io/minio/minio server /data --console-address ":9001"
```

Then access MinIO Console at:
👉 http://localhost:9001
