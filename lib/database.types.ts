export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          name: string
          status: string
          total_income: number
          total_expenses: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          status?: string
          total_income?: number
          total_expenses?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          status?: string
          total_income?: number
          total_expenses?: number
          updated_at?: string
        }
      }
      sites: {
        Row: {
          id: string
          project_id: string
          name: string
          location: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          location?: string
          status?: string
          created_at?: string
        }
        Update: {
          project_id?: string
          name?: string
          location?: string
          status?: string
        }
      }
      materials: {
        Row: {
          id: string
          site_id: string
          name: string
          quantity: number
          unit: string
          unit_price: number
          low_stock_threshold: number
          last_restocked: string
        }
        Insert: {
          id?: string
          site_id: string
          name: string
          quantity?: number
          unit?: string
          unit_price?: number
          low_stock_threshold?: number
          last_restocked?: string
        }
        Update: {
          site_id?: string
          name?: string
          quantity?: number
          unit?: string
          unit_price?: number
          low_stock_threshold?: number
          last_restocked?: string
        }
      }
      workers: {
        Row: {
          id: string
          site_id: string
          name: string
          role: string
          daily_wage: number
          created_at: string
        }
        Insert: {
          id?: string
          site_id: string
          name: string
          role: string
          daily_wage: number
          created_at?: string
        }
        Update: {
          site_id?: string
          name?: string
          role?: string
          daily_wage?: number
        }
      }
      attendance: {
        Row: {
          id: string
          worker_id: string
          date: string
          status: string
          hours_worked: number
        }
        Insert: {
          id?: string
          worker_id: string
          date: string
          status: string
          hours_worked?: number
        }
        Update: {
          status?: string
          hours_worked?: number
        }
      }
      invoices: {
        Row: {
          id: string
          project_id: string
          supplier_name: string
          amount: number
          status: string
          due_date: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          supplier_name: string
          amount: number
          status?: string
          due_date: string
          created_at?: string
        }
        Update: {
          supplier_name?: string
          amount?: number
          status?: string
          due_date?: string
        }
      }
    }
  }
}
