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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { z } from "zod";

const AVAILABLE_AMENITIES = [
  "WiFi",
  "Pool",
  "Spa",
  "Gym",
  "Restaurant",
  "Room Service",
  "Bar",
  "Parking",
  "Air Conditioning",
  "Conference Room",
  "Pet Friendly",
  "Beach Access",
  "Airport Shuttle",
  "Laundry Service",
  "Business Center",
] as const;

// Update the insertHotelSchema to include array types
const formSchema = insertHotelSchema.extend({
  images: z.array(z.string()).min(1, "At least one property image is required"),
  amenities: z.array(z.enum(AVAILABLE_AMENITIES)).min(1, "Select at least one amenity"),
  virtualTours: z.array(z.object({
    url: z.string().url("Please enter a valid virtual tour URL"),
    title: z.string().min(1, "Title is required"),
  })),
});

type FormValues = z.infer<typeof formSchema>;

export function HotelRegistration() {
  const { toast } = useToast();
  const createHotel = useCreateHotel();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      images: [],
      virtualTours: [],
      amenities: [],
    },
  });

  async function onSubmit(values: FormValues) {
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const imageUrls = await Promise.all(
      files.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result;
            if (typeof result === 'string') {
              resolve(result);
            }
          };
          reader.readAsDataURL(file);
        });
      })
    );

    const currentImages = form.getValues("images");
    form.setValue("images", [...currentImages, ...imageUrls], { shouldValidate: true });
  };

  const handleAddVirtualTour = () => {
    const currentTours = form.getValues("virtualTours") || [];
    form.setValue("virtualTours", [
      ...currentTours,
      { url: "", title: "" },
    ]);
  };

  const handleRemoveVirtualTour = (index: number) => {
    const currentTours = form.getValues("virtualTours") || [];
    const newTours = [...currentTours];
    newTours.splice(index, 1);
    form.setValue("virtualTours", newTours);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center mb-2">
          List Your Property
        </CardTitle>
        <p className="text-muted-foreground text-center">
          Showcase your property to millions of potential guests
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel Name <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter hotel name" {...field} />
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
                    <FormLabel>Address <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter hotel address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your property"
                      className="resize-none h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Added Virtual Tours FormField */}
            <FormField
              control={form.control}
              name="virtualTours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Virtual Tours</FormLabel>
                  <FormDescription className="text-muted-foreground mb-4">
                    Add 360-degree virtual tours of your property
                  </FormDescription>
                  <FormControl>
                    <div className="space-y-4">
                      {(field.value || []).map((tour, index) => (
                        <div key={index} className="flex gap-4 items-start">
                          <div className="flex-1 space-y-4">
                            <Input
                              placeholder="Tour Title (e.g., 'Master Bedroom Tour')"
                              value={tour.title}
                              onChange={(e) => {
                                const newTours = [...field.value];
                                newTours[index] = {
                                  ...newTours[index],
                                  title: e.target.value,
                                };
                                form.setValue("virtualTours", newTours);
                              }}
                            />
                            <Input
                              placeholder="Virtual Tour URL (from Matterport, etc.)"
                              value={tour.url}
                              onChange={(e) => {
                                const newTours = [...field.value];
                                newTours[index] = {
                                  ...newTours[index],
                                  url: e.target.value,
                                };
                                form.setValue("virtualTours", newTours);
                              }}
                            />
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            type="button"
                            onClick={() => handleRemoveVirtualTour(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddVirtualTour}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Virtual Tour
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Images <span className="text-red-500">*</span></FormLabel>
                  <FormDescription className="text-muted-foreground mb-4">
                    Upload high-quality images of your property (required)
                  </FormDescription>
                  <FormControl>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {field.value.map((url, index) => (
                        <div
                          key={index}
                          className="relative aspect-video rounded-lg overflow-hidden group"
                        >
                          <img
                            src={url}
                            alt={`Property ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                const newImages = [...field.value];
                                newImages.splice(index, 1);
                                form.setValue("images", newImages, { shouldValidate: true });
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                      <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed rounded-lg p-4 hover:bg-accent/50 cursor-pointer transition-colors">
                        <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Upload Images
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amenities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amenities <span className="text-red-500">*</span></FormLabel>
                  <FormDescription className="text-muted-foreground mb-4">
                    Select all amenities available at your property (at least one required)
                  </FormDescription>
                  <FormControl>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {AVAILABLE_AMENITIES.map((amenity) => {
                        const isSelected = field.value.includes(amenity);
                        return (
                          <Badge
                            key={amenity}
                            variant={isSelected ? "default" : "outline"}
                            className={cn(
                              "cursor-pointer transition-colors py-3",
                              isSelected
                                ? "bg-primary hover:bg-primary/80"
                                : "hover:bg-accent"
                            )}
                            onClick={() => {
                              const current = field.value || [];
                              field.onChange(
                                isSelected
                                  ? current.filter((a) => a !== amenity)
                                  : [...current, amenity]
                              );
                            }}
                          >
                            {amenity}
                          </Badge>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                size="lg"
                disabled={createHotel.isPending}
                className="w-full md:w-auto"
              >
                {createHotel.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Register Hotel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}