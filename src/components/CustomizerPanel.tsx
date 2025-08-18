import { SnippetCustomization, SnippetTheme } from '@/types/bible';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  IconCode, 
  IconScriptPlus, 
  IconSparkles, 
  IconLayoutGrid,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconTypography
} from '@tabler/icons-react';

interface CustomizerPanelProps {
  customization: SnippetCustomization;
  onChange: (customization: SnippetCustomization) => void;
}

export function CustomizerPanel({ customization, onChange }: CustomizerPanelProps) {
  const themes: { id: SnippetTheme; label: string; icon: React.ReactNode; description: string }[] = [
    { 
      id: 'code', 
      label: 'Code', 
      icon: <IconCode className="w-4 h-4" />,
      description: 'Dark theme with syntax highlighting'
    },
    { 
      id: 'scripture', 
      label: 'Scripture', 
      icon: <IconScriptPlus className="w-4 h-4" />,
      description: 'Golden gradient with elegant typography'
    },
    { 
      id: 'modern', 
      label: 'Modern', 
      icon: <IconSparkles className="w-4 h-4" />,
      description: 'Purple gradient with clean design'
    },
    { 
      id: 'minimal', 
      label: 'Minimal', 
      icon: <IconLayoutGrid className="w-4 h-4" />,
      description: 'Clean white with subtle shadows'
    },
  ];

  const fontSizes = [
    { id: 'sm', label: 'Small' },
    { id: 'base', label: 'Medium' },
    { id: 'lg', label: 'Large' },
    { id: 'xl', label: 'Extra Large' },
  ] as const;

  const alignments = [
    { id: 'left', label: 'Left', icon: <IconAlignLeft className="w-4 h-4" /> },
    { id: 'center', label: 'Center', icon: <IconAlignCenter className="w-4 h-4" /> },
    { id: 'right', label: 'Right', icon: <IconAlignRight className="w-4 h-4" /> },
  ] as const;

  return (
    <Card className="w-full max-w-xs">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconTypography className="w-5 h-5" />
          Customize
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Theme</Label>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((theme) => (
              <Button
                key={theme.id}
                variant={customization.theme === theme.id ? "default" : "outline"}
                size="sm"
                onClick={() => onChange({ ...customization, theme: theme.id })}
                className="h-auto p-3 flex flex-col items-center gap-1"
              >
                {theme.icon}
                <span className="text-xs">{theme.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Font Size</Label>
          <div className="grid grid-cols-2 gap-2">
            {fontSizes.map((size) => (
              <Button
                key={size.id}
                variant={customization.fontSize === size.id ? "default" : "outline"}
                size="sm"
                onClick={() => onChange({ ...customization, fontSize: size.id })}
              >
                {size.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Text Alignment */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Alignment</Label>
          <div className="flex gap-1">
            {alignments.map((align) => (
              <Button
                key={align.id}
                variant={customization.alignment === align.id ? "default" : "outline"}
                size="sm"
                onClick={() => onChange({ ...customization, alignment: align.id })}
                className="flex-1"
              >
                {align.icon}
              </Button>
            ))}
          </div>
        </div>

        {/* Show Filename (Code theme only) */}
        {customization.theme === 'code' && (
          <div className="flex items-center justify-between">
            <Label htmlFor="filename" className="text-sm font-medium">
              Show Filename
            </Label>
            <Switch
              id="filename"
              checked={customization.showFilename}
              onCheckedChange={(checked) => 
                onChange({ ...customization, showFilename: checked })
              }
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}