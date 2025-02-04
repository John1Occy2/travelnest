import { useState } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface PaymentFormProps {
  clientSecret: string;
  amount: number;
  onSuccess?: () => void;
}

function PaymentFormContent({ amount, onSuccess }: Omit<PaymentFormProps, "clientSecret">) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (error) {
      toast({
        title: "Payment failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment successful",
        description: "Your payment has been processed",
      });
      onSuccess?.();
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">
          Total: ${(amount / 100).toFixed(2)}
        </span>
        <Button type="submit" disabled={isProcessing}>
          {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Pay Now
        </Button>
      </div>
    </form>
  );
}

export function PaymentForm({ clientSecret, amount, onSuccess }: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentFormContent amount={amount} onSuccess={onSuccess} />
    </Elements>
  );
}
