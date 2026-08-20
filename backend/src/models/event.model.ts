import pool from "../config/database";

export interface Event {
  id: number;
  name: string;
  description: string | null;
  date: string;
  location: string | null;
  owner_name: string;
  owner_email: string | null;
  created_at: string;
}

export interface CreateEventInput {
  name: string;
  description?: string;
  date: string;
  location?: string;
  owner_name?: string;
  owner_email?: string;
}

export type UpdateEventInput = Partial<CreateEventInput>;

export interface EventFilters {
  search?: string;
  location?: string;
  sort?: "asc" | "desc";
}

export const EventModel = {
  async create(input: CreateEventInput): Promise<Event> {
    const { rows } = await pool.query<Event>(
      `INSERT INTO events (name, description, date, location, owner_name, owner_email)
       VALUES ($1, $2, $3, $4, COALESCE(NULLIF($5, ''), 'Event Owner'), NULLIF($6, ''))
       RETURNING *`,
      [
        input.name,
        input.description || null,
        input.date,
        input.location || null,
        input.owner_name || "",
        input.owner_email || "",
      ],
    );
    return rows[0];
  },

  async findAll(filters: EventFilters = {}): Promise<Event[]> {
    const conditions: string[] = [];
    const values: unknown[] = [];

    if (filters.search) {
      values.push(`%${filters.search}%`);
      conditions.push(`name ILIKE $${values.length}`);
    }
    if (filters.location) {
      values.push(`%${filters.location}%`);
      conditions.push(`location ILIKE $${values.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const order = filters.sort === "desc" ? "DESC" : "ASC";

    const { rows } = await pool.query<Event>(
      `SELECT * FROM events ${where} ORDER BY date ${order}, id ${order}`,
      values,
    );
    return rows;
  },

  async findById(id: number): Promise<Event | null> {
    const { rows } = await pool.query<Event>(`SELECT * FROM events WHERE id = $1`, [id]);
    return rows[0] ?? null;
  },

  async update(id: number, input: UpdateEventInput): Promise<Event | null> {
    const fields: string[] = [];
    const values: unknown[] = [];

    const settable: Record<string, unknown> = {
      name: input.name,
      description: input.description,
      date: input.date,
      location: input.location,
      owner_name: input.owner_name,
      owner_email: input.owner_email,
    };

    for (const [key, value] of Object.entries(settable)) {
      if (value !== undefined) {
        values.push(value);
        fields.push(`${key} = $${values.length}`);
      }
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const { rows } = await pool.query<Event>(
      `UPDATE events SET ${fields.join(", ")} WHERE id = $${values.length} RETURNING *`,
      values,
    );
    return rows[0] ?? null;
  },

  async remove(id: number): Promise<boolean> {
    const { rowCount } = await pool.query(`DELETE FROM events WHERE id = $1`, [id]);
    return (rowCount ?? 0) > 0;
  },
};
