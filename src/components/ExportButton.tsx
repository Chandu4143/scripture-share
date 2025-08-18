import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconDownload, IconLoader2, IconShare, IconCopy, IconBrandTwitter, IconBrandFacebook } from '@tabler/icons-react';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';

interface ExportButtonProps {
  targetRef: React.RefObject<HTMLDivElement>;
  filename?: string;
  disabled?: boolean;
}

export function ExportButton({ targetRef, filename = 'bible-verse', disabled }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const generateImage = async () => {
    if (!targetRef.current) {
      toast.error('Unable to export: snippet not found');
      return null;
    }

    // Get the element's computed styles
    const element = targetRef.current;
    const computedStyle = window.getComputedStyle(element);

    return await toPng(element, {
      quality: 1.0,
      pixelRatio: 3, // Higher resolution
      backgroundColor: 'transparent',
      width: element.offsetWidth,
      height: element.offsetHeight,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
        width: `${element.offsetWidth}px`,
        height: `${element.offsetHeight}px`,
        margin: '0',
        padding: computedStyle.padding,
      },
      cacheBust: true,
      skipFonts: false,
      filter: (node) => {
        return !node.classList?.contains('no-export');
      },
    });
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const dataUrl = await generateImage();
      if (dataUrl) {
        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Bible snippet exported successfully!');
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export snippet. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    setIsExporting(true);
    try {
      const dataUrl = await generateImage();
      if (dataUrl) {
        const blob = await (await fetch(dataUrl)).blob();
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        toast.success('Image copied to clipboard!');
      }
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Failed to copy image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async (platform: 'twitter' | 'facebook') => {
    const text = encodeURIComponent('Check out this Bible verse snippet I created!');
    const url = encodeURIComponent(window.location.href);

    let shareUrl = '';
    if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    } else if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    }

    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex gap-2">
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
      <Button
        onClick={handleCopyToClipboard}
        disabled={disabled || isExporting}
        variant="outline"
      >
        <IconCopy className="w-4 h-4 mr-2" />
        Copy
      </Button>
      <Button
        onClick={() => handleShare('twitter')}
        disabled={disabled}
        variant="outline"
        size="icon"
      >
        <IconBrandTwitter className="w-5 h-5" />
      </Button>
      <Button
        onClick={() => handleShare('facebook')}
        disabled={disabled}
        variant="outline"
        size="icon"
      >
        <IconBrandFacebook className="w-5 h-5" />
      </Button>
    </div>
  );
}