import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import jwt from 'jsonwebtoken';
import PDFDocument from 'pdfkit';

const app = express();
app.use(express.json());

// Initialize SQLite Database
const db = new Database('./codelens.sqlite');
db.exec(`CREATE TABLE IF NOT EXISTS analyses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  raw_code TEXT,
  complexity_score INTEGER,
  risk_level TEXT,
  language TEXT,
  notes TEXT
)`);
db.exec(`CREATE TABLE IF NOT EXISTS suggestions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pattern_type TEXT,
  advice_text TEXT
)`);
db.exec(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)`);

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

try {
  db.exec('ALTER TABLE analyses ADD COLUMN language TEXT');
} catch {
  // Column already exists.
}

try {
  db.exec('ALTER TABLE analyses ADD COLUMN notes TEXT');
} catch {
  // Column already exists.
}

// Regex-based complexity calculation for TypeScript environment
// (Simulates PHP's token_get_all approach)
function calculateComplexity(code: string, language: string) {
  let cleanCode = code;

  // Language-specific cleaning
  if (language === 'javascript' || language === 'typescript') {
    cleanCode = cleanCode.replace(/\/\/.*$/gm, ''); // Remove single-line comments
    cleanCode = cleanCode.replace(/\/\*[\s\S]*?\*\//g, ''); // Remove multi-line comments
  } else if (language === 'python') {
    cleanCode = cleanCode.replace(/#.*$/gm, ''); // Remove single-line comments
  } else if (language === 'php') {
    cleanCode = cleanCode.replace(/\/\/.*$/gm, '');
    cleanCode = cleanCode.replace(/\/\*[\s\S]*?\*\//g, '');
    cleanCode = cleanCode.replace(/#.*$/gm, '');
  }

  // Remove strings
  cleanCode = cleanCode.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '');

  // Count decision points
  const decisionKeywords = {
    javascript: /\b(if|else if|for|while|case|catch)\b|&&|\|\||\?/g,
    python: /\b(if|elif|for|while|case|except)\b|and|or|\?/g,
    php: /\b(if|elseif|for|while|case|catch)\b|&&|\|\||\?/g,
  };

  const matches = cleanCode.match(decisionKeywords[language] || /\b(if|else)\b/g);
  return 1 + (matches ? matches.length : 0);
}

async function generateGeminiText(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return '';

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 512 },
      }),
    },
  );

  const data = await response.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  const text = parts.map((part: { text?: string }) => part.text || '').join('');
  return text.trim();
}

app.post('/api/analyze', async (req, res) => {
  const { code, language } = req.body;
  const activeLanguage = typeof language === 'string' ? language : 'javascript';
  const score = calculateComplexity(code, activeLanguage);

  let riskLevel = 'Clean code.';
  if (score > 5 && score <= 10) riskLevel = 'Moderate complexity. Consider extracting methods.';
  if (score > 10) riskLevel = 'High Risk. Immediate refactoring required (Guard clauses, Strategy pattern).';

  // Generate AI-driven suggestions
  let aiSuggestions: string[] = [];
  try {
    const suggestionText = await generateGeminiText(
      `You are an expert code mentor. Review this ${activeLanguage} code and return 4-6 concise refactor suggestions as bullet points.\n\n${code}`,
    );
    aiSuggestions = suggestionText
      .split('\n')
      .map((line) => line.replace(/^[-*]\s*/, '').trim())
      .filter(Boolean)
      .slice(0, 6);
  } catch (error) {
    console.error('AI suggestion generation failed:', error);
  }

  // Save to DB
  const stmt = db.prepare(
    `INSERT INTO analyses (raw_code, complexity_score, risk_level, language) VALUES (?, ?, ?, ?)`,
  );
  const result = stmt.run(code, score, riskLevel, activeLanguage);

  res.json({
    id: result.lastInsertRowid,
    score,
    riskLevel,
    suggestions: aiSuggestions,
  });
});

app.post('/api/report', async (req, res) => {
  const { code, language } = req.body;
  if (!code || typeof code !== 'string') {
    res.status(400).json({ error: 'Code is required to generate a report.' });
    return;
  }
  const activeLanguage = typeof language === 'string' ? language : 'javascript';
  const score = calculateComplexity(code, activeLanguage);

  let riskLevel = 'Clean code.';
  if (score > 5 && score <= 10) riskLevel = 'Moderate complexity. Consider extracting methods.';
  if (score > 10) riskLevel = 'High Risk. Immediate refactoring required (Guard clauses, Strategy pattern).';

  const reportPrompt = `Create a structured developer growth report for this ${activeLanguage} code.\n` +
    `Include sections: Summary, Complexity Drivers, Improvement Areas, Next Learning Goals, and Mentor Notes.\n` +
    `Keep it concise and actionable.\n\n${code}`;

  let reportText = '';
  try {
    reportText = await generateGeminiText(reportPrompt);
  } catch (error) {
    console.error('Report generation failed:', error);
  }

  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const chunks: Buffer[] = [];

  doc.on('data', (chunk) => chunks.push(chunk));
  doc.on('error', (error) => {
    console.error('PDF generation failed:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to generate PDF report.' });
    }
  });
  doc.on('end', () => {
    const pdf = Buffer.concat(chunks);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="code-report.pdf"');
    res.send(pdf);
  });

  doc.fontSize(22).text('CodeLens Learning Report', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12).text(`Language: ${activeLanguage}`);
  doc.text(`Complexity Score: ${score}`);
  doc.text(`Risk Level: ${riskLevel}`);
  doc.moveDown();

  doc.fontSize(14).text('AI Mentor Report');
  doc.moveDown(0.5);
  doc.fontSize(11).text(reportText || 'AI report unavailable. Please check the Gemini API key.');

  doc.end();
});

app.post('/api/generate', async (req, res) => {
  const { prompt, language } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ error: 'Prompt is required to generate code.' });
    return;
  }

  const activeLanguage = typeof language === 'string' ? language : 'javascript';
  try {
    const codeText = await generateGeminiText(
      `You are a senior developer. Generate a clean, production-ready ${activeLanguage} code snippet for the request below.\n` +
        `Return only code, no markdown fences.\n\nRequest: ${prompt}`,
    );
    res.json({ code: codeText });
  } catch (error) {
    console.error('Code generation failed:', error);
    res.status(500).json({ error: 'Failed to generate code.' });
  }
});

// Fetch all analyses
app.get('/api/analyses', (req, res) => {
  const analyses = db.prepare('SELECT * FROM analyses').all();
  res.json(analyses);
});

// Delete an analysis by ID
app.delete('/api/analyses/:id', (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare('DELETE FROM analyses WHERE id = ?');
  const result = stmt.run(id);
  if (result.changes > 0) {
    res.json({ message: 'Analysis deleted successfully.' });
  } else {
    res.status(404).json({ error: 'Analysis not found.' });
  }
});

// Update an analysis with additional notes
app.patch('/api/analyses/:id', (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;
  const stmt = db.prepare('UPDATE analyses SET notes = ? WHERE id = ?');
  const result = stmt.run(notes, id);
  if (result.changes > 0) {
    res.json({ message: 'Analysis updated successfully.' });
  } else {
    res.status(404).json({ error: 'Analysis not found.' });
  }
});

// User authentication routes
app.post('/api/signup', (req, res) => {
  const { username, password } = req.body;
  const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
  try {
    stmt.run(username, password);
    res.json({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(400).json({ error: 'User registration failed.' });
  }
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const stmt = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?');
  const user = stmt.get(username, password);
  if (user) {
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials.' });
  }
});

// Middleware to protect routes
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied.' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });
    req.user = user;
    next();
  });
}

const vite = await createViteServer({
  server: { middlewareMode: true },
});

app.use(vite.middlewares);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
