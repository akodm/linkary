import { relations, sql } from 'drizzle-orm';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { userApi } from '@/db/schemas/userApi';
import { linkFolder } from '@/db/schemas/linkFolder';
import { link } from '@/db/schemas/link';
import { linkView } from '@/db/schemas/linkView';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  role: text('role').notNull().default('user'),
  name: text('name').notNull().default(''),
  slug: text('slug')
    .notNull()
    .unique()
    .default(sql`gen_random_uuid()`),
  provider: text('provider').notNull().default(''),
  providerId: text('provider_id').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  userApis: many(userApi),
  links: many(link),
  linkFolders: many(linkFolder),
  linkViews: many(linkView),
}));

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
