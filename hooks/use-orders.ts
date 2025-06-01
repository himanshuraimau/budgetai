import { useState, useEffect } from 'react'

interface Order {
  _id: string
  id: string
  items: Array<{
    productId: string
    productTitle: string
    productImage: string
    quantity: number
    price: number
  }>
  total: number
  currency: string
  status: string
  createdAt: string
  trackingNumber?: string
  estimatedDelivery?: string
}

interface OrdersResponse {
  orders: Order[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async (params: Record<string, string> = {}) => {
    setIsLoading(true)
    setError(null)

    try {
      const searchParams = new URLSearchParams(params)
      const response = await fetch(`/api/orders?${searchParams}`)

      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const data: OrdersResponse = await response.json()
      setOrders(data.orders)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orders'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const createOrder = async (orderData: {
    items: Array<{
      productId: string
      productTitle: string
      productImage: string
      quantity: number
      price: number
    }>
    shippingAddress: {
      street: string
      city: string
      state: string
      zipCode: string
      country: string
    }
    currency?: string
  }) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const order = await response.json()
      setOrders(prev => [order, ...prev])
      return order
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateOrder = async (orderId: string, updateData: Partial<Order>) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        throw new Error('Failed to update order')
      }

      const updatedOrder = await response.json()
      setOrders(prev => prev.map(order => 
        order.id === orderId ? updatedOrder : order
      ))
      return updatedOrder
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update order'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const cancelOrder = async (orderId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to cancel order')
      }

      setOrders(prev => prev.filter(order => order.id !== orderId))
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel order'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    orders,
    isLoading,
    error,
    fetchOrders,
    createOrder,
    updateOrder,
    cancelOrder,
  }
}

export function useOrder(orderId: string | null) {
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId)
    }
  }, [orderId])

  const fetchOrder = async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/orders/${id}`)

      if (!response.ok) {
        throw new Error('Order not found')
      }

      const data = await response.json()
      setOrder(data)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch order'
      setError(errorMessage)
      setOrder(null)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    order,
    isLoading,
    error,
    refetch: () => orderId && fetchOrder(orderId),
  }
}
