#!/usr/bin/env python3
"""
Simple launcher for The Cheater's Dilemma FastAPI server.
Equivalent to package.json scripts for Node.js projects.
"""

import sys
import os
from pathlib import Path

# Add the current directory to Python path for imports
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting The Cheater's Dilemma API Server...")
    print("📊 API Docs: http://localhost:8000/docs")
    print("💚 Health Check: http://localhost:8000/health")
    print("Press Ctrl+C to stop\n")

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )