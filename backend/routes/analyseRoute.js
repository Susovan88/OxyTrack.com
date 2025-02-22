import express from 'express';
import { analyzeSymptoms } from '../controllers/analyseController.js';

const Analyzerouter = express.Router();

Analyzerouter.post('/', analyzeSymptoms);

export default Analyzerouter;
