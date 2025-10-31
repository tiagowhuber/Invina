// Backend Model Types
export interface Event {
  id: number
  name: string
  description?: string
  event_date: string
  location: string
  address?: string
  capacity: number
  price: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface EventWithAvailability extends Event {
  tickets_sold: number
  tickets_available: number
}

export type OrderStatus = 'pending' | 'paid' | 'cancelled' | 'expired'

export interface Order {
  id: number
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  total_amount: number
  status: OrderStatus
  created_at: string
  updated_at: string
}

export interface OrderWithDetails extends Order {
  tickets: TicketWithEvent[]
}

export type TicketStatus = 'reserved' | 'confirmed' | 'used' | 'cancelled'

export interface Ticket {
  id: number
  order_id: number
  event_id: number
  ticket_number: string
  attendee_name?: string
  status: TicketStatus
  created_at: string
  updated_at: string
}

export interface TicketWithEvent extends Ticket {
  order_number: string
  customer_name: string
  customer_email: string
  order_status: OrderStatus
  event_name: string
  event_date: string
  location: string
  address?: string
}

export interface TicketWithDetails extends Ticket {
  order_number: string
  customer_name: string
  customer_email: string
  order_status: OrderStatus
  event_name: string
  event_date: string
  location: string
  address?: string
}

export type TransactionStatus = 'pending' | 'approved' | 'rejected' | 'failed'

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

export interface CreateOrderRequest {
  customer_name: string
  customer_email: string
  customer_phone?: string
  tickets: {
    event_id: number
    attendee_name?: string
  }[]
}

export interface CreateEventRequest {
  name: string
  description?: string
  event_date: string
  location: string
  address?: string
  capacity: number
  price: number
}

export interface UpdateEventRequest {
  name?: string
  description?: string
  event_date?: string
  location?: string
  address?: string
  capacity?: number
  price?: number
  is_active?: boolean
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
  event: EventWithAvailability
  quantity: number
  attendeeNames: string[]
}
