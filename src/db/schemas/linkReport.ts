import { pgTable, serial, integer, text, timestamp } from 'drizzle-orm/pg-core';
import { link } from '@/db/schemas/link';
import { relations } from 'drizzle-orm';
import { users } from '@/db/schemas/users';

export const linkReport = pgTable('link_report', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, {
    // 신고자
    onDelete: 'set null',
  }),
  linkId: integer('link_id')
    .references(() => link.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  reason: text('reason').notNull().default(''), // 신고 사유
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const linkReportRelations = relations(linkReport, ({ one }) => ({
  user: one(users, {
    fields: [linkReport.userId],
    references: [users.id],
  }),
  link: one(link, {
    fields: [linkReport.linkId],
    references: [link.id],
  }),
}));

export type InsertLinkReport = typeof linkReport.$inferInsert;
export type SelectLinkReport = typeof linkReport.$inferSelect;
