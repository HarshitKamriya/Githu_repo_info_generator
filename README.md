# 📦 Repo Info Generator

A full-stack web application that generates comprehensive, beautiful Markdown (`info.md`) summaries for any public or private GitHub repository.

![Repo Info Generator](https://raw.githubusercontent.com/HarshitKamriya/Githu_repo_info_generator/main/client/public/favicon.svg) <!-- Replace with a screenshot URL if you prefer -->

## ✨ Features

- **Comprehensive Data:** Fetches repository details, the latest 10 commits, top 30 contributors, and a full file tree hierarchy.
- **Rich Markdown Formatting:** Automatically structures the data into a beautifully formatted Markdown document complete with tables and emojis.
- **Live Preview:** Renders the generated Markdown directly in the browser.
- **1-Click Download & Copy:** Easily copy the raw Markdown or download it directly as an `info.md` file.
- **Private Repo Support:** Securely enter a GitHub Personal Access Token to generate summaries for private repositories or to bypass GitHub's unauthenticated rate limits.

## 🏗️ Architecture

This project is built using a modern decoupled architecture:

- **Frontend:** React + Vite (located in `/client`)
- **Backend:** Node.js + Express API
- **Styling:** Custom, clean CSS with a focus on readability and modern UI design.
- **Markdown Parsing:** [marked.js](https://marked.js.org/)

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/HarshitKamriya/Githu_repo_info_generator.git
cd Githu_repo_info_generator
```

### 2. Backend Setup
Install the backend dependencies:
```bash
npm install
```

Create a `.env` file in the root directory and (optionally) add your GitHub token to increase your rate limits:
```env
PORT=3000
GITHUB_TOKEN=ghp_your_token_here
```

Start the Express backend:
```bash
npm run dev
```
*(The backend will run on `http://localhost:3000`)*

### 3. Frontend Setup
Open a new terminal window, navigate to the `client` folder, and install the frontend dependencies:
```bash
cd client
npm install
```

Start the Vite development server:
```bash
npm run dev
```
*(The frontend will run on `http://localhost:5173` and automatically proxy API requests to the backend)*

## 🌐 Deployment (Split Architecture)

This application is designed to be deployed with the frontend on **Vercel** and the backend on **Render**.

### Deploying the Backend (Render)
1. Push this repository to GitHub.
2. Go to [Render](https://render.com/) and create a new **Web Service**.
3. Connect your GitHub repository.
4. Set the **Build Command** to: `npm install`
5. Set the **Start Command** to: `npm start`
6. Add your Environment Variables:
   - `GITHUB_TOKEN`: Your GitHub PAT (optional but recommended)
7. Deploy! Copy the URL provided by Render (e.g., `https://my-backend.onrender.com`).

### Deploying the Frontend (Vercel)
1. Go to [Vercel](https://vercel.com/) and create a new Project.
2. Import this same GitHub repository.
3. In the project configuration, edit the **Root Directory** and select `client`.
4. Vercel will auto-detect Vite as the framework.
5. In the **Environment Variables** section, add:
   - `VITE_API_URL`: Paste your Render backend URL here (e.g., `https://my-backend.onrender.com` without a trailing slash).
6. Click **Deploy**.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
