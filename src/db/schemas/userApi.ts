import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { users } from '@/db/schemas/users';
import { api } from '@/db/schemas/api';

export const userApi = pgTable('user_api', {
  id: serial('id').primaryKey(),
  usage: integer('usage').notNull().default(0),
  cumulativeUsage: integer('cumulative_usage').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  userId: integer('user_id')
    .references(() => users.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  apiId: integer('api_id')
    .references(() => api.id, {
      onDelete: 'cascade',
    })
    .notNull(),
});

export const userApiRelations = relations(userApi, ({ one }) => ({
  user: one(users, {
    fields: [userApi.userId],
    references: [users.id],
  }),
  api: one(api, {
    fields: [userApi.apiId],
    references: [api.id],
  }),
}));

export type InsertUserApi = typeof userApi.$inferInsert;
export type SelectUserApi = typeof userApi.$inferSelect;
