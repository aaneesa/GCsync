const API_BASE_URL = 'http://localhost:5001/api';

export interface SessionData {
  robotId: string;
  operatorName: string;
  metadata?: Record<string, any>;
}

export const TelemetryService = {
  /** Start a new session in MongoDB */
  async startSession(data: SessionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to start session:', error);
      return null;
    }
  },

  /** End an active session */
  async endSession(sessionId: string, status: 'completed' | 'failed' = 'completed') {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to end session:', error);
      return null;
    }
  },

  /** Log a batch of telemetry data points */
  async logBatch(readings: any[]) {
    try {
      await fetch(`${API_BASE_URL}/telemetry/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ readings }),
      });
    } catch (error) {
      console.error('Failed to log telemetry batch:', error);
    }
  }
};
