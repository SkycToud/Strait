# Try to extract text from PDF using different methods
$pdfPath = "calendar.pdf"

# Method 1: Try to read as text file (might work for simple PDFs)
try {
    $bytes = [System.IO.File]::ReadAllBytes($pdfPath)
    $text = [System.Text.Encoding]::ASCII.GetString($bytes)
    Write-Host "Attempt 1 - ASCII extraction:"
    Write-Host $text.Substring(0, [Math]::Min(1000, $text.Length))
    Write-Host "---"
} catch {
    Write-Host "ASCII extraction failed: $_"
}

# Method 2: Try UTF-8 encoding
try {
    $bytes = [System.IO.File]::ReadAllBytes($pdfPath)
    $text = [System.Text.Encoding]::UTF8.GetString($bytes)
    Write-Host "Attempt 2 - UTF8 extraction:"
    Write-Host $text.Substring(0, [Math]::Min(1000, $text.Length))
    Write-Host "---"
} catch {
    Write-Host "UTF8 extraction failed: $_"
}

# Method 3: Check if we can find any Japanese text patterns
try {
    $bytes = [System.IO.File]::ReadAllBytes($pdfPath)
    $text = [System.Text.Encoding]::Unicode.GetString($bytes)
    Write-Host "Attempt 3 - Unicode extraction:"
    Write-Host $text.Substring(0, [Math]::Min(1000, $text.Length))
    Write-Host "---"
} catch {
    Write-Host "Unicode extraction failed: $_"
}

Write-Host "PDF file size: $([System.IO.File]::GetLength($pdfPath)) bytes"
