// =============================================================================
// KRONABEL CMS & FEEDBACK SYSTEM - TYPESCRIPT DEFINITIONS
// =============================================================================

export type UserRole = "superadmin" | "admin" | "editor";

export interface AdminUser {
  id: string;
  username: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  key: string;
  value: Record<string, unknown>;
  description?: string;
  updated_at: string;
  updated_by?: string;
}

export type ContentStatus = "draft" | "published";

export interface SiteContent {
  key: string;
  page: string;
  section: string;
  title?: string;
  content: Record<string, unknown>;
  status: ContentStatus;
  updated_at: string;
  updated_by?: string;
}

export type FeedbackCategory = "saran" | "kritik" | "bug" | "fitur" | "lainnya";
export type FeedbackStatus = "baru" | "dibaca" | "diproses" | "selesai";

export interface FeedbackItem {
  id: string;
  name?: string | null;
  email?: string | null;
  category: FeedbackCategory;
  message: string;
  status: FeedbackStatus;
  created_at: string;
  updated_at: string;
}

export interface MediaItem {
  name: string;
  id?: string;
  updated_at?: string;
  created_at?: string;
  last_accessed_at?: string;
  metadata?: Record<string, unknown>;
  publicUrl: string;
  size?: number;
}

