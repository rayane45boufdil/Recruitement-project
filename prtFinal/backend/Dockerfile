# Étape 1 : Utiliser une image de base avec Python
FROM python:3.9

# Étape 2 : Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Étape 3 : Copier les fichiers de l’application dans le conteneur
COPY . /app

# Étape 4 : Installer les dépendances à partir de requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Étape 5 : Exposer le port sur lequel FastAPI tourne (par défaut 8000)
EXPOSE 8000

# Étape 6 : Démarrer l’application avec Uvicorn (serveur pour FastAPI)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
