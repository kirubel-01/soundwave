
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

const TextInput = ({
  value,
  onChange,
  placeholder = "Enter text to convert to speech...",
  maxLength = 1000,
  className
}: TextInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (maxLength && newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  return (
    <div className={cn("relative rounded-lg transition-all duration-200", className)}>
      <Textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          "min-h-[200px] p-4 text-base resize-none transition-all duration-200 focus-visible:ring-1 rounded-lg",
          isFocused ? "shadow-lg" : "shadow-md"
        )}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      
      <div className="absolute bottom-2 right-3 text-xs text-muted-foreground font-medium">
        <span className={value.length > maxLength * 0.8 ? "text-amber-500" : ""}>
          {value.length}
        </span>
        <span>/{maxLength}</span>
      </div>
    </div>
  );
};

export default TextInput;
