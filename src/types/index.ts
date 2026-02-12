// Backend Model Types (Updated for new schema)

export type TourType = 'Standard' | 'Special'
export type OrderStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Refunded'
export type PaymentStatus = 'Pending' | 'Completed' | 'Failed' | 'Refunded'

// Generic API Response
export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  errors?: any[]
  error?: string
}

// Tours
export interface TourImage {
  id: number
  tourId: number
  imageUrl: string
  displayOrder: number
}

export interface Tour {
  id: number
  name: string
  description: string
  durationMinutes: number
  minAttendants: number
  maxAttendants: number
  basePrice: number // Changed from snake_case
  tourType: TourType
  fixedSchedule: boolean
  earliestHour: string
  latestHour: string
  bufferMinutes: number
  isActive: boolean
  wines?: Wine[]
  images?: TourImage[]
  menus?: Menu[]
  additionals?: Additional[]
}

export interface Menu {
  id: number;
  tourId: number;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  wines?: Wine[];
}

export interface Additional {
  id: number;
  tourId: number;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
}

export interface Wine {
  id: number
  name: string
  varietal?: string
  vintage?: number
  imageUrl?: string
}

// Orders
export interface Order {
  id: number
  orderNumber: string
  tourInstanceId: number
  customerName: string
  customerRut: string
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
  additionalIds?: number[]
  menuId?: number
  customerName: string
  customerRut: string
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
  customerRut: string
  customerName: string
  customerEmail: string
  customerPhone: string
}

// Extended Types
export interface TourInstance {
  id: number
  tourId: number
  instanceDate: string
  startTime: string
  currentAttendants: number
  tour?: Tour
}

export interface OrderWithDetails extends Order {
  tourInstance?: TourInstance
  menu?: Menu
  additionals?: Additional[]
}

// WebPay / Payment Types
export interface WebPayTransaction {
  id: number
  orderId: number
  token: string
  buyOrder?: string
  amount: number
  status: string
  responseCode?: string
  authorizationCode?: string
  transactionDate?: string
  rawResponse?: any
  createdAt: string
  updatedAt: string
}

export interface TransactionStatistics {
  totalTransactions: number
  approved: number
  rejected: number
  pending: number
  failed: number
  totalApprovedAmount: number
}

// API Request/Response Types
export interface CreateBookingRequest {
  tourId: number
  date: string // YYYY-MM-DD
  time: string // HH:mm:ss
  attendeesCount: number
  menuId?: number
  additionalIds?: number[]
  customerName: string
  customerRut: string
  customerEmail: string
  customerPhone?: string
}

export interface InitiatePaymentRequest {
  orderId: number
}

export interface InitiatePaymentResponse {
  orderNumber: string
  paymentUrl: string
  token: string
  amount: number
}

export interface TourAvailabilityResponse {
  slots: string[] // Available time slots (HH:mm:ss format)
}
