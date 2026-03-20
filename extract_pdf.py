import sys
import os

# Try to import pdf libraries
try:
    import PyPDF2
    print("PyPDF2 available")
except ImportError:
    print("PyPDF2 not available")

try:
    import pdfplumber
    print("pdfplumber available")
except ImportError:
    print("pdfplumber not available")

# Try to read the PDF file
pdf_path = "calendar.pdf"
if os.path.exists(pdf_path):
    print(f"PDF file exists: {pdf_path}")
    print(f"File size: {os.path.getsize(pdf_path)} bytes")
else:
    print(f"PDF file not found: {pdf_path}")
