import { pgTable, text, integer, jsonb, timestamp, uuid, boolean, date, index, varchar } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Session storage table for express-session
export const sessions = pgTable(
  'sessions',
  {
    sid: varchar('sid').primaryKey(),
    sess: jsonb('sess').notNull(),
    expire: timestamp('expire').notNull(),
  },
  (table) => ({
    expireIdx: index('IDX_session_expire').on(table.expire),
  })
);

// Users table for Replit Auth integration (linked to profiles)
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  profileImageUrl: text('profile_image_url'),
  profileId: uuid('profile_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const scenarios = pgTable('scenarios', {
  id: text('id').primaryKey(),
  category: text('category').notNull(),
  title: text('title').notNull(),
  scenario: text('scenario').notNull(),
  question: text('question').notNull(),
  options: jsonb('options').notNull(),
  correct: integer('correct').notNull(),
  explanation: text('explanation').notNull(),
  difficulty: text('difficulty').notNull(),
  context: text('context').notNull(),
  timeOfDay: text('time_of_day'),
  weather: text('weather'),
  language: text('language').notNull().default('en'),
  location: jsonb('location'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  categoryIdx: index('idx_scenarios_category').on(table.category),
  difficultyIdx: index('idx_scenarios_difficulty').on(table.difficulty),
}));

export const questions = pgTable('questions', {
  id: text('id').primaryKey(),
  category: text('category').notNull(),
  question: text('question').notNull(),
  options: jsonb('options').notNull(),
  correct: integer('correct').notNull(),
  explanation: text('explanation').notNull(),
  difficulty: text('difficulty'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  categoryIdx: index('idx_questions_category').on(table.category),
}));

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  email: text('email'),
  fullName: text('full_name'),
  locationCity: text('location_city'),
  locationRegion: text('location_region'),
  locationNeighborhood: text('location_neighborhood'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const userProgress = pgTable('user_progress', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').notNull(),
  testType: text('test_type').notNull(),
  score: integer('score').notNull(),
  totalQuestions: integer('total_questions').notNull(),
  categories: jsonb('categories').notNull(),
  passed: boolean('passed').notNull(),
  locationUsed: text('location_used'),
  completedAt: timestamp('completed_at', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_user_progress_user_id').on(table.userId),
  completedAtIdx: index('idx_user_progress_completed_at').on(table.completedAt),
  testTypeIdx: index('idx_user_progress_test_type').on(table.testType),
  passedIdx: index('idx_user_progress_passed').on(table.passed),
}));

export const userScenarios = pgTable('user_scenarios', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').notNull(),
  scenarioId: text('scenario_id').notNull(),
  answeredCorrectly: boolean('answered_correctly').notNull(),
  timeTaken: integer('time_taken').notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_user_scenarios_user_id').on(table.userId),
  scenarioIdIdx: index('idx_user_scenarios_scenario_id').on(table.scenarioId),
  completedAtIdx: index('idx_user_scenarios_completed_at').on(table.completedAt),
}));

export const dailyUsage = pgTable('daily_usage', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').notNull(),
  date: date('date').notNull(),
  scenariosUsed: integer('scenarios_used').notNull().default(0),
  questionsUsed: integer('questions_used').notNull().default(0),
  maxScenarios: integer('max_scenarios').notNull().default(5),
  maxQuestions: integer('max_questions').notNull().default(10),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_daily_usage_user_id').on(table.userId),
  dateIdx: index('idx_daily_usage_date').on(table.date),
  userDateIdx: index('idx_daily_usage_user_date').on(table.userId, table.date),
}));

export const userSubscriptions = pgTable('user_subscriptions', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').notNull(),
  planType: text('plan_type').notNull().default('free'),
  status: text('status').notNull().default('active'),
  startDate: timestamp('start_date', { withTimezone: true }).notNull().defaultNow(),
  endDate: timestamp('end_date', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_user_subscriptions_user_id').on(table.userId),
  statusIdx: index('idx_user_subscriptions_status').on(table.status),
}));

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').notNull(),
  amountCents: integer('amount_cents').notNull(),
  status: text('status').notNull(),
  paymentMethod: text('payment_method'),
  transactionId: text('transaction_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_payments_user_id').on(table.userId),
  statusIdx: index('idx_payments_status').on(table.status),
}));

export type Session = typeof sessions.$inferSelect;
export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;
export type Scenario = typeof scenarios.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type UserScenario = typeof userScenarios.$inferSelect;
export type DailyUsage = typeof dailyUsage.$inferSelect;
export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type Payment = typeof payments.$inferSelect;
