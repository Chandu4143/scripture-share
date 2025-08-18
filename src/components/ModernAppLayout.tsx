
import { useState } from 'react';
import { IconBible, IconSparkles, IconMenu2, IconX, IconHistory, IconSettings } from '@tabler/icons-react';
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
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Left side: Mobile History & Logo */}
            <div className="flex items-center gap-2">
              <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <IconHistory className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  {historyPanel}
                </SheetContent>
              </Sheet>
              <div className="flex items-center gap-3">
                <IconBible className="w-8 h-8 text-primary" />
                <h1 className="text-xl font-bold hidden sm:block">
                  Scripture Snippet
                </h1>
              </div>
            </div>

            {/* Center: Search */}
            <div className="flex-1 max-w-xl px-4">
              <SearchBar onSearch={onSearch} onRandom={onRandom} isLoading={isLoading} />
            </div>

            {/* Right side: Mobile Customizer & Desktop Icons */}
            <div className="flex items-center gap-2">
              <Sheet open={isCustomizerOpen} onOpenChange={setIsCustomizerOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
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
          {/* Left Sidebar (History) - Desktop */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-28">
              {historyPanel}
            </div>
          </div>

          {/* Main Content (Snippet) */}
          <main className="lg:col-span-6">
            {children}
          </main>

          {/* Right Sidebar (Customization) - Desktop */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-28">
              {customizerPanel}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
