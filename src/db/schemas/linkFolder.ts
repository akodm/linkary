import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { users } from '@/db/schemas/users';
import { link } from '@/db/schemas/link';

export const linkFolder = pgTable('link_folder', {
  id: serial('id').primaryKey(),
  slug: text('slug')
    .notNull()
    .unique()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  userId: integer('user_id')
    .references(() => users.id, {
      onDelete: 'cascade',
    })
    .notNull(),
});

export const linkFolderRelations = relations(linkFolder, ({ one, many }) => ({
  user: one(users, {
    fields: [linkFolder.userId],
    references: [users.id],
  }),
  links: many(link),
}));

export type InsertLinkFolder = typeof linkFolder.$inferInsert;
export type SelectLinkFolder = typeof linkFolder.$inferSelect;
