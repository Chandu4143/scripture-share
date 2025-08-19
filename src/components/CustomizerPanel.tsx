import { SnippetCustomization, SnippetTheme } from '@/types/bible';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnimatePresence, motion } from 'framer-motion';

import { 
  IconCode, 
  IconScriptPlus, 
  IconSparkles, 
  IconLayoutGrid,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconTypography,
  IconPalette,
  IconRefresh,
  IconPhoto,
  IconX,
  IconSettings,
  IconDroplet
} from '@tabler/icons-react';

interface CustomizerPanelProps {
  customization: SnippetCustomization;
  onChange: (customization: SnippetCustomization) => void;
}

const Section = ({ title, icon, children, id }: { title: string, icon: React.ReactNode, children: React.ReactNode, id: string }) => (
  <motion.div 
    className="space-y-6 py-6 border-b border-border/30 last:border-b-0"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    aria-labelledby={id}
  >
    <h3 id={id} className="text-sm font-semibold flex items-center gap-3 px-6 text-muted-foreground">
      <div className="w-5 h-5 flex items-center justify-center">
        {icon}
      </div>
      {title}
    </h3>
    <div className="px-6">
      {children}
    </div>
  </motion.div>
);

export function CustomizerPanel({ customization, onChange }: CustomizerPanelProps) {
  const themes: { id: SnippetTheme; label: string; icon: React.ReactNode; }[] = [
    { id: 'code', label: 'Code', icon: <IconCode className="w-5 h-5" /> },
    { id: 'scripture', label: 'Scripture', icon: <IconScriptPlus className="w-5 h-5" /> },
    { id: 'modern', label: 'Modern', icon: <IconSparkles className="w-5 h-5" /> },
    { id: 'minimal', label: 'Minimal', icon: <IconLayoutGrid className="w-5 h-5" /> },
  ];

  const fontSizes = [
    { id: 'sm', label: 'Small' },
    { id: 'base', label: 'Medium' },
    { id: 'lg', label: 'Large' },
    { id: 'xl', label: 'Extra Large' },
  ] as const;

  const alignments = [
    { id: 'left', label: 'Left', icon: <IconAlignLeft className="w-5 h-5" /> },
    { id: 'center', label: 'Center', icon: <IconAlignCenter className="w-5 h-5" /> },
    { id: 'right', label: 'Right', icon: <IconAlignRight className="w-5 h-5" /> },
  ] as const;

  const fontFamilies = [
    { id: 'Inter', label: 'Inter' },
    { id: 'Roboto', label: 'Roboto' },
    { id: 'Lato', label: 'Lato' },
    { id: 'Merriweather', label: 'Merriweather' },
    { id: 'Playfair Display', label: 'Playfair Display' },
    { id: 'JetBrains Mono', label: 'JetBrains Mono' },
    { id: 'Source Code Pro', label: 'Source Code Pro' },
  ] as const;

  const handleColorChange = (type: 'backgroundColor' | 'textColor', value: string) => {
    onChange({ ...customization, [type]: value });
  };

  const resetColors = () => {
    onChange({ ...customization, backgroundColor: undefined, textColor: undefined });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...customization, backgroundImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    onChange({ ...customization, backgroundImage: undefined });
  };

  return (
    <Card className="w-full h-full border-0 bg-card/95 backdrop-blur-md shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <IconSettings className="w-5 h-5 text-primary" aria-hidden="true" />
          </div>
          <CardTitle id="customizer-heading" className="text-xl font-semibold">Customize</CardTitle>
        </div>
      </CardHeader>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <CardContent className="p-0">
          <Section id="theme-section" title="Theme" icon={<IconSparkles className="w-5 h-5" />}>
            <div className="grid grid-cols-2 gap-2">
              {themes.map((theme) => (
                <Button
                  key={theme.id}
                  variant={customization.theme === theme.id ? "secondary" : "outline"}
                  onClick={() => onChange({ ...customization, theme: theme.id })}
                  className={`h-auto p-4 flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:scale-105 ${
                    customization.theme === theme.id 
                      ? "ring-2 ring-primary/20 bg-primary/5 border-primary/20" 
                      : "hover:bg-accent/50 hover:border-accent"
                  }`}
                  aria-label={`Select ${theme.label} theme`}
                  aria-pressed={customization.theme === theme.id}
                >
                  <div className={`transition-colors duration-200 ${
                    customization.theme === theme.id ? "text-primary" : "text-muted-foreground"
                  }`}>
                    {theme.icon}
                  </div>
                  <span className="text-sm font-medium">{theme.label}</span>
                </Button>
              ))}
            </div>
          </Section>

          <Section id="typography-section" title="Typography" icon={<IconTypography className="w-5 h-5" />}>
            <div className="space-y-4">
              <Select
                value={customization.fontFamily}
                onValueChange={(value) => onChange({ ...customization, fontFamily: value })}
              >
                <SelectTrigger aria-label="Select font family"><SelectValue placeholder="Select a font" /></SelectTrigger>
                <SelectContent>
                  {fontFamilies.map((font) => (
                    <SelectItem key={font.id} value={font.id} style={{ fontFamily: font.id }}>
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div role="group" aria-labelledby="font-size-label" className="grid grid-cols-4 gap-1 bg-muted/50 p-1.5 rounded-xl">
                <Label id="font-size-label" className="sr-only">Font Size</Label>
                {fontSizes.map((size) => (
                  <Button
                    key={size.id}
                    variant={customization.fontSize === size.id ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => onChange({ ...customization, fontSize: size.id })}
                    aria-pressed={customization.fontSize === size.id}
                    aria-label={`Set font size to ${size.label}`}
                    className={`rounded-lg transition-all duration-200 ${
                      customization.fontSize === size.id 
                        ? "bg-background shadow-sm border-border" 
                        : "hover:bg-background/50"
                    }`}
                  >
                    {size.label}
                  </Button>
                ))}
              </div>
              <div role="group" aria-labelledby="text-align-label" className="grid grid-cols-3 gap-1 bg-muted/50 p-1.5 rounded-xl">
                <Label id="text-align-label" className="sr-only">Text Alignment</Label>
                {alignments.map((align) => (
                  <Button
                    key={align.id}
                    variant={customization.alignment === align.id ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => onChange({ ...customization, alignment: align.id })}
                    aria-pressed={customization.alignment === align.id}
                    aria-label={`Align text ${align.label}`}
                    className={`rounded-lg transition-all duration-200 ${
                      customization.alignment === align.id 
                        ? "bg-background shadow-sm border-border" 
                        : "hover:bg-background/50"
                    }`}
                  >
                    {align.icon}
                  </Button>
                ))}
              </div>
            </div>
          </Section>

          <Section id="colors-section" title="Colors" icon={<IconPalette className="w-5 h-5" />}>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-sm font-medium">Custom Colors</Label>
              <Button variant="ghost" size="sm" onClick={resetColors} className="text-xs h-8 px-3 hover:bg-destructive/10 hover:text-destructive" aria-label="Reset colors">
                <IconRefresh className="w-3 h-3 mr-1" />
                Reset
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bg-color" className="text-xs font-medium text-muted-foreground">Background</Label>
                <div className="relative">
                  <Input
                    id="bg-color"
                    type="color"
                    value={customization.backgroundColor || '#ffffff'}
                    onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                    className="h-12 p-1 border-2 border-border/50 rounded-lg cursor-pointer hover:border-border transition-colors"
                    aria-label="Background color picker"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="text-color" className="text-xs font-medium text-muted-foreground">Text</Label>
                <div className="relative">
                  <Input
                    id="text-color"
                    type="color"
                    value={customization.textColor || '#000000'}
                    onChange={(e) => handleColorChange('textColor', e.target.value)}
                    className="h-12 p-1 border-2 border-border/50 rounded-lg cursor-pointer hover:border-border transition-colors"
                    aria-label="Text color picker"
                  />
                </div>
              </div>
            </div>
          </Section>

          <Section id="background-section" title="Background" icon={<IconPhoto className="w-5 h-5" />}>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Input
                  type="file"
                  id="background-image-input"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="flex-1 text-sm h-10 border-2 border-dashed border-border/50 hover:border-border transition-colors cursor-pointer"
                  aria-label="Upload background image"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={clearImage} 
                  disabled={!customization.backgroundImage} 
                  aria-label="Clear background image"
                  className="h-10 w-10 hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                >
                  <IconX className="w-4 h-4" />
                </Button>
              </div>
              {customization.backgroundImage && (
                <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg">
                  ✓ Background image uploaded
                </div>
              )}
            </div>
          </Section>

          <Section id="extras-section" title="Extras" icon={<IconSparkles className="w-5 h-5" />}>
            <div className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="watermark" className="flex items-center gap-2 text-sm font-medium">
                  <IconDroplet className="w-4 h-4 text-primary" />
                  Watermark
                </Label>
                <Input
                  id="watermark"
                  type="text"
                  placeholder="Add your watermark..."
                  value={customization.watermark || ''}
                  onChange={(e) => onChange({ ...customization, watermark: e.target.value })}
                  className="h-10 border-2 border-border/50 focus:border-primary transition-colors"
                  aria-label="Watermark text"
                />
              </div>
              <AnimatePresence>
                {customization.theme === 'code' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center justify-between pt-2">
                      <Label htmlFor="filename">Show Filename</Label>
                      <Switch
                        id="filename"
                        checked={customization.showFilename}
                        onCheckedChange={(checked) => 
                          onChange({ ...customization, showFilename: checked })
                        }
                        aria-label="Toggle filename visibility"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Section>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}