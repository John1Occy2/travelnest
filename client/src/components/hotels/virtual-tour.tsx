import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
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
    <div className="relative">
      <iframe
        src={currentTour.url}
        title={currentTour.title}
        className="w-full aspect-video rounded-lg"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        <Button variant="secondary" size="icon" onClick={handlePrev}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" onClick={handleNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{currentTour.title}</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFullscreen(true)}
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
