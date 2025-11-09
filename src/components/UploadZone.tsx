import { Upload, Camera } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onImageSelect: (file: File) => void;
  isAnalyzing: boolean;
}

export function UploadZone({ onImageSelect, isAnalyzing }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      onImageSelect(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "relative rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-500",
          isDragging
            ? "border-primary bg-primary/10 scale-105 glow-green shadow-2xl"
            : "border-border hover:border-primary/50 hover:bg-primary/5 hover-lift",
          isAnalyzing && "pointer-events-none opacity-50"
        )}
      >
        <div className="space-y-8">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-8 transition-smooth hover:scale-110 hover:bg-primary/20 glow-green">
              <Upload className="h-16 w-16 text-primary" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-3xl font-bold text-foreground">
              Upload Your Meal
            </h3>
            <p className="text-lg text-muted-foreground">
              Drag and drop an image, or click to browse
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
              className="gradient-nature hover:opacity-90 hover:scale-105 transition-smooth text-white font-bold px-10 py-7 text-xl rounded-xl shadow-lg"
            >
              <Upload className="mr-2 h-6 w-6" />
              Choose File
            </Button>

            <Button
              onClick={() => cameraInputRef.current?.click()}
              disabled={isAnalyzing}
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary/10 hover:scale-105 transition-smooth px-10 py-7 text-xl rounded-xl font-bold"
            >
              <Camera className="mr-2 h-6 w-6" />
              Take Photo
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
