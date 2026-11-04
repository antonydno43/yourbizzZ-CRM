// This file contains the database types for Supabase
// It will be auto-generated or manually maintained

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      // Authentication and Users
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          phone: string | null
          address: Json | null
          preferences: Json | null
          email_verified: boolean
          created_at: string
          updated_at: string
          last_login_at: string | null
          is_active: boolean
          role: 'admin' | 'user' | 'guest'
          subscription_plan: 'free' | 'pro' | 'business' | 'enterprise'
          subscription_status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid'
          billing_cycle_anchor: string | null
          trial_end: string | null
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          avatar_url?: string | null
          phone?: string | null
          address?: Json | null
          preferences?: Json | null
          email_verified?: boolean
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
          is_active?: boolean
          role?: 'admin' | 'user' | 'guest'
          subscription_plan?: 'free' | 'pro' | 'business' | 'enterprise'
          subscription_status?: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid'
          billing_cycle_anchor?: string | null
          trial_end?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          phone?: string | null
          address?: Json | null
          preferences?: Json | null
          email_verified?: boolean
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
          is_active?: boolean
          role?: 'admin' | 'user' | 'guest'
          subscription_plan?: 'free' | 'pro' | 'business' | 'enterprise'
          subscription_status?: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid'
          billing_cycle_anchor?: string | null
          trial_end?: string | null
        }
      }

      // Workspaces/Organizations
      workspaces: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          logo_url: string | null
          owner_id: string
          domain: string | null
          custom_domain: string | null
          settings: Json
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          slug?: string
          description?: string | null
          logo_url?: string | null
          owner_id: string
          domain?: string | null
          custom_domain?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          logo_url?: string | null
          owner_id?: string
          domain?: string | null
          custom_domain?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
      }

      // Workspace Members
      workspace_members: {
        Row: {
          id: string
          workspace_id: string
          user_id: string
          role: 'owner' | 'admin' | 'editor' | 'viewer' | 'guest'
          permissions: Json
          invited_by: string
          invited_at: string
          joined_at: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          user_id: string
          role: 'owner' | 'admin' | 'editor' | 'viewer' | 'guest'
          permissions?: Json
          invited_by: string
          invited_at?: string
          joined_at?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          user_id?: string
          role?: 'owner' | 'admin' | 'editor' | 'viewer' | 'guest'
          permissions?: Json
          invited_by?: string
          invited_at?: string
          joined_at?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }

      // Websites/Projects
      websites: {
        Row: {
          id: string
          workspace_id: string
          name: string
          slug: string
          description: string | null
          favicon_url: string | null
          logo_url: string | null
          theme: Json
          settings: Json
          is_published: boolean
          custom_domain: string | null
          published_url: string | null
          seo_settings: Json
          created_at: string
          updated_at: string
          published_at: string | null
          owner_id: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          slug?: string
          description?: string | null
          favicon_url?: string | null
          logo_url?: string | null
          theme?: Json
          settings?: Json
          is_published?: boolean
          custom_domain?: string | null
          published_url?: string | null
          seo_settings?: Json
          created_at?: string
          updated_at?: string
          published_at?: string | null
          owner_id: string
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          slug?: string
          description?: string | null
          favicon_url?: string | null
          logo_url?: string | null
          theme?: Json
          settings?: Json
          is_published?: boolean
          custom_domain?: string | null
          published_url?: string | null
          seo_settings?: Json
          created_at?: string
          updated_at?: string
          published_at?: string | null
          owner_id?: string
        }
      }

      // Website Pages
      pages: {
        Row: {
          id: string
          website_id: string
          title: string
          slug: string
          path: string
          content: Json
          layout: Json
          seo_title: string | null
          seo_description: string | null
          seo_keywords: string | null
          is_published: boolean
          is_homepage: boolean
          is_draft: boolean
          sort_order: number
          parent_id: string | null
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          website_id: string
          title: string
          slug: string
          path: string
          content: Json
          layout?: Json
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          is_published?: boolean
          is_homepage?: boolean
          is_draft?: boolean
          sort_order?: number
          parent_id?: string | null
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          website_id?: string
          title?: string
          slug?: string
          path?: string
          content?: Json
          layout?: Json
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          is_published?: boolean
          is_homepage?: boolean
          is_draft?: boolean
          sort_order?: number
          parent_id?: string | null
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }

      // Builder Elements/Components
      elements: {
        Row: {
          id: string
          page_id: string
          type: string
          component_type: string
          content: Json
          styles: Json
          position: Json
          size: Json
          sort_order: number
          parent_id: string | null
          is_locked: boolean
          is_hidden: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          page_id: string
          type: string
          component_type: string
          content: Json
          styles?: Json
          position: Json
          size: Json
          sort_order?: number
          parent_id?: string | null
          is_locked?: boolean
          is_hidden?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          page_id?: string
          type?: string
          component_type?: string
          content?: Json
          styles?: Json
          position?: Json
          size?: Json
          sort_order?: number
          parent_id?: string | null
          is_locked?: boolean
          is_hidden?: boolean
          created_at?: string
          updated_at?: string
        }
      }

      // CRM - Contacts
      contacts: {
        Row: {
          id: string
          workspace_id: string
          first_name: string
          last_name: string | null
          email: string
          phone: string | null
          mobile: string | null
          company: string | null
          job_title: string | null
          address: Json | null
          city: string | null
          state: string | null
          country: string | null
          postal_code: string | null
          website: string | null
          social_links: Json | null
          tags: string[]
          source: string | null
          status: 'lead' | 'contact' | 'customer' | 'inactive'
          lead_score: number | null
          notes: string | null
          custom_fields: Json | null
          created_at: string
          updated_at: string
          created_by: string
          assigned_to: string | null
        }
        Insert: {
          id?: string
          workspace_id: string
          first_name: string
          last_name?: string | null
          email: string
          phone?: string | null
          mobile?: string | null
          company?: string | null
          job_title?: string | null
          address?: Json | null
          city?: string | null
          state?: string | null
          country?: string | null
          postal_code?: string | null
          website?: string | null
          social_links?: Json | null
          tags?: string[]
          source?: string | null
          status?: 'lead' | 'contact' | 'customer' | 'inactive'
          lead_score?: number | null
          notes?: string | null
          custom_fields?: Json | null
          created_at?: string
          updated_at?: string
          created_by: string
          assigned_to?: string | null
        }
        Update: {
          id?: string
          workspace_id?: string
          first_name?: string
          last_name?: string | null
          email?: string
          phone?: string | null
          mobile?: string | null
          company?: string | null
          job_title?: string | null
          address?: Json | null
          city?: string | null
          state?: string | null
          country?: string | null
          postal_code?: string | null
          website?: string | null
          social_links?: Json | null
          tags?: string[]
          source?: string | null
          status?: 'lead' | 'contact' | 'customer' | 'inactive'
          lead_score?: number | null
          notes?: string | null
          custom_fields?: Json | null
          created_at?: string
          updated_at?: string
          created_by?: string
          assigned_to?: string | null
        }
      }

      // CRM - Deals
      deals: {
        Row: {
          id: string
          workspace_id: string
          name: string
          description: string | null
          amount: number
          currency: string
          stage: string
          pipeline_id: string
          contact_id: string | null
          company_id: string | null
          probability: number | null
          expected_close_date: string | null
          actual_close_date: string | null
          status: 'open' | 'won' | 'lost' | 'abandoned'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          tags: string[]
          custom_fields: Json | null
          created_at: string
          updated_at: string
          created_by: string
          assigned_to: string | null
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          description?: string | null
          amount: number
          currency?: string
          stage: string
          pipeline_id: string
          contact_id?: string | null
          company_id?: string | null
          probability?: number | null
          expected_close_date?: string | null
          actual_close_date?: string | null
          status?: 'open' | 'won' | 'lost' | 'abandoned'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          tags?: string[]
          custom_fields?: Json | null
          created_at?: string
          updated_at?: string
          created_by: string
          assigned_to?: string | null
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          description?: string | null
          amount?: number
          currency?: string
          stage?: string
          pipeline_id?: string
          contact_id?: string | null
          company_id?: string | null
          probability?: number | null
          expected_close_date?: string | null
          actual_close_date?: string | null
          status?: 'open' | 'won' | 'lost' | 'abandoned'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          tags?: string[]
          custom_fields?: Json | null
          created_at?: string
          updated_at?: string
          created_by?: string
          assigned_to?: string | null
        }
      }

      // CRM - Pipelines
      pipelines: {
        Row: {
          id: string
          workspace_id: string
          name: string
          description: string | null
          stages: Json
          is_active: boolean
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          description?: string | null
          stages: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          description?: string | null
          stages?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }

      // CRM - Companies
      companies: {
        Row: {
          id: string
          workspace_id: string
          name: string
          description: string | null
          email: string | null
          phone: string | null
          website: string | null
          address: Json | null
          city: string | null
          state: string | null
          country: string | null
          postal_code: string | null
          industry: string | null
          size: string | null
          revenue: number | null
          tags: string[]
          custom_fields: Json | null
          created_at: string
          updated_at: string
          created_by: string
          assigned_to: string | null
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          description?: string | null
          email?: string | null
          phone?: string | null
          website?: string | null
          address?: Json | null
          city?: string | null
          state?: string | null
          country?: string | null
          postal_code?: string | null
          industry?: string | null
          size?: string | null
          revenue?: number | null
          tags?: string[]
          custom_fields?: Json | null
          created_at?: string
          updated_at?: string
          created_by: string
          assigned_to?: string | null
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          description?: string | null
          email?: string | null
          phone?: string | null
          website?: string | null
          address?: Json | null
          city?: string | null
          state?: string | null
          country?: string | null
          postal_code?: string | null
          industry?: string | null
          size?: string | null
          revenue?: number | null
          tags?: string[]
          custom_fields?: Json | null
          created_at?: string
          updated_at?: string
          created_by?: string
          assigned_to?: string | null
        }
      }

      // Booking - Services
      booking_services: {
        Row: {
          id: string
          workspace_id: string
          name: string
          description: string | null
          duration: number
          duration_unit: 'minutes' | 'hours' | 'days'
          price: number
          currency: string
          category: string | null
          color: string | null
          is_active: boolean
          buffer_time: number | null
          max_participants: number | null
          requires_approval: boolean
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          description?: string | null
          duration: number
          duration_unit?: 'minutes' | 'hours' | 'days'
          price?: number
          currency?: string
          category?: string | null
          color?: string | null
          is_active?: boolean
          buffer_time?: number | null
          max_participants?: number | null
          requires_approval?: boolean
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          description?: string | null
          duration?: number
          duration_unit?: 'minutes' | 'hours' | 'days'
          price?: number
          currency?: string
          category?: string | null
          color?: string | null
          is_active?: boolean
          buffer_time?: number | null
          max_participants?: number | null
          requires_approval?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }

      // Booking - Staff/Providers
      booking_staff: {
        Row: {
          id: string
          workspace_id: string
          user_id: string | null
          name: string
          email: string
          phone: string | null
          bio: string | null
          avatar_url: string | null
          services: string[]
          working_hours: Json
          timezone: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          user_id?: string | null
          name: string
          email: string
          phone?: string | null
          bio?: string | null
          avatar_url?: string | null
          services?: string[]
          working_hours?: Json
          timezone?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          user_id?: string | null
          name?: string
          email?: string
          phone?: string | null
          bio?: string | null
          avatar_url?: string | null
          services?: string[]
          working_hours?: Json
          timezone?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }

      // Booking - Appointments
      appointments: {
        Row: {
          id: string
          workspace_id: string
          service_id: string
          staff_id: string | null
          customer_id: string | null
          customer_name: string
          customer_email: string
          customer_phone: string | null
          start_time: string
          end_time: string
          duration: number
          status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no-show' | 'rescheduled'
          notes: string | null
          timezone: string
          location: string | null
          is_online: boolean
          meeting_link: string | null
          price: number | null
          currency: string | null
          payment_status: 'pending' | 'paid' | 'refunded' | 'failed' | null
          reminder_sent: boolean
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          workspace_id: string
          service_id: string
          staff_id?: string | null
          customer_id?: string | null
          customer_name: string
          customer_email: string
          customer_phone?: string | null
          start_time: string
          end_time: string
          duration?: number
          status?: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no-show' | 'rescheduled'
          notes?: string | null
          timezone?: string
          location?: string | null
          is_online?: boolean
          meeting_link?: string | null
          price?: number | null
          currency?: string | null
          payment_status?: 'pending' | 'paid' | 'refunded' | 'failed' | null
          reminder_sent?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          workspace_id?: string
          service_id?: string
          staff_id?: string | null
          customer_id?: string | null
          customer_name?: string
          customer_email?: string
          customer_phone?: string | null
          start_time?: string
          end_time?: string
          duration?: number
          status?: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no-show' | 'rescheduled'
          notes?: string | null
          timezone?: string
          location?: string | null
          is_online?: boolean
          meeting_link?: string | null
          price?: number | null
          currency?: string | null
          payment_status?: 'pending' | 'paid' | 'refunded' | 'failed' | null
          reminder_sent?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }

      // Booking - Availability
      booking_availability: {
        Row: {
          id: string
          staff_id: string
          workspace_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_available: boolean
          date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          staff_id: string
          workspace_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_available?: boolean
          date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          staff_id?: string
          workspace_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          is_available?: boolean
          date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      // Forms
      forms: {
        Row: {
          id: string
          workspace_id: string
          website_id: string | null
          name: string
          title: string
          description: string | null
          form_type: 'contact' | 'lead' | 'survey' | 'registration' | 'custom'
          fields: Json
          layout: Json
          settings: Json
          thank_you_message: string
          redirect_url: string | null
          email_notifications: Json
          is_active: boolean
          submissions_count: number
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          workspace_id: string
          website_id?: string | null
          name: string
          title: string
          description?: string | null
          form_type?: 'contact' | 'lead' | 'survey' | 'registration' | 'custom'
          fields: Json
          layout?: Json
          settings?: Json
          thank_you_message?: string
          redirect_url?: string | null
          email_notifications?: Json
          is_active?: boolean
          submissions_count?: number
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          workspace_id?: string
          website_id?: string | null
          name?: string
          title?: string
          description?: string | null
          form_type?: 'contact' | 'lead' | 'survey' | 'registration' | 'custom'
          fields?: Json
          layout?: Json
          settings?: Json
          thank_you_message?: string
          redirect_url?: string | null
          email_notifications?: Json
          is_active?: boolean
          submissions_count?: number
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }

      // Form Submissions
      form_submissions: {
        Row: {
          id: string
          form_id: string
          workspace_id: string
          data: Json
          ip_address: string | null
          user_agent: string | null
          referrer: string | null
          status: 'new' | 'read' | 'archived' | 'spam'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          form_id: string
          workspace_id: string
          data: Json
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
          status?: 'new' | 'read' | 'archived' | 'spam'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          form_id?: string
          workspace_id?: string
          data?: Json
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
          status?: 'new' | 'read' | 'archived' | 'spam'
          created_at?: string
          updated_at?: string
        }
      }

      // Form Fields
      form_fields: {
        Row: {
          id: string
          form_id: string
          name: string
          label: string
          type: 'text' | 'textarea' | 'email' | 'number' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'date' | 'datetime' | 'file' | 'hidden'
          placeholder: string | null
          required: boolean
          default_value: string | null
          options: Json
          validation: Json
          sort_order: number
          width: 'full' | 'half' | 'third' | 'quarter'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          form_id: string
          name: string
          label: string
          type: 'text' | 'textarea' | 'email' | 'number' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'date' | 'datetime' | 'file' | 'hidden'
          placeholder?: string | null
          required?: boolean
          default_value?: string | null
          options?: Json
          validation?: Json
          sort_order?: number
          width?: 'full' | 'half' | 'third' | 'quarter'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          form_id?: string
          name?: string
          label?: string
          type?: 'text' | 'textarea' | 'email' | 'number' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'date' | 'datetime' | 'file' | 'hidden'
          placeholder?: string | null
          required?: boolean
          default_value?: string | null
          options?: Json
          validation?: Json
          sort_order?: number
          width?: 'full' | 'half' | 'third' | 'quarter'
          created_at?: string
          updated_at?: string
        }
      }

      // E-commerce - Products
      products: {
        Row: {
          id: string
          workspace_id: string
          name: string
          description: string | null
          sku: string | null
          price: number
          compare_at_price: number | null
          cost: number | null
          currency: string
          category_id: string | null
          tags: string[]
          images: string[]
          stock_quantity: number | null
          stock_status: 'in_stock' | 'out_of_stock' | 'backorder'
          track_inventory: boolean
          weight: number | null
          weight_unit: string | null
          dimensions: Json | null
          is_digital: boolean
          digital_file_url: string | null
          is_active: boolean
          is_featured: boolean
          seo_title: string | null
          seo_description: string | null
          custom_fields: Json | null
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          description?: string | null
          sku?: string | null
          price: number
          compare_at_price?: number | null
          cost?: number | null
          currency?: string
          category_id?: string | null
          tags?: string[]
          images?: string[]
          stock_quantity?: number | null
          stock_status?: 'in_stock' | 'out_of_stock' | 'backorder'
          track_inventory?: boolean
          weight?: number | null
          weight_unit?: string | null
          dimensions?: Json | null
          is_digital?: boolean
          digital_file_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          seo_title?: string | null
          seo_description?: string | null
          custom_fields?: Json | null
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          description?: string | null
          sku?: string | null
          price?: number
          compare_at_price?: number | null
          cost?: number | null
          currency?: string
          category_id?: string | null
          tags?: string[]
          images?: string[]
          stock_quantity?: number | null
          stock_status?: 'in_stock' | 'out_of_stock' | 'backorder'
          track_inventory?: boolean
          weight?: number | null
          weight_unit?: string | null
          dimensions?: Json | null
          is_digital?: boolean
          digital_file_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          seo_title?: string | null
          seo_description?: string | null
          custom_fields?: Json | null
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }

      // E-commerce - Categories
      product_categories: {
        Row: {
          id: string
          workspace_id: string
          name: string
          description: string | null
          slug: string
          image_url: string | null
          parent_id: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          description?: string | null
          slug?: string
          image_url?: string | null
          parent_id?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          description?: string | null
          slug?: string
          image_url?: string | null
          parent_id?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }

      // E-commerce - Cart
      cart: {
        Row: {
          id: string
          session_id: string
          user_id: string | null
          workspace_id: string
          items: Json
          total: number
          subtotal: number
          tax: number | null
          shipping: number | null
          discount: number | null
          currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_id: string
          user_id?: string | null
          workspace_id: string
          items: Json
          total?: number
          subtotal?: number
          tax?: number | null
          shipping?: number | null
          discount?: number | null
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          user_id?: string | null
          workspace_id?: string
          items?: Json
          total?: number
          subtotal?: number
          tax?: number | null
          shipping?: number | null
          discount?: number | null
          currency?: string
          created_at?: string
          updated_at?: string
        }
      }

      // E-commerce - Orders
      orders: {
        Row: {
          id: string
          workspace_id: string
          order_number: string
          user_id: string | null
          customer_name: string
          customer_email: string
          customer_phone: string | null
          customer_address: Json
          items: Json
          subtotal: number
          tax: number | null
          shipping: number | null
          discount: number | null
          total: number
          currency: string
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'
          payment_method: string | null
          transaction_id: string | null
          shipping_method: string | null
          tracking_number: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          order_number?: string
          user_id?: string | null
          customer_name: string
          customer_email: string
          customer_phone?: string | null
          customer_address: Json
          items: Json
          subtotal?: number
          tax?: number | null
          shipping?: number | null
          discount?: number | null
          total: number
          currency?: string
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'
          payment_method?: string | null
          transaction_id?: string | null
          shipping_method?: string | null
          tracking_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          order_number?: string
          user_id?: string | null
          customer_name?: string
          customer_email?: string
          customer_phone?: string | null
          customer_address?: Json
          items?: Json
          subtotal?: number
          tax?: number | null
          shipping?: number | null
          discount?: number | null
          total?: number
          currency?: string
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'
          payment_method?: string | null
          transaction_id?: string | null
          shipping_method?: string | null
          tracking_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      // Inventory - Stock Management
      inventory: {
        Row: {
          id: string
          workspace_id: string
          product_id: string
          sku: string
          quantity: number
          location: string | null
          reorder_level: number | null
          reorder_quantity: number | null
          last_restocked: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          product_id: string
          sku: string
          quantity: number
          location?: string | null
          reorder_level?: number | null
          reorder_quantity?: number | null
          last_restocked?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          product_id?: string
          sku?: string
          quantity?: number
          location?: string | null
          reorder_level?: number | null
          reorder_quantity?: number | null
          last_restocked?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      // Inventory - Transactions
      inventory_transactions: {
        Row: {
          id: string
          workspace_id: string
          inventory_id: string
          product_id: string
          type: 'in' | 'out' | 'adjustment' | 'transfer'
          quantity: number
          previous_quantity: number
          new_quantity: number
          reference_id: string | null
          reference_type: string | null
          notes: string | null
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          workspace_id: string
          inventory_id: string
          product_id: string
          type: 'in' | 'out' | 'adjustment' | 'transfer'
          quantity: number
          previous_quantity: number
          new_quantity: number
          reference_id?: string | null
          reference_type?: string | null
          notes?: string | null
          created_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          workspace_id?: string
          inventory_id?: string
          product_id?: string
          type?: 'in' | 'out' | 'adjustment' | 'transfer'
          quantity?: number
          previous_quantity?: number
          new_quantity?: number
          reference_id?: string | null
          reference_type?: string | null
          notes?: string | null
          created_at?: string
          created_by?: string | null
        }
      }

      // Email Templates
      email_templates: {
        Row: {
          id: string
          workspace_id: string
          name: string
          subject: string
          template_type: 'welcome' | 'appointment' | 'order' | 'invoice' | 'custom'
          content: string
          variables: Json
          is_active: boolean
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          subject: string
          template_type?: 'welcome' | 'appointment' | 'order' | 'invoice' | 'custom'
          content: string
          variables?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          subject?: string
          template_type?: 'welcome' | 'appointment' | 'order' | 'invoice' | 'custom'
          content?: string
          variables?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }

      // Email Logs
      email_logs: {
        Row: {
          id: string
          workspace_id: string
          template_id: string | null
          to: string
          subject: string
          content: string | null
          status: 'sent' | 'failed' | 'bounced' | 'delivered' | 'opened'
          error_message: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          template_id?: string | null
          to: string
          subject: string
          content?: string | null
          status?: 'sent' | 'failed' | 'bounced' | 'delivered' | 'opened'
          error_message?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          template_id?: string | null
          to?: string
          subject?: string
          content?: string | null
          status?: 'sent' | 'failed' | 'bounced' | 'delivered' | 'opened'
          error_message?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }

      // Settings
      settings: {
        Row: {
          id: string
          workspace_id: string
          key: string
          value: Json
          category: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          key: string
          value: Json
          category?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          key?: string
          value?: Json
          category?: string
          created_at?: string
          updated_at?: string
        }
      }

      // Audit Logs
      audit_logs: {
        Row: {
          id: string
          workspace_id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          old_values: Json | null
          new_values: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
