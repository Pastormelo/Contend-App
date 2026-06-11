export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_drafts: {
        Row: {
          id: string
          kind: string
          input: Json
          output: Json
          created_by: string | null
          accepted: boolean
          created_at: string
        }
        Insert: {
          id?: string
          kind: string
          input?: Json
          output?: Json
          created_by?: string | null
          accepted?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          kind?: string
          input?: Json
          output?: Json
          created_by?: string | null
          accepted?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_drafts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys_user: {
        Row: {
          user_id: string
          provider: string
          encrypted_key: string
          created_at: string
        }
        Insert: {
          user_id: string
          provider: string
          encrypted_key: string
          created_at?: string
        }
        Update: {
          user_id?: string
          provider?: string
          encrypted_key?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_user_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          id: string
          slug: string
          title: string
          tier: string | null
          criteria: Json
          hidden: boolean
        }
        Insert: {
          id?: string
          slug: string
          title: string
          tier?: string | null
          criteria?: Json
          hidden?: boolean
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          tier?: string | null
          criteria?: Json
          hidden?: boolean
        }
        Relationships: []
      }
      card_reviews: {
        Row: {
          user_id: string
          card_id: string
          ease: number
          interval_days: number
          due_at: string
          mode: string
          state: string
          streak: number
        }
        Insert: {
          user_id: string
          card_id: string
          ease?: number
          interval_days?: number
          due_at?: string
          mode?: string
          state?: string
          streak?: number
        }
        Update: {
          user_id?: string
          card_id?: string
          ease?: number
          interval_days?: number
          due_at?: string
          mode?: string
          state?: string
          streak?: number
        }
        Relationships: [
          {
            foreignKeyName: "card_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_reviews_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      cards: {
        Row: {
          id: string
          deck_id: string
          type: string
          front: Json
          back: Json
          skeleton: Json | null
        }
        Insert: {
          id?: string
          deck_id: string
          type: string
          front?: Json
          back?: Json
          skeleton?: Json | null
        }
        Update: {
          id?: string
          deck_id?: string
          type?: string
          front?: Json
          back?: Json
          skeleton?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "cards_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "decks"
            referencedColumns: ["id"]
          },
        ]
      }
      citations: {
        Row: {
          id: string
          source_id: string
          lesson_block_id: string | null
          locator: string | null
          excerpt_text: string | null
          is_excerpt: boolean
          excerpt_words: number | null
        }
        Insert: {
          id?: string
          source_id: string
          lesson_block_id?: string | null
          locator?: string | null
          excerpt_text?: string | null
          is_excerpt?: boolean
          excerpt_words?: number | null
        }
        Update: {
          id?: string
          source_id?: string
          lesson_block_id?: string | null
          locator?: string | null
          excerpt_text?: string | null
          is_excerpt?: boolean
          excerpt_words?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "citations_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "citations_lesson_block_id_fkey"
            columns: ["lesson_block_id"]
            isOneToOne: false
            referencedRelation: "lesson_blocks"
            referencedColumns: ["id"]
          },
        ]
      }
      decks: {
        Row: {
          id: string
          title: string
          scope: string
          level_id: string | null
          owner_id: string | null
        }
        Insert: {
          id?: string
          title: string
          scope?: string
          level_id?: string | null
          owner_id?: string | null
        }
        Update: {
          id?: string
          title?: string
          scope?: string
          level_id?: string | null
          owner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "decks_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "decks_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      glossary_terms: {
        Row: {
          id: string
          term: string
          short_blurb: string
          full_definition: string | null
          original_script: string | null
          transliteration: string | null
          language: string | null
        }
        Insert: {
          id?: string
          term: string
          short_blurb: string
          full_definition?: string | null
          original_script?: string | null
          transliteration?: string | null
          language?: string | null
        }
        Update: {
          id?: string
          term?: string
          short_blurb?: string
          full_definition?: string | null
          original_script?: string | null
          transliteration?: string | null
          language?: string | null
        }
        Relationships: []
      }
      intake_attempts: {
        Row: {
          id: string
          user_id: string
          answers: Json
          placements: Json
          rationale: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          answers?: Json
          placements?: Json
          rationale?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          answers?: Json
          placements?: Json
          rationale?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "intake_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_blocks: {
        Row: {
          id: string
          lesson_id: string
          sort: number
          type: string
          content: Json
        }
        Insert: {
          id?: string
          lesson_id: string
          sort?: number
          type: string
          content?: Json
        }
        Update: {
          id?: string
          lesson_id?: string
          sort?: number
          type?: string
          content?: Json
        }
        Relationships: [
          {
            foreignKeyName: "lesson_blocks_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          id: string
          title: string
          est_minutes: number
          status: string
          version: number
          author_id: string | null
          reviewer_id: string | null
          published_at: string | null
        }
        Insert: {
          id?: string
          title: string
          est_minutes?: number
          status?: string
          version?: number
          author_id?: string | null
          reviewer_id?: string | null
          published_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          est_minutes?: number
          status?: string
          version?: number
          author_id?: string | null
          reviewer_id?: string | null
          published_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      levels: {
        Row: {
          id: string
          track_id: string
          number: number
          title: string
          equipped_statement: string
          gate_config: Json
          status: string
        }
        Insert: {
          id?: string
          track_id: string
          number: number
          title: string
          equipped_statement: string
          gate_config?: Json
          status?: string
        }
        Update: {
          id?: string
          track_id?: string
          number?: number
          title?: string
          equipped_statement?: string
          gate_config?: Json
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "levels_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      module_lessons: {
        Row: {
          module_id: string
          lesson_id: string
          sort: number
        }
        Insert: {
          module_id: string
          lesson_id: string
          sort?: number
        }
        Update: {
          module_id?: string
          lesson_id?: string
          sort?: number
        }
        Relationships: [
          {
            foreignKeyName: "module_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "module_lessons_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          id: string
          level_id: string
          title: string
          summary: string | null
          sort: number
          status: string
        }
        Insert: {
          id?: string
          level_id: string
          title: string
          summary?: string | null
          sort?: number
          status?: string
        }
        Update: {
          id?: string
          level_id?: string
          title?: string
          summary?: string | null
          sort?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
        ]
      }
      personas: {
        Row: {
          id: string
          track_id: string | null
          name: string
          difficulty: string
          system_prompt: string
          source_refs: Json
          scenario_card: string
          status: string
          version: number
        }
        Insert: {
          id?: string
          track_id?: string | null
          name: string
          difficulty?: string
          system_prompt: string
          source_refs?: Json
          scenario_card: string
          status?: string
          version?: number
        }
        Update: {
          id?: string
          track_id?: string | null
          name?: string
          difficulty?: string
          system_prompt?: string
          source_refs?: Json
          scenario_card?: string
          status?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "personas_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          id: string
          name: string | null
          role: string
          created_at: string
        }
        Insert: {
          id: string
          name?: string | null
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          role?: string
          created_at?: string
        }
        Relationships: []
      }
      question_bank: {
        Row: {
          id: string
          quiz_id: string | null
          type: string
          prompt: string
          options: Json | null
          answer: Json
          source_block_id: string | null
          difficulty: number
          model_answer: string | null
          status: string
          stats: Json
          sort: number
        }
        Insert: {
          id?: string
          quiz_id?: string | null
          type: string
          prompt: string
          options?: Json | null
          answer: Json
          source_block_id?: string | null
          difficulty?: number
          model_answer?: string | null
          status?: string
          stats?: Json
          sort?: number
        }
        Update: {
          id?: string
          quiz_id?: string | null
          type?: string
          prompt?: string
          options?: Json | null
          answer?: Json
          source_block_id?: string | null
          difficulty?: number
          model_answer?: string | null
          status?: string
          stats?: Json
          sort?: number
        }
        Relationships: [
          {
            foreignKeyName: "question_bank_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_bank_source_block_id_fkey"
            columns: ["source_block_id"]
            isOneToOne: false
            referencedRelation: "lesson_blocks"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          id: string
          user_id: string
          quiz_id: string
          score: number
          passed: boolean
          answers: Json
          started_at: string
          finished_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          quiz_id: string
          score: number
          passed?: boolean
          answers?: Json
          started_at?: string
          finished_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          quiz_id?: string
          score?: number
          passed?: boolean
          answers?: Json
          started_at?: string
          finished_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          id: string
          kind: string
          lesson_id: string | null
          level_id: string | null
          config: Json
        }
        Insert: {
          id?: string
          kind: string
          lesson_id?: string | null
          level_id?: string | null
          config?: Json
        }
        Update: {
          id?: string
          kind?: string
          lesson_id?: string | null
          level_id?: string | null
          config?: Json
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
        ]
      }
      rubric_prompts: {
        Row: {
          id: string
          name: string
          prompt_text: string
          version: number
          active: boolean
        }
        Insert: {
          id?: string
          name: string
          prompt_text: string
          version?: number
          active?: boolean
        }
        Update: {
          id?: string
          name?: string
          prompt_text?: string
          version?: number
          active?: boolean
        }
        Relationships: []
      }
      simulation_messages: {
        Row: {
          id: string
          simulation_id: string
          role: string
          content: string
          ts: string
        }
        Insert: {
          id?: string
          simulation_id: string
          role: string
          content: string
          ts?: string
        }
        Update: {
          id?: string
          simulation_id?: string
          role?: string
          content?: string
          ts?: string
        }
        Relationships: [
          {
            foreignKeyName: "simulation_messages_simulation_id_fkey"
            columns: ["simulation_id"]
            isOneToOne: false
            referencedRelation: "simulations"
            referencedColumns: ["id"]
          },
        ]
      }
      simulation_reviews: {
        Row: {
          id: string
          simulation_id: string
          rubric_scores: Json
          best_moment: Json | null
          weak_moment: Json | null
          missed_opportunity: Json | null
          suggestions: Json
          remediation_lesson_ids: Json
          flagged: boolean
          created_at: string
        }
        Insert: {
          id?: string
          simulation_id: string
          rubric_scores: Json
          best_moment?: Json | null
          weak_moment?: Json | null
          missed_opportunity?: Json | null
          suggestions?: Json
          remediation_lesson_ids?: Json
          flagged?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          simulation_id?: string
          rubric_scores?: Json
          best_moment?: Json | null
          weak_moment?: Json | null
          missed_opportunity?: Json | null
          suggestions?: Json
          remediation_lesson_ids?: Json
          flagged?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "simulation_reviews_simulation_id_fkey"
            columns: ["simulation_id"]
            isOneToOne: false
            referencedRelation: "simulations"
            referencedColumns: ["id"]
          },
        ]
      }
      simulations: {
        Row: {
          id: string
          user_id: string
          persona_id: string
          mode: string
          toggles: Json
          status: string
          started_at: string
          ended_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          persona_id: string
          mode?: string
          toggles?: Json
          status?: string
          started_at?: string
          ended_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          persona_id?: string
          mode?: string
          toggles?: Json
          status?: string
          started_at?: string
          ended_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "simulations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "simulations_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
        ]
      }
      sources: {
        Row: {
          id: string
          source_type: string
          title: string
          author: string | null
          publisher: string | null
          year: number | null
          edition: string | null
          url: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          source_type: string
          title: string
          author?: string | null
          publisher?: string | null
          year?: number | null
          edition?: string | null
          url?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          source_type?: string
          title?: string
          author?: string | null
          publisher?: string | null
          year?: number | null
          edition?: string | null
          url?: string | null
          notes?: string | null
        }
        Relationships: []
      }
      streaks: {
        Row: {
          user_id: string
          current: number
          longest: number
          grace_days: number
          last_active: string | null
        }
        Insert: {
          user_id: string
          current?: number
          longest?: number
          grace_days?: number
          last_active?: string | null
        }
        Update: {
          user_id?: string
          current?: number
          longest?: number
          grace_days?: number
          last_active?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "streaks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      track_prereqs: {
        Row: {
          track_id: string
          requires_track_id: string
          requires_level: number
        }
        Insert: {
          track_id: string
          requires_track_id: string
          requires_level: number
        }
        Update: {
          track_id?: string
          requires_track_id?: string
          requires_level?: number
        }
        Relationships: [
          {
            foreignKeyName: "track_prereqs_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "track_prereqs_requires_track_id_fkey"
            columns: ["requires_track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      tracks: {
        Row: {
          id: string
          slug: string
          title: string
          type: string
          status: string
          sort: number
        }
        Insert: {
          id?: string
          slug: string
          title: string
          type: string
          status?: string
          sort?: number
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          type?: string
          status?: string
          sort?: number
        }
        Relationships: []
      }
      usage_log: {
        Row: {
          id: string
          user_id: string | null
          feature: string
          model: string
          tokens_in: number
          tokens_out: number
          est_cost: number
          key_source: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          feature: string
          model: string
          tokens_in?: number
          tokens_out?: number
          est_cost?: number
          key_source?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          feature?: string
          model?: string
          tokens_in?: number
          tokens_out?: number
          est_cost?: number
          key_source?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          user_id: string
          badge_id: string
          awarded_at: string
        }
        Insert: {
          user_id: string
          badge_id: string
          awarded_at?: string
        }
        Update: {
          user_id?: string
          badge_id?: string
          awarded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_track_progress: {
        Row: {
          user_id: string
          track_id: string
          current_level: number
          gates_passed: Json
          gate_attempt_locks: Json
        }
        Insert: {
          user_id: string
          track_id: string
          current_level?: number
          gates_passed?: Json
          gate_attempt_locks?: Json
        }
        Update: {
          user_id?: string
          track_id?: string
          current_level?: number
          gates_passed?: Json
          gate_attempt_locks?: Json
        }
        Relationships: [
          {
            foreignKeyName: "user_track_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_track_progress_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      verses_cache: {
        Row: {
          id: string
          reference: string
          translation: string
          text: string
          fetched_at: string
        }
        Insert: {
          id?: string
          reference: string
          translation?: string
          text: string
          fetched_at?: string
        }
        Update: {
          id?: string
          reference?: string
          translation?: string
          text?: string
          fetched_at?: string
        }
        Relationships: []
      }
      written_responses: {
        Row: {
          id: string
          user_id: string
          source: string
          ref_id: string | null
          response_text: string
          rubric_scores: Json | null
          ai_feedback: string | null
          stronger_answer: string | null
          flagged: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          source: string
          ref_id?: string | null
          response_text: string
          rubric_scores?: Json | null
          ai_feedback?: string | null
          stronger_answer?: string | null
          flagged?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          source?: string
          ref_id?: string | null
          response_text?: string
          rubric_scores?: Json | null
          ai_feedback?: string | null
          stronger_answer?: string | null
          flagged?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "written_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      xp_events: {
        Row: {
          id: string
          user_id: string
          amount: number
          reason: string
          ref_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          reason: string
          ref_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          reason?: string
          ref_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "xp_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean }
    }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

type PublicSchema = Database["public"]

export type Tables<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"]
export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Update"]
