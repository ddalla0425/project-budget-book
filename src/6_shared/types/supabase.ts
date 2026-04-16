export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.1';
  };
  public: {
    Tables: {
      account_bank_details: {
        Row: {
          account_id: string
          account_number: string | null
          deposit_rate: number | null
          interest_cycle: string | null
          interest_settlement_day: number | null
          is_main_account: boolean | null
          is_minus_account: boolean | null
          loan_rate: number | null
          user_id: string
        }
        Insert: {
          account_id: string
          account_number?: string | null
          deposit_rate?: number | null
          interest_cycle?: string | null
          interest_settlement_day?: number | null
          is_main_account?: boolean | null
          is_minus_account?: boolean | null
          loan_rate?: number | null
          user_id: string
        }
        Update: {
          account_id?: string
          account_number?: string | null
          deposit_rate?: number | null
          interest_cycle?: string | null
          interest_settlement_day?: number | null
          is_main_account?: boolean | null
          is_minus_account?: boolean | null
          loan_rate?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_bank_details_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_bank_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_bank_account_user"
            columns: ["account_id", "user_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      account_card_details: {
        Row: {
          account_id: string
          billing_day: number | null
          end_day: number
          end_month_offset: number
          start_day: number
          start_month_offset: number
          user_id: string | null
        }
        Insert: {
          account_id: string
          billing_day?: number | null
          end_day: number
          end_month_offset: number
          start_day: number
          start_month_offset: number
          user_id?: string | null
        }
        Update: {
          account_id?: string
          billing_day?: number | null
          end_day?: number
          end_month_offset?: number
          start_day?: number
          start_month_offset?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "account_card_details_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_card_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_card_account_user"
            columns: ["account_id", "user_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      account_cash_details: {
        Row: {
          account_id: string
          cash_type: string
          created_at: string | null
          deleted_at: string | null
          denomination: number
          id: string
          quantity: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_id: string
          cash_type: string
          created_at?: string | null
          deleted_at?: string | null
          denomination: number
          id?: string
          quantity?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_id?: string
          cash_type?: string
          created_at?: string | null
          deleted_at?: string | null
          denomination?: number
          id?: string
          quantity?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_cash_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_details_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      account_debt_details: {
        Row: {
          account_id: string | null
          created_at: string | null
          current_installment_plan: number | null
          debt_source: string | null
          debt_type: string | null
          deleted_at: string | null
          expiry_date: string | null
          id: string
          installment_months: number | null
          institution_id: string | null
          interest_rate: number | null
          linked_transaction_id: string | null
          name: string
          remaining_amount: number
          repayment_account_id: string | null
          repayment_day: number | null
          repayment_method: string | null
          start_date: string | null
          status: string | null
          total_prepaid_amount: number | null
          total_principal: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_id?: string | null
          created_at?: string | null
          current_installment_plan?: number | null
          debt_source?: string | null
          debt_type?: string | null
          deleted_at?: string | null
          expiry_date?: string | null
          id?: string
          installment_months?: number | null
          institution_id?: string | null
          interest_rate?: number | null
          linked_transaction_id?: string | null
          name: string
          remaining_amount: number
          repayment_account_id?: string | null
          repayment_day?: number | null
          repayment_method?: string | null
          start_date?: string | null
          status?: string | null
          total_prepaid_amount?: number | null
          total_principal: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_id?: string | null
          created_at?: string | null
          current_installment_plan?: number | null
          debt_source?: string | null
          debt_type?: string | null
          deleted_at?: string | null
          expiry_date?: string | null
          id?: string
          installment_months?: number | null
          institution_id?: string | null
          interest_rate?: number | null
          linked_transaction_id?: string | null
          name?: string
          remaining_amount?: number
          repayment_account_id?: string | null
          repayment_day?: number | null
          repayment_method?: string | null
          start_date?: string | null
          status?: string | null
          total_prepaid_amount?: number | null
          total_principal?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_debt_details_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "financial_institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_account_debt_details_accounts"
            columns: ["account_id", "user_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "fk_account_debt_details_users"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_debt_account_repayment"
            columns: ["repayment_account_id", "user_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "fk_debt_linked_transaction"
            columns: ["linked_transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      account_insurance_details: {
        Row: {
          account_id: string
          estimated_refund_amount: number | null
          interest_rate: number | null
          is_refundable: boolean | null
          payment_cycle: string | null
          payment_day: number | null
          payment_duration_months: number | null
          payment_end_date: string | null
          premium_amount: number | null
          start_date: string | null
          status: string | null
          type: string | null
          user_id: string
        }
        Insert: {
          account_id: string
          estimated_refund_amount?: number | null
          interest_rate?: number | null
          is_refundable?: boolean | null
          payment_cycle?: string | null
          payment_day?: number | null
          payment_duration_months?: number | null
          payment_end_date?: string | null
          premium_amount?: number | null
          start_date?: string | null
          status?: string | null
          type?: string | null
          user_id: string
        }
        Update: {
          account_id?: string
          estimated_refund_amount?: number | null
          interest_rate?: number | null
          is_refundable?: boolean | null
          payment_cycle?: string | null
          payment_day?: number | null
          payment_duration_months?: number | null
          payment_end_date?: string | null
          premium_amount?: number | null
          start_date?: string | null
          status?: string | null
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_insurance_details_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_insurance_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_insurance_account_user"
            columns: ["account_id", "user_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      account_investment_details: {
        Row: {
          account_id: string
          average_buy_price: number | null
          investment_type: string | null
          is_auto_sync: boolean | null
          last_market_price: number | null
          principal_amount: number | null
          status: string | null
          ticker_symbol: string | null
          total_quantity: number | null
          user_id: string
        }
        Insert: {
          account_id: string
          average_buy_price?: number | null
          investment_type?: string | null
          is_auto_sync?: boolean | null
          last_market_price?: number | null
          principal_amount?: number | null
          status?: string | null
          ticker_symbol?: string | null
          total_quantity?: number | null
          user_id: string
        }
        Update: {
          account_id?: string
          average_buy_price?: number | null
          investment_type?: string | null
          is_auto_sync?: boolean | null
          last_market_price?: number | null
          principal_amount?: number | null
          status?: string | null
          ticker_symbol?: string | null
          total_quantity?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_investment_details_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_investment_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_invest_account_user"
            columns: ["account_id", "user_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      account_pay_details: {
        Row: {
          account_id: string
          auto_recharge_type: string | null
          linked_point_account_id: string | null
          recharge_cycle: string | null
          recharge_day: number | null
          recharge_threshold_amount: number | null
          recharge_unit_amount: number | null
          user_id: string | null
        }
        Insert: {
          account_id: string
          auto_recharge_type?: string | null
          linked_point_account_id?: string | null
          recharge_cycle?: string | null
          recharge_day?: number | null
          recharge_threshold_amount?: number | null
          recharge_unit_amount?: number | null
          user_id?: string | null
        }
        Update: {
          account_id?: string
          auto_recharge_type?: string | null
          linked_point_account_id?: string | null
          recharge_cycle?: string | null
          recharge_day?: number | null
          recharge_threshold_amount?: number | null
          recharge_unit_amount?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "account_pay_details_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_pay_details_linked_point_account_id_fkey"
            columns: ["linked_point_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_pay_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pay_account_user"
            columns: ["account_id", "user_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      account_saving_details: {
        Row: {
          account_id: string
          duration_months: number | null
          interest_rate: number | null
          is_installment: boolean | null
          linked_payout_account_id: string | null
          maturity_date: string | null
          payment_amount: number | null
          payment_day: number | null
          start_date: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          account_id: string
          duration_months?: number | null
          interest_rate?: number | null
          is_installment?: boolean | null
          linked_payout_account_id?: string | null
          maturity_date?: string | null
          payment_amount?: number | null
          payment_day?: number | null
          start_date?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          account_id?: string
          duration_months?: number | null
          interest_rate?: number | null
          is_installment?: boolean | null
          linked_payout_account_id?: string | null
          maturity_date?: string | null
          payment_amount?: number | null
          payment_day?: number | null
          start_date?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_account_saving_details_accounts"
            columns: ["account_id", "user_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "fk_account_saving_details_payout"
            columns: ["linked_payout_account_id", "user_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      account_voucher_details: {
        Row: {
          account_id: string
          converted_at: string | null
          convertible_account_id: string | null
          created_at: string | null
          deleted_at: string | null
          denomination: number
          expiry_date: string | null
          id: string
          is_convertible: boolean | null
          is_used: boolean | null
          quantity: number
          updated_at: string | null
          user_id: string
          voucher_name: string
        }
        Insert: {
          account_id: string
          converted_at?: string | null
          convertible_account_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          denomination: number
          expiry_date?: string | null
          id?: string
          is_convertible?: boolean | null
          is_used?: boolean | null
          quantity?: number
          updated_at?: string | null
          user_id: string
          voucher_name: string
        }
        Update: {
          account_id?: string
          converted_at?: string | null
          convertible_account_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          denomination?: number
          expiry_date?: string | null
          id?: string
          is_convertible?: boolean | null
          is_used?: boolean | null
          quantity?: number
          updated_at?: string | null
          user_id?: string
          voucher_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_voucher_details_convertible_account_id_fkey"
            columns: ["convertible_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_voucher_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_vouchers_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      accounts: {
        Row: {
          amount_limit: number
          balance_type: string | null
          created_at: string
          currency: string
          current_balance: number
          deleted_at: string | null
          description: string | null
          expiry_date: string | null
          id: string
          institution_id: string | null
          is_active: boolean
          limit_remaining: number | null
          linked_account_id: string | null
          name: string
          provider: string
          source: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_limit?: number
          balance_type?: string | null
          created_at?: string
          currency?: string
          current_balance?: number
          deleted_at?: string | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          institution_id?: string | null
          is_active?: boolean
          limit_remaining?: number | null
          linked_account_id?: string | null
          name: string
          provider: string
          source?: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_limit?: number
          balance_type?: string | null
          created_at?: string
          currency?: string
          current_balance?: number
          deleted_at?: string | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          institution_id?: string | null
          is_active?: boolean
          limit_remaining?: number | null
          linked_account_id?: string | null
          name?: string
          provider?: string
          source?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "financial_institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_accounts_linked_same_user"
            columns: ["linked_account_id", "user_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: 'fk_accounts_user';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ]
      }
      card_billing_standards: {
        Row: {
          billing_day: number
          created_at: string | null
          end_day: number
          end_month_offset: number
          id: string
          institution_id: string | null
          start_day: number
          start_month_offset: number
          updated_at: string | null
        }
        Insert: {
          billing_day: number
          created_at?: string | null
          end_day: number
          end_month_offset: number
          id?: string
          institution_id?: string | null
          start_day: number
          start_month_offset: number
          updated_at?: string | null
        }
        Update: {
          billing_day?: number
          created_at?: string | null
          end_day?: number
          end_month_offset?: number
          id?: string
          institution_id?: string | null
          start_day?: number
          start_month_offset?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "card_billing_standards_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "financial_institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          id: string;
          is_active: boolean;
          main_category: string;
          sub_category: string;
        };
        Insert: {
          id?: string;
          is_active?: boolean;
          main_category: string;
          sub_category: string;
        };
        Update: {
          id?: string;
          is_active?: boolean;
          main_category?: string;
          sub_category?: string;
        };
        Relationships: [];
      };
      contacts: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'contacts_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ]
      }
      financial_institutions: {
        Row: {
          code: string
          created_at: string | null
          id: string
          is_active: boolean | null
          is_convertible: boolean
          is_popular: boolean | null
          logo_url: string | null
          name: string
          priority_score: number | null
          type: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_convertible?: boolean
          is_popular?: boolean | null
          logo_url?: string | null
          name: string
          priority_score?: number | null
          type: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_convertible?: boolean
          is_popular?: boolean | null
          logo_url?: string | null
          name?: string
          priority_score?: number | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      recurrence_rules: {
        Row: {
          anchor_day: number;
          anchor_month: number | null;
          id: string;
          interval_months: number;
          recurring_expense_id: string;
        };
        Insert: {
          anchor_day: number;
          anchor_month?: number | null;
          id?: string;
          interval_months: number;
          recurring_expense_id: string;
        };
        Update: {
          anchor_day?: number;
          anchor_month?: number | null;
          id?: string;
          interval_months?: number;
          recurring_expense_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'recurrence_rules_recurring_expense_id_fkey';
            columns: ['recurring_expense_id'];
            isOneToOne: false;
            referencedRelation: 'recurring_expenses';
            referencedColumns: ['id'];
          },
        ];
      };
      recurring_expense_items: {
        Row: {
          amount: number;
          id: string;
          name: string;
          recurring_expense_id: string;
        };
        Insert: {
          amount: number;
          id?: string;
          name: string;
          recurring_expense_id: string;
        };
        Update: {
          amount?: number;
          id?: string;
          name?: string;
          recurring_expense_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'recurring_expense_items_recurring_expense_id_fkey';
            columns: ['recurring_expense_id'];
            isOneToOne: false;
            referencedRelation: 'recurring_expenses';
            referencedColumns: ['id'];
          },
        ];
      };
      recurring_expenses: {
        Row: {
          account_id: string;
          category_id: string | null;
          created_at: string;
          id: string;
          is_active: boolean;
          next_run_date: string;
          title: string;
          updated_at: string;
          user_id: string;
          vendor_name: string | null;
        };
        Insert: {
          account_id: string;
          category_id?: string | null;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          next_run_date: string;
          title: string;
          updated_at?: string;
          user_id: string;
          vendor_name?: string | null;
        };
        Update: {
          account_id?: string;
          category_id?: string | null;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          next_run_date?: string;
          title?: string;
          updated_at?: string;
          user_id?: string;
          vendor_name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_recurring_account_same_user';
            columns: ['account_id', 'user_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id', 'user_id'];
          },
          {
            foreignKeyName: 'fk_recurring_user_category_same_user';
            columns: ['category_id', 'user_id'];
            isOneToOne: false;
            referencedRelation: 'user_categories';
            referencedColumns: ['id', 'user_id'];
          },
          {
            foreignKeyName: 'recurring_expenses_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'user_categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'recurring_expenses_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      settlements: {
        Row: {
          amount: number;
          completed_at: string | null;
          contact_id: string;
          created_at: string;
          id: string;
          original_transaction_id: string | null;
          paid_amount: number;
          role: string;
          status: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          completed_at?: string | null;
          contact_id: string;
          created_at?: string;
          id?: string;
          original_transaction_id?: string | null;
          paid_amount?: number;
          role: string;
          status?: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          completed_at?: string | null;
          contact_id?: string;
          created_at?: string;
          id?: string;
          original_transaction_id?: string | null;
          paid_amount?: number;
          role?: string;
          status?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_settlements_contact_same_user';
            columns: ['contact_id', 'user_id'];
            isOneToOne: false;
            referencedRelation: 'contacts';
            referencedColumns: ['id', 'user_id'];
          },
          {
            foreignKeyName: 'fk_settlements_transaction_same_user';
            columns: ['original_transaction_id', 'user_id'];
            isOneToOne: false;
            referencedRelation: 'transactions';
            referencedColumns: ['id', 'user_id'];
          },
          {
            foreignKeyName: 'settlements_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      transactions: {
        Row: {
          account_id: string
          amount: number
          category_id: string | null
          created_at: string
          deleted_at: string | null
          direction: string
          id: string
          is_pending: boolean | null
          memo: string | null
          parent_transaction_id: string | null
          recurring_expense_id: string | null
          settlement_date: string | null
          transaction_date: string
          transfer_group_id: string | null
          type: string
          updated_at: string
          user_id: string
          version: number
        }
        Insert: {
          account_id: string
          amount: number
          category_id?: string | null
          created_at?: string
          deleted_at?: string | null
          direction: string
          id?: string
          is_pending?: boolean | null
          memo?: string | null
          parent_transaction_id?: string | null
          recurring_expense_id?: string | null
          settlement_date?: string | null
          transaction_date: string
          transfer_group_id?: string | null
          type: string
          updated_at?: string
          user_id: string
          version?: number
        }
        Update: {
          account_id?: string
          amount?: number
          category_id?: string | null
          created_at?: string
          deleted_at?: string | null
          direction?: string
          id?: string
          is_pending?: boolean | null
          memo?: string | null
          parent_transaction_id?: string | null
          recurring_expense_id?: string | null
          settlement_date?: string | null
          transaction_date?: string
          transfer_group_id?: string | null
          type?: string
          updated_at?: string
          user_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: 'fk_transactions_account_same_user';
            columns: ['account_id', 'user_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id', 'user_id'];
          },
          {
            foreignKeyName: "fk_transactions_category_same_user"
            columns: ["category_id", "user_id"]
            isOneToOne: false
            referencedRelation: "user_categories"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "fk_transactions_parent"
            columns: ["parent_transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: 'fk_transactions_recurring_same_user';
            columns: ['recurring_expense_id', 'user_id'];
            isOneToOne: false;
            referencedRelation: 'recurring_expenses';
            referencedColumns: ['id', 'user_id'];
          },
          {
            foreignKeyName: 'fk_transactions_transfer_group_same_user';
            columns: ['transfer_group_id', 'user_id'];
            isOneToOne: false;
            referencedRelation: 'transfer_groups';
            referencedColumns: ['id', 'user_id'];
          },
          {
            foreignKeyName: 'transactions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      transfer_groups: {
        Row: {
          created_at: string;
          id: string;
          memo: string | null;
          status: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          memo?: string | null;
          status?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          memo?: string | null;
          status?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'transfer_groups_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      user_categories: {
        Row: {
          base_category_id: string | null;
          created_at: string;
          id: string;
          is_active: boolean;
          name: string;
          parent_id: string | null;
          user_id: string;
        };
        Insert: {
          base_category_id?: string | null;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name: string;
          parent_id?: string | null;
          user_id: string;
        };
        Update: {
          base_category_id?: string | null;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name?: string;
          parent_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_user_categories_parent';
            columns: ['parent_id', 'user_id'];
            isOneToOne: false;
            referencedRelation: 'user_categories';
            referencedColumns: ['id', 'user_id'];
          },
          {
            foreignKeyName: 'fk_user_categories_user';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_categories_base_category_id_fkey';
            columns: ['base_category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
        ];
      };
      users: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_account_with_details:
        | {
            Args: {
              p_amount_limit?: number
              p_balance_type?: string
              p_currency?: string
              p_current_balance?: number
              p_description?: string
              p_detail?: Json
              p_expiry_date?: string
              p_is_active?: boolean
              p_limit_remaining?: number
              p_linked_account_id?: string
              p_name: string
              p_provider?: string
              p_source?: string
              p_type: string
            }
            Returns: Json
          }
        | {
            Args: {
              p_amount_limit?: number
              p_balance_type?: string
              p_currency?: string
              p_current_balance?: number
              p_description?: string
              p_detail?: Json
              p_expiry_date?: string
              p_institution_id?: string
              p_is_active?: boolean
              p_limit_remaining?: number
              p_linked_account_id?: string
              p_name: string
              p_provider?: string
              p_source?: string
              p_type: string
            }
            Returns: Json
          }
      create_accounts_bulk: {
        Args: { input_data: Json }
        Returns: {
          inserted_id: string
          inserted_name: string
          inserted_type: string
        }[]
      }
      get_card_billing_standards: { Args: never; Returns: Json }
      get_financial_institutions: { Args: never; Returns: Json }
      get_user_account_dashboard: { Args: never; Returns: Json }
      get_user_account_dashboard_v2: { Args: never; Returns: Json }
    }
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
