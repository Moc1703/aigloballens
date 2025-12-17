from flask import Flask, jsonify, send_file
from flask_cors import CORS
import subprocess
import sys
import os

app = Flask(__name__)
CORS(app)  # Allow dashboard.html to call this

@app.route('/dashboard.html')
@app.route('/')
def dashboard():
    """Serve the dashboard HTML page."""
    return send_file('dashboard.html')

@app.route('/generate', methods=['POST'])
def generate():
    """Run the main.py script to generate news."""
    try:
        # Run main.py
        result = subprocess.run(
            [sys.executable, 'main.py'],
            cwd=os.path.dirname(__file__),
            capture_output=True,
            text=True,
            timeout=300  # 5 minute timeout
        )
        
        if result.returncode == 0:
            # Count articles in news.json
            import json
            with open('data/news.json', 'r', encoding='utf-8') as f:
                articles = json.load(f)
            
            return jsonify({
                'success': True,
                'count': len(articles),
                'output': result.stdout
            })
        else:
            return jsonify({
                'success': False,
                'error': result.stderr or 'Unknown error'
            }), 500
            
    except subprocess.TimeoutExpired:
        return jsonify({
            'success': False,
            'error': 'Operation timed out (5 minutes)'
        }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/upload', methods=['POST'])
def upload():
    """Run the upload.py script to sync to Vercel."""
    try:
        # Run upload.py
        result = subprocess.run(
            [sys.executable, 'upload.py'],
            cwd=os.path.dirname(__file__),
            capture_output=True,
            text=True,
            timeout=60  # 1 minute timeout
        )
        
        if 'Success!' in result.stdout or result.returncode == 0:
            # Parse output to extract stats
            import re
            inserted = re.search(r'Inserted: (\d+)', result.stdout)
            updated = re.search(r'Updated: (\d+)', result.stdout)
            
            return jsonify({
                'success': True,
                'inserted': int(inserted.group(1)) if inserted else 0,
                'updated': int(updated.group(1)) if updated else 0,
                'output': result.stdout
            })
        else:
            return jsonify({
                'success': False,
                'error': result.stderr or result.stdout or 'Upload failed'
            }), 500
            
    except subprocess.TimeoutExpired:
        return jsonify({
            'success': False,
            'error': 'Upload timed out (1 minute)'
        }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("="*60)
    print("  GlobalLens AI - Dashboard Server")
    print("  Open: http://localhost:5000/dashboard.html")
    print("="*60)
    app.run(port=5000, debug=True)
