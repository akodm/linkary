import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { link } from '@/db/schemas/link';

export const linkSafety = pgTable('link_safety', {
  id: serial('id').primaryKey(),
  safe: boolean('safe').notNull().default(false),
  reason: text('reason').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  linkId: integer('link_id')
    .references(() => link.id, {
      onDelete: 'cascade',
    })
    .notNull(),
});

export const linkSafetyRelations = relations(linkSafety, ({ one }) => ({
  link: one(link, {
    fields: [linkSafety.linkId],
    references: [link.id],
  }),
}));

export type InsertLinkSafety = typeof linkSafety.$inferInsert;
export type SelectLinkSafety = typeof linkSafety.$inferSelect;
