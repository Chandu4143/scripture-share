import { useState, useRef, useEffect } from 'react';
import { BibleVerse, SnippetCustomization } from '@/types/bible';
import { fetchVerse, fetchRandomVerse } from '@/lib/bible-api';
import { SnippetCard } from '@/components/SnippetCard';
import { CustomizerPanel } from '@/components/CustomizerPanel';
import { ExportButton } from '@/components/ExportButton';
import { HistoryPanel } from '@/components/HistoryPanel';
import { ModernAppLayout } from '@/components/ModernAppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconBible, IconDice6 } from '@tabler/icons-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const Index = () => {
  const [verse, setVerse] = useState<BibleVerse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [customization, setCustomization] = useState<SnippetCustomization>({
    theme: 'modern',
    fontSize: 'base',
    alignment: 'center',
    showFilename: true,
    fontFamily: 'Inter',
  });
  const [history, setHistory] = useState<BibleVerse[]>([]);

  const snippetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedHistory = localStorage.getItem('verseHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('verseHistory', JSON.stringify(history));
  }, [history]);

  const addToHistory = (newVerse: BibleVerse) => {
    setHistory(prevHistory => {
      const isAlreadyInHistory = prevHistory.some(v => v.reference === newVerse.reference);
      if (!isAlreadyInHistory) {
        return [newVerse, ...prevHistory].slice(0, 10); // Keep last 10
      }
      return prevHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const handleSearch = async (reference: string) => {
    setIsLoading(true);
    setVerse(null);
    try {
      const result = await fetchVerse(reference);
      if (result) {
        setVerse(result);
        addToHistory(result);
        toast.success('Verse loaded successfully!');
      } else {
        toast.error('Verse not found. Please check your reference.');
        setVerse(null); // Ensure no old verse is shown
      }
    } catch (error) {
      toast.error('Failed to load verse. Please try again.');
      setVerse(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRandom = async () => {
    setIsLoading(true);
    setVerse(null);
    try {
      const result = await fetchRandomVerse();
      if (result) {
        setVerse(result);
        addToHistory(result);
        toast.success('Random verse loaded!');
      } else {
        toast.error('Failed to load random verse.');
      }
    } catch (error) {
      toast.error('Failed to load random verse. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (history.length > 0) {
      setVerse(history[0]);
      setIsLoading(false);
    } else {
      handleSearch('John 3:16');
    }
  }, []);

  const historyPanel = (
    <HistoryPanel 
      history={history}
      onSelect={(v) => {
        setVerse(v);
        toast.info(`Loaded "${v.reference}" from history.`);
      }}
      onClear={clearHistory}
    />
  );

  const customizerPanel = (
    <CustomizerPanel 
      customization={customization}
      onChange={setCustomization}
    />
  );

  return (
    <ModernAppLayout
      historyPanel={historyPanel}
      customizerPanel={customizerPanel}
      onSearch={handleSearch}
      onRandom={handleRandom}
      isLoading={isLoading}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={verse ? verse.reference : 'loading'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {verse ? (
            <div className="space-y-6">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <Card className="relative overflow-hidden border-border bg-card/60 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
                  <CardContent className="p-0">
                    <div className="flex justify-center py-12 px-4">
                      <SnippetCard
                        ref={snippetRef}
                        verse={verse}
                        customization={customization}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center gap-4">
                <ExportButton
                  targetRef={snippetRef}
                  filename={`${verse.book}-${verse.chapter}-${verse.verse}`}
                  disabled={!verse}
                />
              </div>
            </div>
          ) : (
            <div className="relative">
              <Card className="relative p-16 border-dashed border-2 border-muted-foreground/20 bg-card/20">
                <div className="text-center text-muted-foreground">
                  {isLoading ? (
                    <div className="space-y-4 flex flex-col items-center">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-lg font-medium">Loading verse...</span>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <IconBible className="w-16 h-16 mx-auto text-muted-foreground/30" />
                      <div>
                        <h3 className="text-xl font-semibold mb-2">No verse selected</h3>
                        <p className="text-muted-foreground/70">Search for a verse or select one from your history.</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </ModernAppLayout>
  );
};

export default Index;
