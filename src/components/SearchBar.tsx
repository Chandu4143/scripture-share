import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IconSearch, IconDice6 } from '@tabler/icons-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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
      setReference('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          type="text"
          placeholder="Search (e.g., John 3:16)"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          className="pl-10 h-11 bg-muted/50 focus:bg-card transition-colors w-full"
          disabled={isLoading}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                onClick={onRandom}
                disabled={isLoading}
                className="w-8 h-8 rounded-full"
              >
                <IconDice6 className="w-5 h-5 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Get Random Verse</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  );
}