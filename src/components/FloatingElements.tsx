import { Leaf, Apple, Carrot } from "lucide-react";

export function FloatingElements() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-20 dark:opacity-10">
      <Leaf 
        className="absolute top-20 left-10 text-primary float" 
        size={32}
        style={{ animationDelay: "0s" }}
      />
      <Apple 
        className="absolute top-40 right-20 text-accent float" 
        size={28}
        style={{ animationDelay: "1s" }}
      />
      <Carrot 
        className="absolute bottom-32 left-1/4 text-gold float" 
        size={24}
        style={{ animationDelay: "2s" }}
      />
      <Leaf 
        className="absolute bottom-20 right-1/3 text-primary float" 
        size={36}
        style={{ animationDelay: "3s" }}
      />
      <Apple 
        className="absolute top-1/3 left-1/3 text-accent float" 
        size={30}
        style={{ animationDelay: "4s" }}
      />
    </div>
  );
}
