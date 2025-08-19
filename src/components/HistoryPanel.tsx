import { BibleVerse } from '@/types/bible';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconHistory, IconTrash } from '@tabler/icons-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnimatePresence, motion } from 'framer-motion';

interface HistoryPanelProps {
  history: BibleVerse[];
  onSelect: (verse: BibleVerse) => void;
  onClear: () => void;
}

export function HistoryPanel({ history, onSelect, onClear }: HistoryPanelProps) {
  return (
    <Card className="w-full h-full border-0 bg-card/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <IconHistory className="w-6 h-6 text-primary" aria-hidden="true" />
          <CardTitle id="history-heading" className="text-lg">History</CardTitle>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClear} 
          disabled={history.length === 0}
          className="w-8 h-8 rounded-full"
          aria-label="Clear history"
        >
          <IconTrash className="w-5 h-5 text-muted-foreground" />
        </Button>
      </CardHeader>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <CardContent className="p-2">
          {history.length > 0 ? (
            <ul aria-live="polite" aria-atomic="true">
              <AnimatePresence>
                {history.map((verse, index) => (
                  <motion.li
                    key={verse.reference}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    layout
                  >
                    <Button
                      variant="ghost"
                      className="w-full h-auto justify-start p-3 text-left flex flex-col items-start gap-1"
                      onClick={() => onSelect(verse)}
                      aria-label={`Select verse ${verse.reference}`}
                    >
                      <p className="font-semibold text-primary">{verse.reference}</p>
                      <p className="text-xs text-muted-foreground font-normal truncate w-full">
                        {verse.text}
                      </p>
                    </Button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              <p>Your recently viewed verses will appear here.</p>
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}