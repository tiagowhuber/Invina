// Backend Model Types (Updated for new schema)

export type TourType = 'Standard' | 'Special'
export type OrderStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Refunded'
export type PaymentStatus = 'Pending' | 'Completed' | 'Failed' | 'Refunded'

// Tours
export interface Tour {
  id: number
  description: string
  durationMinutes: number
  minAttendants: number
  maxAttendants: number
  basePrice: number // Changed from snake_case
  tourType: TourType
  earliestHour: string
  latestHour: string
  bufferMinutes: number
  isActive: boolean
  wines?: Wine[]
}

export interface Wine {
  id: number
  name: string
  varietal?: string
  vintage?: number
}

// Orders
export interface Order {
  id: number
  orderNumber: string
  tourInstanceId: number
  customerName: string
  customerEmail: string
  customerPhone?: string
  attendeesCount: number // Replaces ticket_quantity
  totalAmount: number
  status: OrderStatus
  createdAt?: string
  updatedAt?: string
}

// Payments
export interface Payment {
  id: number
  orderId: number
  provider: string
  transactionId: string
  amount: number
  status: PaymentStatus
  responsePayload?: any
  createdAt: string
  updatedAt: string
}

// API Requests
export interface CreateOrderRequest {
  tourId: number
  date: string // YYYY-MM-DD
  time: string // HH:mm:ss
  attendeesCount: number
  customerName: string
  customerEmail: string
  customerPhone?: string
}

export interface CreateOrderResponse {
  orderNumber: string
  paymentUrl: string
  token: string
  amount: number
}

// UI Helpers (Mapped from backend or internal use)
export interface BookingFormData {
  tour: Tour | null
  date: string | null
  time: string | null
  attendeesCount: number
  customerName: string
  customerEmail: string
  customerPhone: string
}
