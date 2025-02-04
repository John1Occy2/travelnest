import { useState } from "react";
import { Hotel } from "@shared/schema";
import { PaymentForm } from "@/components/payments/payment-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface SubscriptionManagementProps {
  hotel: Hotel;
  onSubscriptionUpdate: () => void;
}

export function SubscriptionManagement({ hotel, onSubscriptionUpdate }: SubscriptionManagementProps) {
  const [clientSecret, setClientSecret] = useState<string>();
  const { toast } = useToast();

  const handleSubscribe = async () => {
    try {
      const response = await apiRequest("POST", `/api/hotels/${hotel.id}/subscribe`, {
        planType: "standard" // Can be expanded to support different plan types
      });
      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Failed to initialize subscription",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hotel Subscription</CardTitle>
        <CardDescription>
          Subscribe to list your hotel on our platform and access premium features
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hotel.subscriptionStatus === "active" ? (
          <div className="text-green-600">
            Your subscription is active
          </div>
        ) : clientSecret ? (
          <PaymentForm
            clientSecret={clientSecret}
            amount={9900} // $99.00 monthly subscription
            onSuccess={() => {
              setClientSecret(undefined);
              onSubscriptionUpdate();
              toast({
                title: "Success",
                description: "Your hotel subscription is now active",
              });
            }}
          />
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Subscribe now to showcase your hotel to millions of travelers
            </p>
            <div className="bg-accent/10 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold">Benefits include:</h4>
              <ul className="text-sm space-y-1">
                <li>• Priority listing in search results</li>
                <li>• Virtual tour hosting</li>
                <li>• Advanced analytics and insights</li>
                <li>• 24/7 premium support</li>
              </ul>
            </div>
            <Button onClick={handleSubscribe} className="w-full">
              Subscribe for $99/month
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
