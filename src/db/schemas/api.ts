import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { userApi } from '@/db/schemas/userApi';

export const api = pgTable('api', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().default(''),
  usage: integer('usage').notNull().default(0),
  limit: integer('limit').notNull().default(1000),
  enterprise: boolean('enterprise').notNull().default(false),
});

export const apiRelations = relations(api, ({ many }) => ({
  userApis: many(userApi),
}));

export type InsertApi = typeof api.$inferInsert;
export type SelectApi = typeof api.$inferSelect;
