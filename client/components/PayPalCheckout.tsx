import { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, CreditCard, User, AlertCircle } from "lucide-react";
import { env } from "@/lib/env";
import { useAuth } from "@/contexts/AuthContext";

interface PayPalCheckoutProps {
  planId: string;
  planName: string;
  amount: number; // in cents
  currency?: string;
  onSuccess: (details: any) => void;
  onError: (error: any) => void;
  onCancel?: () => void;
}

export function PayPalCheckout({
  planId,
  planName,
  amount,
  currency = "ZAR",
  onSuccess,
  onError,
  onCancel,
}: PayPalCheckoutProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPayPal, setShowPayPal] = useState(false);

  // Convert cents to currency amount
  const currencyAmount = (amount / 100).toFixed(2);

  const initialOptions = {
    clientId: env.paypal.clientId!,
    currency: currency,
    intent: "capture",
    components: "buttons",
    "enable-funding": "card,venmo",
    "disable-funding": "paylater,credit",
    locale: "en_ZA", // South African locale
  };

  const createOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
          amount: currencyAmount,
          currency,
          userId: user?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      return data.orderID;
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      onError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const onApprove = async (data: any) => {
    try {
      setLoading(true);
      const response = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderID: data.orderID,
          planId,
          userId: user?.id,
        }),
      });

      const details = await response.json();

      if (!response.ok) {
        throw new Error(details.error || "Failed to capture payment");
      }

      onSuccess(details);
    } catch (error) {
      console.error("Error capturing PayPal payment:", error);
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  if (!env.paypal.isConfigured) {
    return (
      <Card className="border-2 border-red-300 bg-red-50">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-3" />
          <h3 className="font-bold text-red-800 mb-2">
            Payment System Unavailable
          </h3>
          <p className="text-red-700 text-sm mb-3">
            PayPal configuration is missing. Please contact support.
          </p>
          <p className="text-xs text-red-600">
            Debug: Client ID {env.paypal.clientId ? "present" : "missing"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Payment Options Header */}
      <Card className="border-2 border-black bg-white">
        <CardHeader className="bg-slate-100 pb-4">
          <CardTitle className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Choose Payment Method</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Payment Summary */}
            <div className="bg-slate-50 p-4 border border-slate-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-slate-900">{planName}</span>
                <span className="text-xl font-bold text-slate-900">
                  R{currencyAmount}
                </span>
              </div>
              <p className="text-sm text-slate-600">Monthly subscription</p>
            </div>

            {/* Recommended Payment Method */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 mb-3">
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Recommended for SA
                </Badge>
              </div>

              <Button
                onClick={() => setShowPayPal(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                disabled={loading || showPayPal}
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Pay with Card (Debit/Credit)
              </Button>

              <p className="text-xs text-slate-600 text-center">
                Secure payment processed by PayPal. No PayPal account required.
              </p>
            </div>

            {/* Alternative: PayPal Account */}
            {!showPayPal && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm text-slate-600">Or use:</span>
                </div>

                <Button
                  onClick={() => setShowPayPal(true)}
                  variant="outline"
                  className="w-full border-2 border-slate-300 text-slate-700 py-3"
                  disabled={loading}
                >
                  <User className="h-5 w-5 mr-2" />
                  PayPal Account
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* PayPal Buttons */}
      {showPayPal && (
        <Card className="border-2 border-black bg-white">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <h3 className="font-semibold text-slate-900 mb-2">
                Complete Your Payment
              </h3>
              <p className="text-sm text-slate-600">
                Choose your preferred payment method below
              </p>
            </div>

            <PayPalScriptProvider options={initialOptions}>
              <PayPalButtons
                style={{
                  shape: "rect",
                  layout: "vertical",
                  color: "black",
                  label: "pay",
                  height: 55,
                }}
                createOrder={createOrder}
                onApprove={onApprove}
                onError={(err) => {
                  console.error("PayPal Error:", err);
                  onError(err);
                }}
                onCancel={() => {
                  console.log("PayPal payment cancelled");
                  onCancel?.();
                }}
                disabled={loading}
              />
            </PayPalScriptProvider>

            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                onClick={() => setShowPayPal(false)}
                className="text-slate-600"
                disabled={loading}
              >
                ← Back to payment options
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Card className="border-2 border-blue-300 bg-blue-50">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-blue-800">Processing your payment...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
