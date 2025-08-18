import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconDownload, IconLoader2 } from '@tabler/icons-react';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';

interface ExportButtonProps {
  targetRef: React.RefObject<HTMLDivElement>;
  filename?: string;
  disabled?: boolean;
}

export function ExportButton({ targetRef, filename = 'bible-verse', disabled }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!targetRef.current) {
      toast.error('Unable to export: snippet not found');
      return;
    }

    setIsExporting(true);

    try {
      // Longer delay to ensure all styles and fonts are loaded
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get the element's computed styles
      const element = targetRef.current;
      const computedStyle = window.getComputedStyle(element);
      
      const dataUrl = await toPng(element, {
        quality: 1.0,
        pixelRatio: 3, // Higher resolution
        backgroundColor: 'transparent',
        width: element.offsetWidth,
        height: element.offsetHeight,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: element.offsetWidth + 'px',
          height: element.offsetHeight + 'px',
          margin: '0',
          padding: computedStyle.padding,
        },
        cacheBust: true,
        skipFonts: false,
        filter: (node) => {
          return !node.classList?.contains('no-export');
        },
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Bible snippet exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export snippet. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={disabled || isExporting}
      className="bg-primary hover:bg-primary/90"
    >
      {isExporting ? (
        <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <IconDownload className="w-4 h-4 mr-2" />
      )}
      {isExporting ? 'Exporting...' : 'Export as PNG'}
    </Button>
  );
}