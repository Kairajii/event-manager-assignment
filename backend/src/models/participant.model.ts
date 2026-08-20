import pool from "../config/database";

export interface Participant {
  id: number;
  event_id: number;
  name: string;
  email: string;
  status: "registered" | "cancelled";
  cancellation_reason: string | null;
  registered_at: string;
  cancelled_at: string | null;
}

export const ParticipantModel = {
  async create(eventId: number, name: string, email: string): Promise<Participant> {
    const { rows } = await pool.query<Participant>(
      `INSERT INTO event_participants (event_id, name, email)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [eventId, name, email],
    );
    return rows[0];
  },

  async findByEvent(eventId: number): Promise<Participant[]> {
    const { rows } = await pool.query<Participant>(
      `SELECT * FROM event_participants WHERE event_id = $1 ORDER BY registered_at ASC`,
      [eventId],
    );
    return rows;
  },

  async findById(id: number): Promise<Participant | null> {
    const { rows } = await pool.query<Participant>(`SELECT * FROM event_participants WHERE id = $1`, [id]);
    return rows[0] ?? null;
  },

  async cancel(id: number, reason: string): Promise<Participant | null> {
    const { rows } = await pool.query<Participant>(
      `UPDATE event_participants
       SET status = 'cancelled', cancellation_reason = $2, cancelled_at = now()
       WHERE id = $1
       RETURNING *`,
      [id, reason],
    );
    return rows[0] ?? null;
  },
};
