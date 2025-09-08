import {
  pgTable,
  text,
  integer,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const payments = pgTable(
  "payments",
  {
    id: text("id").primaryKey(),
    amount: integer("amount").notNull(),
    description: text("description").notNull(),
    idempotencyKey: text("idempotency_key").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      idempotencyKeyIdx: uniqueIndex("idempotency_key_idx").on(
        table.idempotencyKey
      ),
    };
  }
);
