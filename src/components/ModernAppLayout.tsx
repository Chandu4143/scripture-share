
import { useState } from 'react';
import { IconBible, IconHistory, IconSettings } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SearchBar } from './SearchBar';

export function ModernAppLayout({
  children,
  historyPanel,
  customizerPanel,
  onSearch,
  onRandom,
  isLoading,
}: {
  children: React.ReactNode;
  historyPanel: React.ReactNode;
  customizerPanel: React.ReactNode;
  onSearch: (query: string) => void;
  onRandom: () => void;
  isLoading: boolean;
}) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/20">
      <header role="banner" className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2">
              <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open history panel">
                    <IconHistory className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  {historyPanel}
                </SheetContent>
              </Sheet>
              <div className="flex items-center gap-3">
                <IconBible className="w-8 h-8 text-primary" aria-hidden="true" />
                <h1 className="text-xl font-bold hidden sm:block">
                  Scripture Snippet
                </h1>
              </div>
            </div>

            <div className="flex-1 max-w-xl px-4" role="search">
              <SearchBar onSearch={onSearch} onRandom={onRandom} isLoading={isLoading} />
            </div>

            <div className="flex items-center gap-2">
              <Sheet open={isCustomizerOpen} onOpenChange={setIsCustomizerOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open customizer panel">
                    <IconSettings className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  {customizerPanel}
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          <aside className="hidden lg:block lg:col-span-3" role="complementary" aria-labelledby="history-heading">
            <div className="sticky top-28">
              {historyPanel}
            </div>
          </aside>

          <main role="main" className="lg:col-span-6">
            {children}
          </main>

          <aside className="hidden lg:block lg:col-span-3" role="complementary" aria-labelledby="customizer-heading">
            <div className="sticky top-28">
              {customizerPanel}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
