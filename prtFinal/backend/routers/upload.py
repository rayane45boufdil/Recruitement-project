from flask import Flask, request, jsonify
from pdfminer.high_level import extract_text
import spacy

app = Flask(__name__)

# Load spaCy English language model
nlp = spacy.load("en_core_web_sm")

# Predefined list of skills (can be expanded or dynamically loaded)
SKILLS = [
    "JavaScript", "React", "Node.js", "Python", "Java",
    "HTML", "CSS", "SQL", "Data Analysis", "Project Management",
    "Machine Learning", "Deep Learning", "Cloud Computing",
    "Cybersecurity", "DevOps", "UI/UX Design"
]

def extract_skills_from_text(text):
    """
    Extract skills from a given text using spaCy and a predefined skill set.
    """
    doc = nlp(text)
    skills_found = set()

    # Match skills from predefined list
    for token in doc:
        if token.text in SKILLS:
            skills_found.add(token.text)

    return list(skills_found)

@app.route("/upload-cv", methods=["POST"])
def upload_cv():
    if "cv" not in request.files:
        return jsonify({"error": "No CV file provided."}), 400

    file = request.files["cv"]

    try:
        # Extract text from the uploaded PDF
        text = extract_text(file)
        skills = extract_skills_from_text(text)

        return jsonify({"message": "Skills extracted successfully.", "skills": skills}), 200
    except Exception as e:
        print("Error extracting skills:", str(e))
        return jsonify({"error": "Failed to process the CV."}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
