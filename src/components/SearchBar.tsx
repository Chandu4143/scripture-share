import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IconSearch, IconDice6 } from '@tabler/icons-react';

interface SearchBarProps {
  onSearch: (reference: string) => void;
  onRandom: () => void;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, onRandom, isLoading }: SearchBarProps) {
  const [reference, setReference] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reference.trim()) {
      onSearch(reference.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Enter verse reference (e.g., John 3:16, Romans 8:28)"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="pl-10 h-12 text-base"
            disabled={isLoading}
          />
        </div>
        <Button 
          type="submit" 
          disabled={isLoading || !reference.trim()}
          className="h-12 px-6"
        >
          <IconSearch className="w-4 h-4 mr-2" />
          Search
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onRandom}
          disabled={isLoading}
          className="h-12 px-4"
        >
          <IconDice6 className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}