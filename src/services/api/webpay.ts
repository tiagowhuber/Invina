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
    return apiClient.post<ApiResponse<InitiatePaymentResponse>>('/webpay/initiate', data)
  },

  // Get transaction status
  getTransaction: (token: string) => {
    return apiClient.get<ApiResponse<WebPayTransaction>>(`/webpay/transaction/${token}`)
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
