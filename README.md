# Onderzoek-AI-bot

Doel:
Een AI-chatbot bouwen die klantvragen over behandelingen, producten en afspraken beantwoordt – vriendelijk, veilig en correct.

Wat heb je nodig?
Onderdeel	Tool
Chat UI	HTML + JavaScript of Webflow Embed
Backend	Node.js + Express
AI	OpenAI GPT-4 API
Kennisbank	Eigen content (bv. JSON met chunks)
Begrip van vragen	Embeddings + cosine similarity
Beperkingen	System prompt + inputfilter

Werking (simpel uitgelegd)
Gebruiker stelt vraag (bijv. “ik heb rode vlekken”)

Backend zoekt relevante info uit Cosmetique-data (RAG)

Prompt wordt gebouwd met GPT + context

GPT geeft antwoord terug aan de gebruiker

Bij rare vragen → veilig standaardantwoord

Veiligheid
Geen medisch advies via prompt-instructies

Inputfilter op verboden woorden

Fallback-antwoord bij risico

