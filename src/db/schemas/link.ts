import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from '@/db/schemas/users';
import { linkFolder } from '@/db/schemas/linkFolder';
import { linkSafety } from '@/db/schemas/linkSafety';
import { linkView } from '@/db/schemas/linkView';

export const link = pgTable('link', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  title: text('title').notNull().default(''),
  description: text('description').notNull().default(''),
  image: text('image').notNull().default(''),
  tags: text('tags').notNull().default('[]'),
  verified: boolean('verified').notNull().default(false),
  view: integer('view').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  userId: integer('user_id')
    .references(() => users.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  linkFolderId: integer('link_folder_id').references(() => linkFolder.id, {
    onDelete: 'set null',
  }),
});

export const linkRelations = relations(link, ({ one, many }) => ({
  user: one(users, {
    fields: [link.userId],
    references: [users.id],
  }),
  linkFolder: one(linkFolder, {
    fields: [link.linkFolderId],
    references: [linkFolder.id],
  }),
  linkSafety: many(linkSafety),
  linkViews: many(linkView),
}));

export type InsertLink = typeof link.$inferInsert;
export type SelectLink = typeof link.$inferSelect;
