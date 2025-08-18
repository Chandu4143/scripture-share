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
      // Add a delay to ensure all styles are applied
      await new Promise(resolve => setTimeout(resolve, 100));

      const dataUrl = await toPng(targetRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: 'transparent',
        width: targetRef.current.scrollWidth,
        height: targetRef.current.scrollHeight,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: targetRef.current.scrollWidth + 'px',
          height: targetRef.current.scrollHeight + 'px',
        },
        filter: (node) => {
          // Exclude any elements that might interfere with export
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