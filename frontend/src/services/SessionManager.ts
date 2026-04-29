import Dexie, { type Table } from 'dexie';

export interface SessionData {
  id?: number;
  timestamp: number;
  sessionId: string;
  type: string;
  data: any;
}

export class SessionDatabase extends Dexie {
  telemetry!: Table<SessionData>;

  constructor() {
    super('GroundControlSessionDB');
    this.version(1).stores({
      telemetry: '++id, sessionId, type, timestamp'
    });
  }
}

export const db = new SessionDatabase();

export class SessionManager {
  private currentSessionId: string | null = null;
  private isRecording: boolean = false;
  private buffer: SessionData[] = [];
  private readonly BATCH_SIZE = 50;

  start() {
    this.currentSessionId = `session-${Date.now()}`;
    this.isRecording = true;
    console.log(`Started recording session: ${this.currentSessionId}`);
  }

  addData(type: string, data: any) {
    if (!this.isRecording || !this.currentSessionId) return;

    this.buffer.push({
      timestamp: Date.now(),
      sessionId: this.currentSessionId,
      type,
      data: JSON.parse(JSON.stringify(data)) // Deep copy
    });

    if (this.buffer.length >= this.BATCH_SIZE) {
      this.flush();
    }
  }

  private async flush() {
    if (this.buffer.length === 0) return;
    const batch = [...this.buffer];
    this.buffer = [];
    
    try {
      await db.telemetry.bulkAdd(batch);
    } catch (err) {
      console.error('Failed to save session batch', err);
    }
  }

  async stop() {
    this.isRecording = false;
    await this.flush();
    console.log(`Stopped recording session: ${this.currentSessionId}`);
    this.currentSessionId = null;
  }
  
  getIsRecording() {
    return this.isRecording;
  }
  
  getSessionId() {
    return this.currentSessionId;
  }
}

export const sessionManager = new SessionManager();
