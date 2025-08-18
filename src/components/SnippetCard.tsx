import { forwardRef } from 'react';
import { BibleVerse, SnippetCustomization } from '@/types/bible';
import { cn } from '@/lib/utils';

interface SnippetCardProps {
  verse: BibleVerse;
  customization: SnippetCustomization;
  className?: string;
}

export const SnippetCard = forwardRef<HTMLDivElement, SnippetCardProps>(
  ({ verse, customization, className }, ref) => {
    const { theme, fontSize, alignment, showFilename } = customization;

    const getThemeClasses = () => {
      switch (theme) {
        case 'code':
          return 'snippet-code border border-code-comment/20';
        case 'scripture':
          return 'snippet-scripture';
        case 'modern':
          return 'snippet-modern';
        case 'minimal':
          return 'snippet-minimal shadow-soft';
        default:
          return 'snippet-modern';
      }
    };

    const getFontSizeClass = () => {
      switch (fontSize) {
        case 'sm': return 'text-sm';
        case 'base': return 'text-base';
        case 'lg': return 'text-lg';
        case 'xl': return 'text-xl';
        default: return 'text-base';
      }
    };

    const getAlignmentClass = () => {
      switch (alignment) {
        case 'left': return 'text-left';
        case 'center': return 'text-center';
        case 'right': return 'text-right';
        default: return 'text-center';
      }
    };

    const getFilename = () => {
      const book = verse.book.replace(/\s+/g, '');
      return `${book}-${verse.chapter}-${verse.verse}.${theme === 'code' ? 'js' : 'txt'}`;
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative p-8 rounded-lg overflow-hidden transition-all duration-300',
          'min-h-[300px] max-w-2xl mx-auto',
          getThemeClasses(),
          className
        )}
      >
        {/* File header for code theme */}
        {theme === 'code' && showFilename && (
          <div className="absolute top-0 left-0 right-0 bg-code-bg/80 border-b border-code-comment/20 px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <span className="text-xs text-code-comment ml-2">{getFilename()}</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className={cn(
          'h-full flex flex-col justify-center',
          theme === 'code' && showFilename ? 'mt-8' : '',
          getAlignmentClass()
        )}>
          {/* Verse text */}
          <blockquote className={cn(
            'leading-relaxed mb-6',
            getFontSizeClass(),
            theme === 'code' ? 'font-code' : 
            theme === 'scripture' || theme === 'minimal' ? 'font-serif' : 'font-inter',
            theme === 'code' ? 'text-code-string' : ''
          )}>
            {theme === 'code' && '"'}{verse.text}{theme === 'code' && '"'}
          </blockquote>

          {/* Reference */}
          <cite className={cn(
            'not-italic font-medium',
            fontSize === 'xl' ? 'text-base' : 'text-sm',
            theme === 'code' ? 'text-code-keyword font-code' : 
            theme === 'scripture' ? 'text-scripture-accent' :
            theme === 'modern' ? 'text-white/80' : 'text-muted-foreground',
            alignment === 'left' ? 'text-left' :
            alignment === 'right' ? 'text-right' : 'text-center'
          )}>
            {theme === 'code' && '// '}{verse.reference}
          </cite>
        </div>

        {/* Decorative elements for scripture theme */}
        {theme === 'scripture' && (
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-scripture-accent/30"></div>
        )}
        {theme === 'scripture' && (
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-scripture-accent/30"></div>
        )}
      </div>
    );
  }
);

SnippetCard.displayName = 'SnippetCard';