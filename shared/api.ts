/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Database API Types
 */
export interface DatabaseHealthResponse {
  status: "ok" | "error";
  message: string;
  error?: string;
}

export interface DatabaseStatsResponse {
  users: number;
  payments: number;
  subscriptions: number;
}

export interface User {
  id?: string;
  user_id: string;
  email: string;
  plan_type: "free" | "basic" | "pro";
  status: "active" | "inactive" | "banned" | "cancelled";
  created_at?: string;
  updated_at?: string;
  location?: string;
  last_seen?: string;
}

export interface UserResponse {
  user: User;
}

export interface UpsertUserRequest {
  user_id: string;
  email: string;
  plan_type?: "free" | "basic" | "pro";
  status?: "active" | "inactive" | "banned" | "cancelled";
}

export interface UpsertUserResponse {
  success: boolean;
  user: User;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

export interface TableTestResult {
  status: "ok" | "error";
  error?: string;
  hasData: boolean;
}

export interface TestTablesResponse {
  tables: Record<string, TableTestResult>;
}
