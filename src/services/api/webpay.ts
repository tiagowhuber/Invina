import apiClient from './client'
import type {
  ApiResponse,
  WebPayTransaction,
  TransactionStatistics,
  InitiatePaymentRequest,
  InitiatePaymentResponse,
} from '@/types'

export const webpayApi = {
  // Initiate payment transaction
  initiate: (data: InitiatePaymentRequest) => {
    return apiClient.post<ApiResponse<InitiatePaymentResponse>>('/payments/create', data)
  },

  // Get transaction status
  getTransaction: (token: string) => {
    return apiClient.get<ApiResponse<WebPayTransaction>>(`/payments/verify/${token}`)
  },

  // Verify payment (Alias)
  verify: (token: string) => {
    return apiClient.get<ApiResponse<any>>(`/payments/verify/${token}`)
  },


  // Get all transactions (admin)
  getAllTransactions: () => {
    return apiClient.get<ApiResponse<WebPayTransaction[]>>('/webpay/transactions')
  },

  // Get payment statistics (admin)
  getStatistics: () => {
    return apiClient.get<ApiResponse<TransactionStatistics>>('/webpay/statistics')
  },
}
