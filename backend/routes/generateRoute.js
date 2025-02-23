import express from "express";

const generateRouter = express.Router();

// Initialize previous values with reasonable starting points
let prevBpm = 80;
let prevOxygenLevel = 98;

function generateHealthData() {
    const bpmChange = Math.floor(Math.random() * 10) - 5;  // Change between -5 to +5
    const oxygenChange = Math.floor(Math.random() * 4) - 2; // Change between -2 to +2

    let newBpm = Math.max(40, Math.min(180, prevBpm + bpmChange));
    let newOxygenLevel = Math.max(70, Math.min(100, prevOxygenLevel + oxygenChange));

    prevBpm = newBpm;
    prevOxygenLevel = newOxygenLevel;

    return {
        bpm: newBpm,
        oxygen_level: newOxygenLevel
    };
}

// Generate initial data
let healthData = generateHealthData();

// Update values every 5 minutes
setInterval(() => {
    healthData = generateHealthData();
}, 300000); // 300000 ms = 5 minutes

generateRouter.get("/", (req, res) => {
    res.json(healthData);
});

export default generateRouter;
