"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Clock, Star, ShoppingCart, Heart, Search } from "lucide-react"
import { mockOrders, trendingProducts } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function AppRightPanel() {
  const [activeTab, setActiveTab] = useState<"orders" | "trending" | "actions">("orders")

  const recentOrders = mockOrders.slice(0, 3)

  return (
    <div className="w-80 bg-white dark:bg-slate-900 p-4 space-y-6 hidden lg:block border-l border-slate-200 dark:border-slate-700">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("orders")}
          className={cn(
            "flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all",
            activeTab === "orders"
              ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100",
          )}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab("trending")}
          className={cn(
            "flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all",
            activeTab === "trending"
              ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100",
          )}
        >
          Trending
        </button>
        <button
          onClick={() => setActiveTab("actions")}
          className={cn(
            "flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all",
            activeTab === "actions"
              ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100",
          )}
        >
          Actions
        </button>
      </div>

      {/* Recent Orders */}
      {activeTab === "orders" && (
        <Card className="border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center text-slate-900 dark:text-slate-100">
              <Clock className="mr-2 h-5 w-5 text-blue-600" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    src={order.image || "/placeholder.svg"}
                    alt={order.product}
                    className="w-8 h-8 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100 text-sm truncate max-w-[120px]">
                      {order.product}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{order.date}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-xs px-2 py-1 rounded-full font-medium",
                    order.status === "delivered"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : order.status === "shipped"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                  )}
                >
                  {order.status}
                </span>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full mt-3 border-slate-200 dark:border-slate-600">
              View All Orders
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Trending Products */}
      {activeTab === "trending" && (
        <Card className="border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center text-slate-900 dark:text-slate-100">
              <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
              Trending Now
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {trendingProducts.slice(0, 4).map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">{product.name}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-slate-600 dark:text-slate-400">{product.price}</p>
                    <span className="text-xs text-slate-400">•</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{product.category}</p>
                  </div>
                </div>
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">{product.trend}</span>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full mt-3 border-slate-200 dark:border-slate-600">
              Explore Trending
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      {activeTab === "actions" && (
        <Card className="border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center text-slate-900 dark:text-slate-100">
              <Star className="mr-2 h-5 w-5 text-blue-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start border-slate-200 dark:border-slate-600">
              <Search className="w-4 h-4 mr-2" />
              Find Similar Products
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start border-slate-200 dark:border-slate-600">
              <TrendingUp className="w-4 h-4 mr-2" />
              Price Drop Alerts
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start border-slate-200 dark:border-slate-600">
              <Heart className="w-4 h-4 mr-2" />
              Wishlist Items
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start border-slate-200 dark:border-slate-600">
              <ShoppingCart className="w-4 h-4 mr-2" />
              View Cart (3)
            </Button>
          </CardContent>
        </Card>
      )}

      {/* AI Suggestions */}
      <Card className="border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center text-slate-900 dark:text-slate-100">
            <Star className="mr-2 h-5 w-5 text-blue-600" />
            AI Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100 font-medium">💡 Based on your recent searches</p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              You might like the new MacBook Air M3 - 15% off this week!
            </p>
            <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700 text-white">
              View Deal
            </Button>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-900 dark:text-green-100 font-medium">🎯 Price Alert</p>
            <p className="text-xs text-green-700 dark:text-green-300 mt-1">
              Sony WH-1000XM5 dropped to $349 - Save $50!
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
            >
              Check Price
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
