# CodeLens Learning Lab

A modern learning platform that blends live complexity scoring, AI refactors, and personalized growth roadmaps for every developer. CodeLens Studio provides an interactive Monaco Editor environment for analyzing code complexity, generating reports, and creating code with AI assistance.

## Features

- **Real-time Code Analysis**: Live complexity scoring for JavaScript, TypeScript, Python, and PHP code
- **Monaco Editor Integration**: Professional code editing experience with syntax highlighting and IntelliSense
- **AI-Powered Code Generation**: Generate code snippets using Google Gemini AI based on natural language prompts
- **PDF Report Generation**: Download detailed analysis reports in PDF format
- **Sample Code Snippets**: Pre-loaded examples to get started quickly
- **Multi-Language Support**: Analyze and generate code in multiple programming languages

## Tech Stack

- **Frontend**: React 19, Vite, Monaco Editor, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: SQLite with better-sqlite3
- **AI Integration**: Google Gemini API
- **PDF Generation**: PDFKit
- **Authentication**: JWT

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd pew-pew
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   JWT_SECRET=your_jwt_secret_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Code Analysis**: Paste or write code in the Monaco Editor. The platform automatically analyzes complexity and provides suggestions.

2. **Language Selection**: Choose from JavaScript, TypeScript, Python, or PHP using the language selector.

3. **Load Samples**: Click "Load Sample" to explore pre-built code examples.

4. **Generate Reports**: Click "Download Report" to generate and download a PDF analysis report.

5. **AI Code Generation**: Enter a prompt in the generation field and click "Generate" to create code using AI.

## API Endpoints

- `POST /api/analyze`: Analyze code for complexity
- `POST /api/report`: Generate PDF report
- `POST /api/generate`: Generate code using AI

## Database Schema

The application uses SQLite with the following tables:
- `analyses`: Stores code analysis results
- `suggestions`: Stores refactoring suggestions
- `users`: User authentication data

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run clean`: Clean build artifacts
- `npm run lint`: Run TypeScript type checking

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the Apache-2.0 License.