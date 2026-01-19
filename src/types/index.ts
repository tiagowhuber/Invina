// Backend Model Types

// Enums
export type TourType = 'option_1' | 'option_2' | 'option_3'
export type OrderStatus = 'pending' | 'paid' | 'cancelled' | 'expired'
export type TicketStatus = 'reserved' | 'confirmed' | 'used' | 'cancelled'
export type TransactionStatus = 'pending' | 'approved' | 'rejected' | 'failed'
export type TourInstanceStatus = 'active' | 'completed' | 'cancelled'

// Tours
export interface Tour {
  id: number
  name: string
  description?: string
  location: string
  address?: string
  tour_type: TourType
  base_price: number
  min_tickets: number
  max_capacity: number
  duration_minutes: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Wine {
  id: number
  name: string
  variety?: string
  vintage?: number
  description?: string
  is_active: boolean
  created_at: string
}

export interface TourWithWines extends Tour {
  wines: Wine[]
}

export interface TourInstance {
  id: number
  tour_id: number
  instance_date: string
  instance_time: string
  capacity: number
  tickets_sold: number
  status: TourInstanceStatus
  created_at: string
  updated_at: string
}

export interface TourInstanceAvailability {
  instance_time: string
  capacity: number
  tickets_sold: number
  tickets_available: number
  instance_id?: number
}

export interface TourAvailabilityResponse {
  tour_id: number
  tour_name: string
  tour_type: TourType
  date: string
  min_tickets: number
  max_capacity: number
  base_price: number
  availability: TourInstanceAvailability[]
}

// Orders
export interface Order {
  id: number
  order_number: string
  tour_instance_id: number
  customer_name: string
  customer_email: string
  customer_phone?: string
  ticket_quantity: number
  total_amount: number
  status: OrderStatus
  created_at: string
  updated_at: string
}

export interface TourInstanceWithTour extends TourInstance {
  tour: Tour
}

export interface OrderWithDetails extends Order {
  tour_instance: TourInstanceWithTour
  tickets: Ticket[]
  wines?: Wine[]
}

// Tickets
export interface Ticket {
  id: number
  order_id: number
  ticket_number: string
  attendee_name?: string
  status: TicketStatus
  created_at: string
  updated_at: string
}

export interface TicketWithDetails extends Ticket {
  order: Order
  tour_instance: TourInstanceWithTour
}

// WebPay Transactions
export interface WebPayTransaction {
  id: number
  order_id: number
  token: string
  buy_order?: string
  amount: number
  status: TransactionStatus
  response_code?: string
  authorization_code?: string
  transaction_date?: string
  raw_response?: any
  created_at: string
  updated_at: string
}

export interface TicketStatistics {
  total_tickets: number
  reserved: number
  confirmed: number
  used: number
  cancelled: number
}

export interface TransactionStatistics {
  total_transactions: number
  approved: number
  rejected: number
  pending: number
  failed: number
  total_approved_amount: number
}

// API Request/Response Types
export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  errors?: any[]
  error?: string
}

export interface CreateBookingRequest {
  tour_id: number
  instance_date: string // YYYY-MM-DD
  instance_time: string // HH:MM
  ticket_quantity: number
  wine_ids?: number[] // Required for option_1, forbidden for option_2/option_3
  customer_name: string
  customer_email: string
  customer_phone?: string
}

export interface InitiatePaymentRequest {
  order_id: number
}

export interface InitiatePaymentResponse {
  token: string
  url: string
}

export interface UpdateAttendeeRequest {
  attendee_name: string
}

// Cart/UI Types
export interface CartItem {
  tour: Tour
  date: string
  time: string
  quantity: number
  selectedWines?: Wine[] // For option_1 tours
}

export interface BookingFormData {
  tour: Tour
  date: string
  time: string
  ticketQuantity: number
  selectedWines: number[]
  customerName: string
  customerEmail: string
  customerPhone: string
}
