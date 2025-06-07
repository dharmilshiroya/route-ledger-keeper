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
      drivers: {
        Row: {
          address: string | null
          age: number | null
          city: string | null
          created_at: string
          email: string
          experience: number | null
          first_name: string | null
          hire_date: string | null
          id: string
          joining_date: string | null
          last_name: string | null
          license_number: string
          name: string | null
          phone: string
          salary: number | null
          state: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          age?: number | null
          city?: string | null
          created_at?: string
          email: string
          experience?: number | null
          first_name?: string | null
          hire_date?: string | null
          id?: string
          joining_date?: string | null
          last_name?: string | null
          license_number: string
          name?: string | null
          phone: string
          salary?: number | null
          state?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          age?: number | null
          city?: string | null
          created_at?: string
          email?: string
          experience?: number | null
          first_name?: string | null
          hire_date?: string | null
          id?: string
          joining_date?: string | null
          last_name?: string | null
          license_number?: string
          name?: string | null
          phone?: string
          salary?: number | null
          state?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          created_at: string
          date: string
          description: string
          id: string
          receipt: string | null
          type: string
          updated_at: string
          user_id: string
          vehicle_id: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          date: string
          description: string
          id?: string
          receipt?: string | null
          type: string
          updated_at?: string
          user_id: string
          vehicle_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          description?: string
          id?: string
          receipt?: string | null
          type?: string
          updated_at?: string
          user_id?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      goods_types: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      inbound_trip_items: {
        Row: {
          created_at: string
          customer_name: string
          fare_per_piece: number
          goods_type_id: string | null
          id: string
          inbound_trip_id: string
          receiver_name: string
          sr_no: number
          total_price: number
          total_quantity: number
          total_weight: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          fare_per_piece?: number
          goods_type_id?: string | null
          id?: string
          inbound_trip_id: string
          receiver_name: string
          sr_no: number
          total_price?: number
          total_quantity?: number
          total_weight?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          fare_per_piece?: number
          goods_type_id?: string | null
          id?: string
          inbound_trip_id?: string
          receiver_name?: string
          sr_no?: number
          total_price?: number
          total_quantity?: number
          total_weight?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inbound_trip_items_goods_type_id_fkey"
            columns: ["goods_type_id"]
            isOneToOne: false
            referencedRelation: "goods_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inbound_trip_items_inbound_trip_id_fkey"
            columns: ["inbound_trip_id"]
            isOneToOne: false
            referencedRelation: "inbound_trips"
            referencedColumns: ["id"]
          },
        ]
      }
      inbound_trips: {
        Row: {
          created_at: string
          date: string
          destination: string
          id: string
          source: string
          total_fare: number | null
          total_weight: number | null
          trip_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          destination: string
          id?: string
          source: string
          total_fare?: number | null
          total_weight?: number | null
          trip_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          destination?: string
          id?: string
          source?: string
          total_fare?: number | null
          total_weight?: number | null
          trip_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inbound_trips_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      outbound_trip_items: {
        Row: {
          created_at: string
          customer_name: string
          fare_per_piece: number
          goods_type_id: string | null
          id: string
          outbound_trip_id: string
          receiver_name: string
          sr_no: number
          total_price: number
          total_quantity: number
          total_weight: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          fare_per_piece?: number
          goods_type_id?: string | null
          id?: string
          outbound_trip_id: string
          receiver_name: string
          sr_no: number
          total_price?: number
          total_quantity?: number
          total_weight?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          fare_per_piece?: number
          goods_type_id?: string | null
          id?: string
          outbound_trip_id?: string
          receiver_name?: string
          sr_no?: number
          total_price?: number
          total_quantity?: number
          total_weight?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "outbound_trip_items_goods_type_id_fkey"
            columns: ["goods_type_id"]
            isOneToOne: false
            referencedRelation: "goods_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outbound_trip_items_outbound_trip_id_fkey"
            columns: ["outbound_trip_id"]
            isOneToOne: false
            referencedRelation: "outbound_trips"
            referencedColumns: ["id"]
          },
        ]
      }
      outbound_trips: {
        Row: {
          created_at: string
          date: string
          destination: string
          id: string
          source: string
          total_fare: number | null
          total_weight: number | null
          trip_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          destination: string
          id?: string
          source: string
          total_fare?: number | null
          total_weight?: number | null
          trip_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          destination?: string
          id?: string
          source?: string
          total_fare?: number | null
          total_weight?: number | null
          trip_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "outbound_trips_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          created_at: string
          id: string
          local_driver_id: string | null
          route_driver_id: string | null
          status: string
          trip_number: string
          updated_at: string
          user_id: string
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          local_driver_id?: string | null
          route_driver_id?: string | null
          status?: string
          trip_number: string
          updated_at?: string
          user_id: string
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          local_driver_id?: string | null
          route_driver_id?: string | null
          status?: string
          trip_number?: string
          updated_at?: string
          user_id?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trips_local_driver_id_fkey"
            columns: ["local_driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_route_driver_id_fkey"
            columns: ["route_driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          created_at: string
          emi_amount: number | null
          emi_date: string | null
          financed: boolean
          fuel_type: string
          id: string
          insurance_expiry: string | null
          last_service: string | null
          license_plate: string
          mileage: number | null
          national_permit_expiry: string | null
          permit_expiry: string | null
          pucc_expiry: string | null
          status: string
          updated_at: string
          user_id: string
          vehicle_owner: string
        }
        Insert: {
          created_at?: string
          emi_amount?: number | null
          emi_date?: string | null
          financed?: boolean
          fuel_type: string
          id?: string
          insurance_expiry?: string | null
          last_service?: string | null
          license_plate: string
          mileage?: number | null
          national_permit_expiry?: string | null
          permit_expiry?: string | null
          pucc_expiry?: string | null
          status?: string
          updated_at?: string
          user_id: string
          vehicle_owner: string
        }
        Update: {
          created_at?: string
          emi_amount?: number | null
          emi_date?: string | null
          financed?: boolean
          fuel_type?: string
          id?: string
          insurance_expiry?: string | null
          last_service?: string | null
          license_plate?: string
          mileage?: number | null
          national_permit_expiry?: string | null
          permit_expiry?: string | null
          pucc_expiry?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          vehicle_owner?: string
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
