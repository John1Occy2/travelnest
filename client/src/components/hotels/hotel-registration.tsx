import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateHotel } from "@/hooks/use-hotels";
import { insertHotelSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function HotelRegistration() {
  const { toast } = useToast();
  const createHotel = useCreateHotel();

  const form = useForm({
    resolver: zodResolver(insertHotelSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      images: [],
      virtualTours: [],
      amenities: [],
    },
  });

  async function onSubmit(values: any) {
    try {
      await createHotel.mutateAsync(values);
      toast({
        title: "Success",
        description: "Hotel registered successfully",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register hotel",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hotel Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter hotel name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter hotel description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter hotel address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={createHotel.isPending}>
          {createHotel.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Register Hotel
        </Button>
      </form>
    </Form>
  );
}
