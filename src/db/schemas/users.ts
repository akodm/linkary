import { relations } from 'drizzle-orm';
import { pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { userApi } from '@/db/schemas/userApi';
import { linkFolder } from '@/db/schemas/linkFolder';
import { link } from '@/db/schemas/link';
import { linkView } from '@/db/schemas/linkView';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  userApis: many(userApi),
  links: many(link),
  linkFolders: many(linkFolder),
  linkViews: many(linkView),
}));

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
