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
import { linkReport } from '@/db/schemas/linkReport';

export const link = pgTable('link', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  title: text('title').notNull().default(''),
  description: text('description').notNull().default(''),
  image: text('image').notNull().default(''),
  tags: text('tags').notNull().default('[]'),
  order: integer('order').notNull().default(0),
  verified: boolean('verified').notNull().default(false), // URL 검증 여부 (시도 여부만 확인)
  view: integer('view').notNull().default(0),
  report: integer('report').notNull().default(0), // 신고 수 (신고 수가 5 이상이면 누적 신고된 URL 로 표시)
  banned: boolean('banned').notNull().default(false), // 차단 여부, 차단은 즉시 표시하지 않음 (관리자에 의해서만 차단 처리 가능)
  bannedReason: text('banned_reason').notNull().default(''), // 차단 사유
  bannedAt: timestamp('banned_at', { withTimezone: true }), // 차단 일시
  userId: integer('user_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  linkFolderId: integer('link_folder_id').references(() => linkFolder.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
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
  linkReports: many(linkReport),
}));

export type InsertLink = typeof link.$inferInsert;
export type SelectLink = typeof link.$inferSelect;
