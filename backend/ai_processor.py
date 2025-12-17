import ollama
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class AIProcessor:
    def __init__(self, model="llama3.1"):
        """
        Initialize with the specific Ollama model.
        Defaulting to llama3.1 as it is generally good for multilingual tasks, 
        but user can swap if they have mistral or others.
        """
        self.model = model

    def rewrite_article(self, title, content, source_name):
        """
        Rewrites the article into professional Indonesian market analysis.
        """
        prompt = f"""
You are a Senior Market Analyst at a leading Indonesian financial intelligence firm (like Bloomberg Terminal or Reuters Eikon).
Your task is to transform the following news into ACTIONABLE MARKET INTELLIGENCE for Indonesian traders and investors.

**Source Information:**
Original Title: {title}
Source: {source_name}

**YOUR MISSION:**
1.  **Language**: Professional Indonesian (Bahasa Indonesia formal).
2.  **Tone**: Authoritative, analytical, data-driven. NO sensationalism.
3.  **Structure**:
    -   **Lead**: What happened? (1-2 sentences max)
    -   **Market Impact**: How does this affect stocks, forex, crypto, or commodities? Be specific.
    -   **Key Players**: Companies, countries, or figures involved.
    -   **Trader's Takeaway**: What should traders watch? Buy/Sell signals? Resistance/support levels if known.
4.  **Headline**: Create a sharp, impactful headline. Example: "BI Tahan Suku Bunga: Saham Properti Tertekan, IHSG Cenderung Sideways"
5.  **Summary**: A 2-sentence "briefing" for quick scan.
6.  **Category**: Classify as one of: "STOCKS", "CRYPTO", "FOREX", "COMMODITIES", "GEOPOLITICS", "MACRO"

**Original Content:**
{content[:4000]}

**Output Format (JSON strictly):**
{{
    "title": "Your Indonesian Market Headline",
    "summary": "Your 2-sentence briefing.",
    "content": "The full market analysis in markdown format (use ## for subheadings, **bold** for emphasis).",
    "category": "STOCKS or CRYPTO or FOREX or COMMODITIES or GEOPOLITICS or MACRO"
}}
"""
        try:
            logging.info(f"Processing article: {title}")
            response = ollama.chat(model=self.model, messages=[
                {
                    'role': 'user',
                    'content': prompt,
                },
            ], format='json')

            result_json = response['message']['content']
            parsed_result = json.loads(result_json)
            return parsed_result

        except Exception as e:
            logging.error(f"Error processing article '{title}': {e}")
            return None
