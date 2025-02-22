import 'dotenv/config';
import axios from 'axios';

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
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




// import 'dotenv/config';
// import axios from 'axios';

// const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
// const API_KEY = process.env.GEMINI_API_KEY;

// export const analyzeSymptoms = async (symptoms,oxygenLevel,heartRate,notes) => {
//     try {

//         if (!symptoms) {
//             return res.status(400).json({ error: "Symptoms data is required" });
//         }

//         const prompt = `
//         A patient has reported respiratory health symptoms. Analyze their condition and provide medical insights.
        
//         *Patient Information*:
//         - *Oxygen Level*: ${oxygenLevel}%
//         - *Oxygen Status*: ${oxygenLevel >= 95 ? "Safe" : oxygenLevel >= 90 ? "Moderate" : "Risky"}
//         - *Heart Rate*: ${heartRate ? heartRate + " BPM" : "Not provided"}
        
//         *Reported Symptoms*:
//         - Shortness of Breath: ${symptoms.shortnessOfBreath ? "Yes" : "No"}
//         - Wheezing: ${symptoms.wheezing ? "Yes" : "No"}
//         - Chest Tightness: ${symptoms.chestTightness ? "Yes" : "No"}
//         - Coughing: ${symptoms.coughing}
//         - Fever: ${symptoms.fever ? "Yes" : "No"}
//         - Fatigue: ${symptoms.fatigue ? "Yes" : "No"}
//         - Sputum Production: ${symptoms.sputumProduction}
//         - Nighttime Symptoms: ${symptoms.nighttimeSymptoms ? "Yes" : "No"}

//         *Additional Notes*: ${notes || "None"}

//         *Analysis & Recommendations*
//         1. *Possible Respiratory Conditions*:
//            - Identify potential conditions such as *asthma, COPD, pneumonia, bronchitis, tuberculosis, or respiratory infections*.
//            - Assess severity using *oxygen level, heart rate, and symptoms*.

//         2. *Risk Level*:
//            - Categorize the case as *Mild, Moderate, or Severe* based on symptoms and vital signs.
//            - Highlight warning signs that require *urgent medical attention*.

//         3. *Actionable Recommendations*:
//            - Home care strategies (if symptoms are mild).
//            - When to *seek emergency medical care* (e.g., oxygen level dropping below 90%).
//            - Preventive measures to maintain *better lung health*.

//         4. *Doctor Specialization Recommendation*:
//            - *Pulmonologist*: If symptoms suggest chronic lung diseases (e.g., COPD, severe asthma, persistent shortness of breath).
//            - *Immunologist*: If symptoms indicate an allergic reaction or immune-related respiratory issues.
//            - *General Physician*: If symptoms are mild, seasonal, or non-chronic but need evaluation.
//            - *Emergency Care*: If oxygen levels fall below 88%, chest pain occurs, or severe breathing difficulties persist.

//         Provide a structured diagnosis, including *risk level, potential conditions, and which type of doctor the patient should consult*.
//         `;

//         const response = await axios.post(
//             `${GEMINI_API_URL}?key=${API_KEY}`,
//             {
//                 contents: [{ parts: [{ text: prompt }] }]
//             },
//             { headers: { "Content-Type": "application/json" } }
//         )
//         if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
//             return response.data.candidates[0].content.parts[0].text;
//         } else {
//             return "No meaningful data received from API.";
//         }

//     } catch (error) {
//         console.error("Error:", error.response?.data || error.message);
//         return " No Data...";
//     }
// };
