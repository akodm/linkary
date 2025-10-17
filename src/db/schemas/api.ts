import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { userApi } from '@/db/schemas/userApi';

export const api = pgTable('api', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().default(''), // Google Web Risk API, Tavily 등
  usage: integer('usage').notNull().default(0), // 현재까지 전체 사용량 (사용량 초기화 시 0으로 초기화)
  limit: integer('limit').notNull().default(-1), // -1 은 무제한
  totalLimit: integer('total_limit').notNull().default(-1), // -1 은 무제한
  enterprise: boolean('enterprise').notNull().default(false), // 결제 여부 (결제된 API 는 limit 가 필요 없음)
  initialDateType: text('initial_date_type').notNull().default('month'), // 초기화되는 날짜 (일, 월, 연 단위 등)
  initialDateValue: integer('initial_date_value').notNull().default(1), // 초기화되는 정확한 일자 (매월 1일 초기화 = type: month, value: 1 등)
});

export const apiRelations = relations(api, ({ many }) => ({
  userApis: many(userApi),
}));

export type InsertApi = typeof api.$inferInsert;
export type SelectApi = typeof api.$inferSelect;
