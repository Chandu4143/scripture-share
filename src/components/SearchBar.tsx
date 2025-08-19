import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IconSearch, IconDice6 } from '@tabler/icons-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Command, CommandInput, CommandList, CommandItem, CommandGroup } from '@/components/ui/command';
import { bibleBooks } from '@/lib/bible-books';

interface SearchBarProps {
  onSearch: (reference: string) => void;
  onRandom: () => void;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, onRandom, isLoading }: SearchBarProps) {
  const [reference, setReference] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reference.trim()) {
      onSearch(reference.trim());
      setReference('');
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="w-full relative">
      <Command className="relative w-full">
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <CommandInput
            ref={inputRef}
            value={reference}
            onValueChange={setReference}
            onFocus={() => setOpen(true)}
            placeholder="Search (e.g., John 3:16)"
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
        {open && (
          <CommandList className="absolute top-full mt-2 w-full rounded-lg border border-border bg-card shadow-lg z-50">
            <CommandGroup heading="Suggestions">
              {bibleBooks
                .filter((book) => book.toLowerCase().includes(reference.toLowerCase()))
                .slice(0, 5)
                .map((book) => (
                  <CommandItem
                    key={book}
                    onSelect={() => {
                      setReference(book + ' ');
                    }}
                  >
                    {book}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        )}
      </Command>
    </form>
  );
}