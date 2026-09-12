# Executive Mono
**Professional Identity Architecture for Leadership.**

## Overview
Executive Mono is a high-fidelity, AI-powered resume builder designed specifically for senior professionals and executives. It rejects the aesthetic of generic "AI slop" in favor of a modular, LaTeX-inspired system that emphasizes typographic rigor, intentional whitespace, and a strict content hierarchy. The result is a professional document that is as impressive to human recruiters as it is to ATS algorithms.

## Demo
<!-- Replace the placeholder below with a link to your live demo or a GIF of the editor in action -->
[![Demo Placeholder](https://via.placeholder.com/800x450?text=Executive+Mono+Demo+GIF)](https://your-demo-link.com)

## Features
- **LaTeX-Inspired Precision**: A minimalist, high-contrast editor with a real-time preview that mirrors a professional LaTeX document.
- **AI Content Engineering**: Integrated with state-of-the-art LLMs (via Groq and Gemini) to refine professional summaries and transform task-based descriptions into impact-driven achievements.
- **Deep ATS Analysis**: A built-in scoring system that evaluates resumes across formatting, keyword density, and content quality to ensure maximum visibility in recruitment pipelines.
- **Modular Narrative Flow**: A drag-and-drop section architecture allowing users to reorganize their professional story dynamically.
- **Zero-Shift PDF Export**: A precision-engineered print system that ensures the exported PDF is a pixel-perfect reproduction of the editor's preview.
- **Real-time State Sync**: Powered by Zustand and TanStack Query for an instantaneous, lag-free editing experience.

## Tech Stack
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) & [TanStack Query](https://tanstack.com/query/latest)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Database**: [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- **Authentication**: JWT & Bcrypt
- **AI Integration**: [Groq SDK](https://groq.com/) & [Google Generative AI](https://ai.google.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Phosphor Icons](https://phosphoricons.com/)

## Project Structure
```text
src/
├── app/             # Next.js App Router pages and API routes
├── components/      # UI components
│   ├── ui/          # Atomic, reusable UI primitives
│   └── features/    # Complex, domain-specific feature components
├── services/        # Business logic (AI, Auth, Resume operations)
├── store/           # Zustand global state management
├── lib/             # Utility functions, API clients, and Zod schemas
├── models/          # Mongoose database schemas
└── types/           # TypeScript interfaces and domain types
```

## Getting Started

### Prerequisites
- Node.js (LTS version recommended)
- MongoDB instance (local or Atlas)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/executive-mono.git
   cd executive-mono
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Setup
Create a `.env.local` file in the root directory and populate it using the `.env.example` as a guide:
```env
MONGO_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_super_secret_access_key
REFRESH_TOKEN_SECRET=your_super_secret_refresh_key
REFRESH_TOKEN_EXPIRY_DAYS=7
GEMINI_API_KEY=your_gemini_api_key
```

### Local Development
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
Build the application for production:
```bash
npm run build
npm start
```

## Scripts
| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server with hot-reloading |
| `npm run build` | Compiles the application for production |
| `npm run start` | Launches the production-ready server |
| `npm run lint` | Runs ESLint to ensure code quality and consistency |

## Contributing
Contributions are welcome! Please follow these basic guidelines:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## License
[License details will be added here]

## Contact
**Author**: [Your Name]  
**Links**: [GitHub] | [LinkedIn] | [Portfolio]
