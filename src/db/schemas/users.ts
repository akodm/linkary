import { relations, sql } from 'drizzle-orm';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { userApi } from '@/db/schemas/userApi';
import { linkFolder } from '@/db/schemas/linkFolder';
import { link } from '@/db/schemas/link';
import { linkView } from '@/db/schemas/linkView';
import { linkReport } from '@/db/schemas/linkReport';
import { linkSafety } from '@/db/schemas/linkSafety';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  role: text('role').notNull().default('user'), // 사용자 권한 (user, admin)
  name: text('name').notNull().default(''), // 사용자 이름
  // 사용자 고유 식별자
  slug: text('slug')
    .notNull()
    .unique()
    .default(sql`gen_random_uuid()`),
  provider: text('provider').notNull().default(''), // 사용자 제공자 (google, github 등)
  providerId: text('provider_id').notNull().default(''), // 사용자 제공자 고유 식별자
  locale: text('locale').notNull().default('en'), // 사용자 언어
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  userApis: many(userApi),
  links: many(link),
  linkFolders: many(linkFolder),
  linkViews: many(linkView),
  linkReports: many(linkReport),
  linkSafety: many(linkSafety),
}));

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
