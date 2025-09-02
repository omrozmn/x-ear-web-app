#!/bin/bash
# Setup script for spaCy Backend Service

echo "🚀 Setting up spaCy Backend Service for X-Ear CRM..."

# Create virtual environment
echo "📦 Creating Python virtual environment..."
python3 -m venv spacy-env

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source spacy-env/bin/activate

# Upgrade pip
echo "⬆️ Upgrading pip..."
pip install --upgrade pip

# Install requirements
echo "📚 Installing Python dependencies..."
pip install -r requirements.txt

# Download Turkish spaCy models
echo "🇹🇷 Downloading Turkish spaCy language models..."
python -m spacy download tr_core_news_lg
echo "📦 Downloading smaller Turkish model as fallback..."
python -m spacy download tr_core_news_sm

# Test installation
echo "🧪 Testing spaCy installation..."
python -c "
import spacy
print('✅ spaCy imported successfully')
try:
    nlp = spacy.load('tr_core_news_lg')
    print('✅ Turkish large model loaded successfully')
except:
    try:
        nlp = spacy.load('tr_core_news_sm')
        print('✅ Turkish small model loaded successfully')
    except:
        print('❌ No Turkish models found')
        exit(1)

# Test Flask
try:
    from flask import Flask
    print('✅ Flask imported successfully')
except:
    print('❌ Flask import failed')
    exit(1)

print('🎉 Setup completed successfully!')
"

echo ""
echo "🎯 Setup Complete!"
echo ""
echo "To start the spaCy backend service:"
echo "1. Activate environment: source spacy-env/bin/activate"
echo "2. Start server: python app.py"
echo "3. Test endpoint: curl http://localhost:5000/health"
echo ""
echo "The service will be available at: http://localhost:5000"
echo ""
