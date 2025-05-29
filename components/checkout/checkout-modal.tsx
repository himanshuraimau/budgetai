"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { CreditCard, Truck, Shield, ArrowLeft, Loader2 } from "lucide-react"
import type { Product } from "@/types/product"
import { PaymentProcessingModal } from "./payment-processing-modal"

interface CheckoutModalProps {
  product: Product
  quantity: number
  isOpen: boolean
  onClose: () => void
}

export function CheckoutModal({ product, quantity, isOpen, onClose }: CheckoutModalProps) {
  const [step, setStep] = useState<"shipping" | "payment" | "review">("shipping")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPaymentProcessing, setShowPaymentProcessing] = useState(false)

  const [shippingData, setShippingData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  })

  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
    paymentMethod: "card",
  })

  const [preferences, setPreferences] = useState({
    expressShipping: false,
    giftWrap: false,
    newsletter: false,
  })

  const total = product.price * quantity
  const shipping = preferences.expressShipping ? 15.99 : 5.99
  const giftWrap = preferences.giftWrap ? 4.99 : 0
  const tax = total * 0.08
  const finalTotal = total + shipping + giftWrap + tax

  const handleNext = () => {
    if (step === "shipping") setStep("payment")
    else if (step === "payment") setStep("review")
  }

  const handleBack = () => {
    if (step === "payment") setStep("shipping")
    else if (step === "review") setStep("payment")
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true)
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setShowPaymentProcessing(true)
  }

  const isStepValid = () => {
    if (step === "shipping") {
      return (
        shippingData.firstName &&
        shippingData.lastName &&
        shippingData.email &&
        shippingData.address &&
        shippingData.city &&
        shippingData.state &&
        shippingData.zipCode
      )
    }
    if (step === "payment") {
      return paymentData.cardNumber && paymentData.expiryDate && paymentData.cvv && paymentData.nameOnCard
    }
    return true
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">Checkout</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Steps */}
              <div className="flex items-center space-x-4">
                {["shipping", "payment", "review"].map((stepName, index) => (
                  <div key={stepName} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step === stepName
                          ? "bg-blue-600 text-white"
                          : index < ["shipping", "payment", "review"].indexOf(step)
                            ? "bg-green-600 text-white"
                            : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                      {stepName}
                    </span>
                    {index < 2 && <div className="w-8 h-px bg-slate-300 dark:bg-slate-600 ml-4" />}
                  </div>
                ))}
              </div>

              {/* Shipping Information */}
              {step === "shipping" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                      Shipping Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={shippingData.firstName}
                          onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={shippingData.lastName}
                          onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={shippingData.email}
                          onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={shippingData.phone}
                          onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={shippingData.address}
                          onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={shippingData.city}
                          onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={shippingData.state}
                          onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={shippingData.zipCode}
                          onChange={(e) => setShippingData({ ...shippingData, zipCode: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Shipping Options</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="expressShipping"
                          checked={preferences.expressShipping}
                          onCheckedChange={(checked) =>
                            setPreferences({ ...preferences, expressShipping: checked as boolean })
                          }
                        />
                        <Label htmlFor="expressShipping" className="flex items-center">
                          <Truck className="w-4 h-4 mr-2" />
                          Express Shipping (+$15.99) - 1-2 business days
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="giftWrap"
                          checked={preferences.giftWrap}
                          onCheckedChange={(checked) =>
                            setPreferences({ ...preferences, giftWrap: checked as boolean })
                          }
                        />
                        <Label htmlFor="giftWrap">Gift wrapping (+$4.99)</Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Information */}
              {step === "payment" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Payment Method</h3>
                    <RadioGroup
                      value={paymentData.paymentMethod}
                      onValueChange={(value) => setPaymentData({ ...paymentData, paymentMethod: value })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Credit/Debit Card
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="nameOnCard">Name on Card</Label>
                      <Input
                        id="nameOnCard"
                        value={paymentData.nameOnCard}
                        onChange={(e) => setPaymentData({ ...paymentData, nameOnCard: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={paymentData.cardNumber}
                        onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={paymentData.expiryDate}
                          onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={paymentData.cvv}
                          onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm font-medium">Your payment information is secure and encrypted</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Review Order */}
              {step === "review" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Review Your Order</h3>

                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Shipping Address</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {shippingData.firstName} {shippingData.lastName}
                          <br />
                          {shippingData.address}
                          <br />
                          {shippingData.city}, {shippingData.state} {shippingData.zipCode}
                        </p>
                      </div>

                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Payment Method</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          •••• •••• •••• {paymentData.cardNumber.slice(-4)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="newsletter"
                          checked={preferences.newsletter}
                          onCheckedChange={(checked) =>
                            setPreferences({ ...preferences, newsletter: checked as boolean })
                          }
                        />
                        <Label htmlFor="newsletter" className="text-sm">
                          Subscribe to our newsletter for exclusive deals and updates
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
                <Button
                  variant="outline"
                  onClick={step === "shipping" ? onClose : handleBack}
                  className="flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {step === "shipping" ? "Cancel" : "Back"}
                </Button>

                {step === "review" ? (
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Place Order - $${finalTotal.toFixed(2)}`
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Continue
                  </Button>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 sticky top-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Order Summary</h3>

                <div className="space-y-4">
                  <div className="flex space-x-3">
                    <img
                      src={product.images[0] || "/placeholder.svg?height=80&width=80"}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm">{product.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Qty: {quantity}</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">${product.price}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
                      <span className="text-slate-900 dark:text-slate-100">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">
                        Shipping {preferences.expressShipping && "(Express)"}
                      </span>
                      <span className="text-slate-900 dark:text-slate-100">${shipping.toFixed(2)}</span>
                    </div>
                    {preferences.giftWrap && (
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Gift Wrap</span>
                        <span className="text-slate-900 dark:text-slate-100">${giftWrap.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Tax</span>
                      <span className="text-slate-900 dark:text-slate-100">${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-slate-900 dark:text-slate-100">Total</span>
                    <span className="text-slate-900 dark:text-slate-100">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PaymentProcessingModal
        isOpen={showPaymentProcessing}
        onClose={() => {
          setShowPaymentProcessing(false)
          onClose()
        }}
        orderTotal={finalTotal}
        product={product}
      />
    </>
  )
}
