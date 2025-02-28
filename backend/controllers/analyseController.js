import 'dotenv/config';
import axios from 'axios';

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const API_KEY = process.env.GEMINI_API_KEY;

export const analyzeSymptoms = async (symptoms, oxygenLevel, heartRate, notes) => {
    try {
        if (!symptoms) {
            return { error: "Symptoms data is required" };
        }

        const prompt = `
        A patient has reported respiratory health symptoms. Analyze their condition and return a structured JSON object.
        
        *Patient Information*:
        - Oxygen Level: ${oxygenLevel}%
        - Oxygen Status: ${oxygenLevel >= 95 ? "Safe" : oxygenLevel >= 90 ? "Moderate" : "Risky"}
        - Heart Rate: ${heartRate ? heartRate + " BPM" : "Not provided"}
        
        *Reported Symptoms*:
        - Shortness of Breath: ${symptoms.shortnessOfBreath ? "Yes" : "No"}
        - Wheezing: ${symptoms.wheezing ? "Yes" : "No"}
        - Chest Tightness: ${symptoms.chestTightness ? "Yes" : "No"}
        - Coughing: ${symptoms.coughing}
        - Fever: ${symptoms.fever ? "Yes" : "No"}
        - Fatigue: ${symptoms.fatigue ? "Yes" : "No"}
        - Sputum Production: ${symptoms.sputumProduction}
        - Nighttime Symptoms: ${symptoms.nighttimeSymptoms ? "Yes" : "No"}

        *Additional Notes*: ${notes || "None"}
        
        Provide the response strictly as a JSON object with the following structure:
        {
            "RiskLevel": "Mild | Moderate | Severe",
            "PotentialConditions": ["Condition1", "Condition2"],
            "DoctorSpecialization": "Pulmonologist | Immunologist | General Physician | Emergency Care",
            "ActionableRecommendations": {
                "HomeCare": ["Tip1", "Tip2"],
                "EmergencyCare": ["Warning1", "Warning2"]
            }
        }
        `;

        const response = await axios.post(
            `${GEMINI_API_URL}?key=${API_KEY}`,
            {
                contents: [{ parts: [{ text: prompt }] }]
            },
            { headers: { "Content-Type": "application/json" } }
        );
        const responseText = response.data.candidates[0].content.parts[0].text.trim();

        try {
            // Remove markdown-style code blocks
            const cleanedText = responseText.replace(/^```json|```$/gi, "").trim();
            
            // Parse JSON
            return JSON.parse(cleanedText);
        } catch (parseError) {
            console.error("Failed to parse Gemini API response:", responseText);
            return { error: "Invalid response format from Gemini API." };
        }
        

    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        return { error: "No Data..." };
    }
};


