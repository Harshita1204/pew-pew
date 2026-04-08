CREATE TABLE IF NOT EXISTS analyses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    raw_code TEXT,
    complexity_score INTEGER,
    risk_level TEXT,
    language TEXT,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS suggestions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pattern_type TEXT,
    advice_text TEXT
);
