import 'dotenv/config';
import axios from 'axios';

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
const API_KEY = process.env.GEMINI_API_KEY;

export const analyzeSymptoms = async (req, res) => {
    try {
        const { 
            userId,
            symptoms,
            oxygenLevel,
            heartRate,
            notes
        } = req.body;

        if (!symptoms) {
            return res.status(400).json({ error: "Symptoms data is required" });
        }

        const prompt = `
            A patient has reported respiratory health symptoms. Analyze their condition and provide medical insights.
            
            **Patient Information**:
            - **User ID**: ${userId}
            - **Oxygen Level**: ${oxygenLevel}%
            - **Oxygen Status**: ${oxygenLevel >= 95 ? "Safe" : oxygenLevel >= 90 ? "Moderate" : "Risky"}
            - **Heart Rate**: ${heartRate ? heartRate + " BPM" : "Not provided"}
            
            **Reported Symptoms**:
            - Shortness of Breath: ${symptoms.shortnessOfBreath ? "Yes" : "No"}
            - Wheezing: ${symptoms.wheezing ? "Yes" : "No"}
            - Chest Tightness: ${symptoms.chestTightness ? "Yes" : "No"}
            - Coughing: ${symptoms.coughing}
            - Fever: ${symptoms.fever ? "Yes" : "No"}
            - Fatigue: ${symptoms.fatigue ? "Yes" : "No"}
            - Sputum Production: ${symptoms.sputumProduction}
            - Nighttime Symptoms: ${symptoms.nighttimeSymptoms ? "Yes" : "No"}

            **Additional Notes**: ${notes || "None"}

            ### **Analysis & Recommendations**
            1. **Possible Respiratory Conditions**:
               - Identify potential conditions such as **asthma, COPD, pneumonia, bronchitis, or respiratory infections** based on symptoms.
               - Assess severity using **oxygen level, heart rate, and symptoms**.

            2. **Risk Level**:
               - Categorize the case as **Mild, Moderate, or Severe** based on symptoms and vital signs.
               - Highlight warning signs that require **urgent medical attention**.

            3. **Actionable Recommendations**:
               - Home care strategies (if symptoms are mild).
               - When to **seek emergency medical care** (e.g., oxygen level dropping below 90%).
               - Preventive measures to maintain **better lung health**.
        `;

        const response = await axios.post(
            `${GEMINI_API_URL}?key=${API_KEY}`,
            {
                contents: [{ parts: [{ text: prompt }] }]
            },
            { headers: { "Content-Type": "application/json" } }
        );

        res.json({ diagnosis: response.data.candidates[0].content.parts[0].text });

    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Something went wrong, please try again later." });
    }
};
