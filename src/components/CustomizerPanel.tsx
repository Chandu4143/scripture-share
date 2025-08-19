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
    className="space-y-4 py-4 border-b border-border/50"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    aria-labelledby={id}
  >
    <h3 id={id} className="text-base font-semibold flex items-center gap-2 px-4">
      {icon}
      {title}
    </h3>
    <div className="px-4">
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
    <Card className="w-full h-full border-0 bg-card/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <IconSettings className="w-6 h-6 text-primary" aria-hidden="true" />
          <CardTitle id="customizer-heading" className="text-lg">Customize</CardTitle>
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
                  className="h-auto p-3 flex flex-col items-center justify-center gap-2 transition-all duration-200 hover:bg-primary/10"
                  aria-label={`Select ${theme.label} theme`}
                  aria-pressed={customization.theme === theme.id}
                >
                  {theme.icon}
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
              <div role="group" aria-labelledby="font-size-label" className="grid grid-cols-4 gap-1 bg-muted p-1 rounded-lg">
                <Label id="font-size-label" className="sr-only">Font Size</Label>
                {fontSizes.map((size) => (
                  <Button
                    key={size.id}
                    variant={customization.fontSize === size.id ? "background" : "ghost"}
                    size="sm"
                    onClick={() => onChange({ ...customization, fontSize: size.id })}
                    aria-pressed={customization.fontSize === size.id}
                    aria-label={`Set font size to ${size.label}`}
                  >
                    {size.label}
                  </Button>
                ))}
              </div>
              <div role="group" aria-labelledby="text-align-label" className="grid grid-cols-3 gap-1 bg-muted p-1 rounded-lg">
                <Label id="text-align-label" className="sr-only">Text Alignment</Label>
                {alignments.map((align) => (
                  <Button
                    key={align.id}
                    variant={customization.alignment === align.id ? "background" : "ghost"}
                    size="icon"
                    onClick={() => onChange({ ...customization, alignment: align.id })}
                    aria-pressed={customization.alignment === align.id}
                    aria-label={`Align text ${align.label}`}
                  >
                    {align.icon}
                  </Button>
                ))}
              </div>
            </div>
          </Section>

          <Section id="colors-section" title="Colors" icon={<IconPalette className="w-5 h-5" />}>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm">Custom Colors</Label>
              <Button variant="ghost" size="sm" onClick={resetColors} className="text-xs h-auto py-1" aria-label="Reset colors">
                <IconRefresh className="w-3 h-3 mr-1" />
                Reset
              </Button>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Label htmlFor="bg-color" className="text-xs">BG</Label>
                <Input
                  id="bg-color"
                  type="color"
                  value={customization.backgroundColor || '#ffffff'}
                  onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                  className="h-9 p-1"
                  aria-label="Background color picker"
                />
              </div>
              <div className="relative flex-1">
                <Label htmlFor="text-color" className="text-xs">Text</Label>
                <Input
                  id="text-color"
                  type="color"
                  value={customization.textColor || '#000000'}
                  onChange={(e) => handleColorChange('textColor', e.target.value)}
                  className="h-9 p-1"
                  aria-label="Text color picker"
                />
              </div>
            </div>
          </Section>

          <Section id="background-section" title="Background" icon={<IconPhoto className="w-5 h-5" />}>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                id="background-image-input"
                accept="image/*"
                onChange={handleImageUpload}
                className="flex-1 text-xs h-9"
                aria-label="Upload background image"
              />
              <Button variant="ghost" size="icon" onClick={clearImage} disabled={!customization.backgroundImage} aria-label="Clear background image">
                <IconX className="w-4 h-4" />
              </Button>
            </div>
          </Section>

          <Section id="extras-section" title="Extras" icon={<IconSparkles className="w-5 h-5" />}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="watermark" className="flex items-center gap-2">
                  <IconDroplet className="w-4 h-4" />
                  Watermark
                </Label>
                <Input
                  id="watermark"
                  type="text"
                  placeholder="Your custom watermark"
                  value={customization.watermark || ''}
                  onChange={(e) => onChange({ ...customization, watermark: e.target.value })}
                  className="h-9 max-w-[180px]"
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