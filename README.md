---

# BehavioralRoutineOptimizer Frontend

A modern, responsive React + Vite dashboard for interacting with the Behavioral Routine Optimizer backend. This interface allows users to make predictions, view results, submit feedback, and monitor the model status in real time.

!\[Banner or Screenshot Placeholder]

---

## Table of Contents

* [Overview](#overview)
* [Tech Stack](#tech-stack)
* [Project Structure](#project-structure)
* [Setup and Installation](#setup-and-installation)
* [Available Pages](#available-pages)
* [Usage](#usage)
* [Deployment](#deployment)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)

---

## Overview

This is the official frontend dashboard for the [Behavioral Routine Optimizer](https://github.com/war-riz/behavioural_routine_optimizer_frontend). It connects to the FastAPI backend to allow:

* Submitting behavior data
* Viewing productivity predictions
* Tracking feedback submissions
* Monitoring model availability

---

## Tech Stack

* **Frontend:** React, Vite
* **Styling:** Tailwind CSS or custom CSS (you can choose)
* **Charts:** Recharts
* **Icons:** Lucide React
* **Animations:** Framer Motion (optional)
* **HTTP Client:** Axios or Fetch
* **Routing:** React Router (optional)

---

## Project Structure

```
behavioral_frontend/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images, icons, etc.
│   ├── components/         # Reusable UI components
│   ├── pages/              # Main route views (Dashboard, Predict, Results, etc.)
│   ├── hooks/              # API logic and custom hooks
│   ├── styles.css          # Your custom CSS or Tailwind
│   ├── App.tsx             # Main App wrapper
│   └── main.tsx            # Entry point
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── README.md
```

---

## Setup and Installation

### 1. Clone the repo

```bash
git clone https://github.com/war-riz/behavioural_routine_optimizer_frontend.git
cd behavioural_routine_optimizer_frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the dev server

```bash
npm run dev
```

---

## Available Pages

| Route       | Description                             |
| ----------- | --------------------------------------- |
| `/`         | Main dashboard overview                 |
| `/predict`  | Form to input routine and predict score |
| `/results`  | View prediction outputs and SHAP        |
| `/feedback` | Submit or view feedback entries         |
| `/model`    | Check if the model is online            |

---

## Usage

* Make sure the FastAPI backend is running (`uvicorn api.main:app --reload`)
* Open the frontend (`npm run dev`) at `http://localhost:5173`
* Navigate between dashboard sections
* Submit inputs and get real-time results from the ML model

---

## Deployment

To build the app for production:

```bash
npm run build
```

Then deploy `dist/` using:

* Vercel
* Netlify
* GitHub Pages
* or your custom server

---

## Contributing

PRs welcome! To contribute:

1. Fork the repo and create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes
3. Push to GitHub and open a Pull Request

---

## License

This project is under the [MIT License](LICENSE).

---

## Contact

Maintained by [**war\_riz**](https://github.com/war-riz).
For support or collaboration, open an issue or contact me via GitHub.

---

Let me know if you'd like a **markdown file download**, a **banner image**, or to set up GitHub Actions for deploying this.
