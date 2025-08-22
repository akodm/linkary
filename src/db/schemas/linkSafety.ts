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
import { users } from '@/db/schemas/users';

export const linkSafety = pgTable('link_safety', {
  id: serial('id').primaryKey(),
  safe: boolean('safe').notNull().default(false), // URL 검사 시 악성 여부
  reason: text('reason').notNull().default(''), // URL 검사 시 악성일 경우 사유
  // 검사자
  userId: integer('user_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  linkId: integer('link_id')
    .references(() => link.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const linkSafetyRelations = relations(linkSafety, ({ one }) => ({
  user: one(users, {
    fields: [linkSafety.userId],
    references: [users.id],
  }),
  link: one(link, {
    fields: [linkSafety.linkId],
    references: [link.id],
  }),
}));

export type InsertLinkSafety = typeof linkSafety.$inferInsert;
export type SelectLinkSafety = typeof linkSafety.$inferSelect;
