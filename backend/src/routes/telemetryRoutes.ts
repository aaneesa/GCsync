import express from 'express';
import Telemetry from '../models/Telemetry';

const router = express.Router();

// @route   POST /api/telemetry
// @desc    Log a single telemetry data point
router.post('/', async (req, res) => {
  try {
    const { sessionId, type, data, timestamp } = req.body;
    const telemetry = new Telemetry({
      sessionId,
      type,
      data,
      timestamp: timestamp || new Date()
    });
    await telemetry.save();
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @route   POST /api/telemetry/batch
// @desc    Log multiple telemetry data points at once (Performance optimized)
router.post('/batch', async (req, res) => {
  try {
    const { readings } = req.body; // Array of telemetry objects
    if (!Array.isArray(readings)) {
      return res.status(400).json({ message: 'Readings must be an array' });
    }
    
    console.log(`[BACKEND] Received telemetry batch: ${readings.length} items`);
    await Telemetry.insertMany(readings);
    res.status(201).json({ success: true, count: readings.length });
  } catch (error) {
    console.error('[BACKEND ERROR] Failed to insert telemetry:', error);
    res.status(500).json({ 
      message: (error as Error).message,
      error: error
    });
  }
});

// @route   GET /api/telemetry/:sessionId
// @desc    Get telemetry for a specific session
router.get('/:sessionId', async (req, res) => {
  try {
    const { type } = req.query;
    const query: any = { sessionId: req.params.sessionId };
    if (type) query.type = type;

    const data = await Telemetry.find(query).sort({ timestamp: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;
