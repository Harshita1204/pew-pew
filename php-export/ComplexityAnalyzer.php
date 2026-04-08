<?php
class ComplexityAnalyzer {
    /**
     * Calculates the Cyclomatic Complexity of a PHP code snippet.
     * Uses token_get_all for accurate parsing of PHP code.
     */
    public function analyze(string $code): int {
        // Ensure the code starts with <?php for the tokenizer to work properly
        if (strpos(trim($code), '<?php') !== 0) {
            $code = "<?php\n" . $code;
        }

        $tokens = token_get_all($code);
        $complexity = 1; // Base complexity is 1

        // Decision points that increase cyclomatic complexity
        $decisionTokens = [
            T_IF, T_ELSEIF, T_FOR, T_FOREACH, T_WHILE,
            T_CASE, T_CATCH, T_BOOLEAN_AND, T_BOOLEAN_OR,
            T_LOGICAL_AND, T_LOGICAL_OR
        ];

        foreach ($tokens as $token) {
            if (is_array($token)) {
                if (in_array($token[0], $decisionTokens)) {
                    $complexity++;
                }
            } else {
                // Ternary operator also adds a decision point
                if ($token === '?') {
                    $complexity++;
                }
            }
        }

        return $complexity;
    }

    /**
     * Returns a refactoring tip based on the complexity score.
     */
    public function getRefactoringTip(int $score): string {
        if ($score <= 5) {
            return "Clean code.";
        } elseif ($score <= 10) {
            return "Moderate complexity. Consider extracting methods.";
        } else {
            return "High Risk. Immediate refactoring required (Guard clauses, Strategy pattern).";
        }
    }
}
