# Extract Japanese text from PDF
$pdfPath = "calendar.pdf"

try {
    $bytes = [System.IO.File]::ReadAllBytes($pdfPath)
    $text = [System.Text.Encoding]::Unicode.GetString($bytes)
    
    # Try to find Japanese text patterns
    Write-Host "Searching for Japanese calendar terms..."
    
    # Look for common Japanese calendar terms
    $patterns = @("初旬", "上旬", "中旬", "下旬", "月", "日", "年", "学期", "春", "夏", "秋", "冬")
    
    foreach ($pattern in $patterns) {
        $index = $text.IndexOf($pattern)
        if ($index -gt 0) {
            $start = [Math]::Max(0, $index - 50)
            $end = [Math]::Min($text.Length, $index + 100)
            $context = $text.Substring($start, $end - $start)
            Write-Host "Found '$pattern' at position $index"
            Write-Host "Context: $context"
            Write-Host "---"
        }
    }
    
    # Also try to extract any readable Japanese text sections
    Write-Host "Attempting to extract all readable Japanese text..."
    
    # Look for hiragana, katakana, and kanji patterns
    $japaneseText = $text -replace '[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3000-\u303F\uFF00-\uFFEF\s\d\-\(\)\/\.]'
    
    # Clean up and display meaningful chunks
    $lines = $japaneseText -split '[\r\n]+'
    foreach ($line in $lines) {
        $cleanLine = $line.Trim()
        if ($cleanLine.Length -gt 5 -and $cleanLine.Contains("月") -or $cleanLine.Contains("旬") -or $cleanLine.Contains("学期")) {
            Write-Host $cleanLine
        }
    }
    
} catch {
    Write-Host "Extraction failed: $_"
}
