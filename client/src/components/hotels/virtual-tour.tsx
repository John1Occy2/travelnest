import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Maximize2, Play } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VirtualTourProps {
  tours: Array<{ url: string; title: string }>;
}

export function VirtualTour({ tours }: VirtualTourProps) {
  const [currentTourIndex, setCurrentTourIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!tours.length) {
    return null;
  }

  const currentTour = tours[currentTourIndex];

  const handleNext = () => {
    setCurrentTourIndex((prev) => (prev + 1) % tours.length);
  };

  const handlePrev = () => {
    setCurrentTourIndex((prev) => (prev - 1 + tours.length) % tours.length);
  };

  const TourContent = () => (
    <div className="relative group">
      <iframe
        src={currentTour.url}
        title={currentTour.title}
        className="w-full aspect-video rounded-lg shadow-lg"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
        <div className="flex gap-2">
          <Button variant="secondary" size="icon" onClick={handlePrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-primary/5 to-transparent p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            {currentTour.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            Virtual Tour {currentTourIndex + 1} of {tours.length}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFullscreen(true)}
          className="hover:bg-primary/10"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      <TourContent />

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>{currentTour.title}</DialogTitle>
          </DialogHeader>
          <TourContent />
        </DialogContent>
      </Dialog>
    </Card>
  );
}