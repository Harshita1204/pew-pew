<?php
class Database {
    private PDO $pdo;

    public function __construct(string $dbPath = __DIR__ . '/codelens.sqlite') {
        $this->pdo = new PDO("sqlite:" . $dbPath);
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->initSchema();
    }

    private function initSchema(): void {
        $schema = file_get_contents(__DIR__ . '/schema.sql');
        if ($schema !== false) {
            $this->pdo->exec($schema);
        }
    }

    public function saveAnalysis(string $code, int $score, string $riskLevel): int {
        $stmt = $this->pdo->prepare("INSERT INTO analyses (raw_code, complexity_score, risk_level) VALUES (:code, :score, :risk)");
        $stmt->execute([':code' => $code, ':score' => $score, ':risk' => $riskLevel]);
        return (int)$this->pdo->lastInsertId();
    }

    public function saveSuggestion(string $patternType, string $adviceText): void {
        $stmt = $this->pdo->prepare("INSERT INTO suggestions (pattern_type, advice_text) VALUES (:pattern, :advice)");
        $stmt->execute([':pattern' => $patternType, ':advice' => $adviceText]);
    }
}
