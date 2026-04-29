import express from 'express';
import Session from '../models/Session';

const router = express.Router();

// @route   POST /api/sessions
// @desc    Start a new session
router.post('/', async (req, res) => {
  try {
    const { robotId, operatorName, metadata } = req.body;
    console.log(`[BACKEND] Starting new session for Robot: ${robotId}`);
    const session = new Session({
      robotId,
      operatorName,
      metadata,
      status: 'active',
      startTime: new Date()
    });
    const savedSession = await session.save();
    res.status(201).json(savedSession);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @route   PATCH /api/sessions/:id
// @desc    End a session
router.patch('/:id', async (req, res) => {
  try {
    const { status, metadata } = req.body;
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    session.status = status || 'completed';
    session.endTime = new Date();
    if (metadata) {
      session.metadata = { ...session.metadata, ...metadata };
    }

    const updatedSession = await session.save();
    res.json(updatedSession);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @route   GET /api/sessions
// @desc    Get all sessions
router.get('/', async (req, res) => {
  try {
    const sessions = await Session.find().sort({ startTime: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;
