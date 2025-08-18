import { useState, useRef, useEffect } from 'react';
import { BibleVerse, SnippetCustomization } from '@/types/bible';
import { fetchVerse, fetchRandomVerse } from '@/lib/bible-api';
import { SearchBar } from '@/components/SearchBar';
import { SnippetCard } from '@/components/SnippetCard';
import { CustomizerPanel } from '@/components/CustomizerPanel';
import { ExportButton } from '@/components/ExportButton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconBible, IconSparkles } from '@tabler/icons-react';
import { toast } from 'sonner';

const Index = () => {
  const [verse, setVerse] = useState<BibleVerse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customization, setCustomization] = useState<SnippetCustomization>({
    theme: 'modern',
    fontSize: 'base',
    alignment: 'center',
    showFilename: true,
  });

  const snippetRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (reference: string) => {
    setIsLoading(true);
    try {
      const result = await fetchVerse(reference);
      if (result) {
        setVerse(result);
        toast.success('Verse loaded successfully!');
      } else {
        toast.error('Verse not found. Please check your reference.');
      }
    } catch (error) {
      toast.error('Failed to load verse. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRandom = async () => {
    setIsLoading(true);
    try {
      const result = await fetchRandomVerse();
      if (result) {
        setVerse(result);
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

  // Load a default verse on first visit
  useEffect(() => {
    handleSearch('John 3:16');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3">
            <IconBible className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Bible Snippet Generator
            </h1>
            <IconSparkles className="w-6 h-6 text-secondary" />
          </div>
          <p className="text-center text-muted-foreground mt-2">
            Create beautiful, shareable Bible verse snippets with code-inspired aesthetics
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-12">
          <SearchBar 
            onSearch={handleSearch}
            onRandom={handleRandom}
            isLoading={isLoading}
          />
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Customization Panel */}
          <div className="lg:col-span-1">
            <CustomizerPanel 
              customization={customization}
              onChange={setCustomization}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {verse ? (
              <div className="space-y-6">
                {/* Snippet Preview */}
                <Card className="overflow-hidden">
                  <CardContent className="p-8">
                    <SnippetCard
                      ref={snippetRef}
                      verse={verse}
                      customization={customization}
                    />
                  </CardContent>
                </Card>

                {/* Export Controls */}
                <div className="flex justify-center">
                  <ExportButton
                    targetRef={snippetRef}
                    filename={`${verse.book}-${verse.chapter}-${verse.verse}`}
                    disabled={!verse}
                  />
                </div>
              </div>
            ) : (
              <Card className="p-12">
                <div className="text-center text-muted-foreground">
                  {isLoading ? (
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        Loading verse...
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <IconBible className="w-12 h-12 mx-auto text-muted-foreground/50" />
                      <p>Search for a Bible verse to get started</p>
                      <Button variant="outline" onClick={handleRandom}>
                        Try a random verse
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Bible verses from the ESV API. Create beautiful snippets to share your favorite verses.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
