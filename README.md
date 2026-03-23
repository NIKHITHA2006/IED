# Industry Exposure Dashboard (IED)

A complete, production-quality full-stack web application designed for students and faculty to analyze industry trends, skill requirements, and personal skill gaps.

## 🚀 Key Features

### Admin
- **Dashboard Analytics**: Real-time KPIs and charts (Skill demand, Internship distribution, Industry growth).
- **Industry Management**: Full CRUD for industry domains with images and growth levels.
- **Skill Management**: Manage skills and map them to relevant industries.
- **Internship Management**: Create internship listings with required skill chips.
- **Skill Gap Reports**: Aggregate analysis of missing skills across all users.
- **Export**: Professional PDF and Excel analytics reports.

### Student / Faculty
- **Exploration**: Modern, image-based industry cards with growth badges.
- **Skill Demand**: Visual overview of hot skills in various domains.
- **Skill Gap Analysis**: Interactive tool to compare personal skills against industry standards.
- **Personal Evaluation**: Dynamic readiness score and gap identification.
- **Personal Reports**: Downloadable PDF reports with career suggestions.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Recharts, HeroIcons.
- **Backend**: Node.js, Express.js, JWT, Bcrypt.
- **Database**: MongoDB (Mongoose).
- **Reports**: jsPDF, SheetJS (XLSX).
- **DevOps**: Docker, Docker Compose, GitHub Actions.

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or via Docker)

### Installation

1. **Clone the repository**
2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Create .env file based on .env.example
   npm run seed  # Populate with industry data
   npm run dev
   ```
3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Running with Docker
```bash
docker-compose up --build
```

## 🔐 Credentials (Demo)
- **Admin**: admin@ied.com / admin123
- **Student**: student@ied.com / user123
