import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { users } from '@/db/schemas/users';
import { link } from '@/db/schemas/link';
import { relations } from 'drizzle-orm';

export const linkView = pgTable('link_view', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  linkId: integer('link_id')
    .references(() => link.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const linkViewRelations = relations(linkView, ({ one }) => ({
  user: one(users, {
    fields: [linkView.userId],
    references: [users.id],
  }),
  link: one(link, {
    fields: [linkView.linkId],
    references: [link.id],
  }),
}));

export type InsertLinkView = typeof linkView.$inferInsert;
export type SelectLinkView = typeof linkView.$inferSelect;
