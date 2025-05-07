# ForgeWrite – Personal Writing Web Application

**ForgeWrite** is a modern web application designed for writers, bloggers, and screenwriters who want to organize, write, and track their literary projects in a personal, intuitive, and secure environment.

![Vue + Symfony + Docker](https://img.shields.io/badge/vue.js-3.x-green?logo=vue.js) ![Symfony 6](https://img.shields.io/badge/symfony-6.x-black?logo=symfony) ![Docker](https://img.shields.io/badge/docker-ready-blue?logo=docker) ![Branch](https://img.shields.io/badge/branch-develop-yellow) ![License](https://img.shields.io/badge/license-MIT-lightgrey)

---

## 🧠 Main Features

* 🛡️ Secure authentication with JWT + 2FA (OTP)
* 📁 Management of writing projects (titles, tags, description)
* ✍️ Chapter writing using a rich text editor
* 📝 Personal notes per project
* 📊 Progress tracking: word count, goals, statistics
* 🤖 AI-powered text suggestions (OpenAI / Ollama)
* 📤 Export to PDF and Markdown (via Snappy/wkhtmltopdf)
* 🌙 Light and dark theme with responsive UI
* 🔒 Secure deployment using Traefik + SSL

---

## 🧱 Tech Stack

| Layer          | Technology        |
| -------------- | ----------------- |
| Frontend       | Vue.js 3 + Vite   |
| Backend        | Symfony 6.x (API) |
| Database       | PostgreSQL        |
| Deployment     | Docker Compose    |
| Reverse Proxy  | Traefik + ACME    |
| Authentication | JWT + OTP (2FA)   |
| AI Integration | OpenAI or Ollama  |
| Monitoring     | Sentry, Matomo    |

---

## 📂 Project Structure

```
forgewrite/
├── api/         # Symfony API (backend)
├── client/      # Vue.js frontend (SPA)
├── docker/      # Docker, nginx, Traefik
├── .env         # Environment variables
└── README.md    # Project documentation
```

---

## 🚀 Deployment (Docker - Production)

> Requirements: Docker, Docker Compose, VPS, domain name

1. Clone the repository:

```bash
git clone git@github.com:amarabilal/forgewrite-esgi.git
cd forgewrite-esgi/docker
```

2. Launch the services:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

3. Access the application:

* Frontend → `https://www.forgewrite.fr`
* Backend  → `https://api.forgewrite.fr`

---

## ⚙️ Environment Variables

### Example `.env` file (to place in `/api` and `/client` if needed):

```
APP_ENV=prod
DATABASE_URL=pgsql://forge:write@db:5432/forgewrite
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
```

---

## ✅ To Do

* [ ] Initialize Symfony backend
* [ ] Setup Vue + Vite frontend
* [ ] Implement JWT authentication
* [ ] Enable 2FA with OTP
* [ ] Export features (PDF/Markdown)
* [ ] Docker + Traefik + HTTPS setup
* [ ] Integrate AI (OpenAI/Ollama)
* [ ] Finalize SEO + Analytics

---

## 📄 License

Open-source project under the MIT license.

---

## 👥 Authors

* **Duy Anh NGUYEN** – Developer – ESGI 4 IW3
* **Tung Duong PHAM** – Developer – ESGI 4 IW3
* **Bilal Amara** – Developer – ESGI 4 IW3