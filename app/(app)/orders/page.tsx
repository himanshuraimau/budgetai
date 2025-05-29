import { TopBar } from "@/components/layout/top-bar"
import { OrderHistory } from "@/components/orders/order-history"

export default function OrdersPage() {
  return (
    <div className="flex flex-col h-screen">
      <TopBar title="Orders" />
      <OrderHistory />
    </div>
  )
}
