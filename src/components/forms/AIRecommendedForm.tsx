import { useCallback, useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from 'src/components/ui/dialog';
import { useLingui } from '@lingui/react';
import { Button } from 'src/components/ui/button';
import { colorPresets } from '@/css/colors';
import { Textarea } from 'src/components/ui/textarea';
import { TavilySearchResponse } from '@tavily/core';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from 'src/components/ui/tooltip';

interface AIRecommendedFormProps {
  results?: TavilySearchResponse['results'];
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (data: FieldValues) => void;
  onAddLink: (url: string) => void;
}

export default function AIRecommendedForm({
  results,
  open,
  setOpen,
  onSubmit,
  onAddLink,
}: AIRecommendedFormProps) {
  const { i18n } = useLingui();
  const form = useForm({
    defaultValues: {
      description: '',
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset({ description: '' });
    }
  }, [open, form]);

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{i18n.t('AI Link Recommendations')}</DialogTitle>
          <DialogDescription>
            {i18n.t(
              `Please describe what you'd like to get recommendations for.`,
            )}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Textarea
            {...form.register('description', {
              required: true,
            })}
            placeholder={i18n.t('Writing in English improves accuracy.')}
            className="resize-none"
          />
        </form>
        {Array.isArray(results) && (
          <>
            <h4>
              {i18n.t('These are the recommended result links.')}
              <span className="text-xs text-neutral-500">{` (${results.length})`}</span>
            </h4>
            <div className="flex flex-row gap-x-4 w-full overflow-x-auto scrollbar-hide">
              {!results.length ? (
                results.map((result) => {
                  return (
                    <RecommendedResult
                      key={result.url}
                      {...result}
                      onClick={() => onAddLink(result.url)}
                    />
                  );
                })
              ) : (
                <div className="flex justify-center items-center w-full min-h-20">
                  <h4 className="text-sm text-neutral-500 text-center">
                    {i18n.t(
                      'No recommendations found. Writing in English improves accuracy.',
                    )}
                  </h4>
                </div>
              )}
            </div>
          </>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{i18n.t('Cancel')}</Button>
          </DialogClose>
          <Button
            type="submit"
            variant="outline"
            className={colorPresets({ preset: 'primary' })}
            disabled={!form.formState.isDirty}
            onClick={form.handleSubmit(onSubmit)}
          >
            {i18n.t('Submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const RecommendedResult = ({
  title,
  score,
  content,
  url,
  onClick,
}: {
  title: string;
  score: number;
  content: string;
  url: string;
  onClick: () => void;
}) => {
  const [isAdd, setIsAdd] = useState(false);
  const { i18n } = useLingui();

  const onAdd = useCallback(() => {
    setIsAdd(true);
    onClick();
  }, [onClick]);

  return (
    <div className="flex flex-1 flex-col gap-y-2 min-w-full p-2 border border-neutral-200 rounded-lg">
      <div className="flex flex-row justify-between items-start">
        <h4 className="min-h-10 text-sm font-medium line-clamp-2">{title}</h4>
        <Tooltip>
          <TooltipTrigger className="-mt-1">
            <span className="text-xs text-blue-500">{`${score.toFixed(1)}/1.0`}</span>
          </TooltipTrigger>
          <TooltipContent>
            {i18n.t('The score is the confidence score of the result.')}
          </TooltipContent>
        </Tooltip>
      </div>
      <p className="min-h-20 text-sm text-neutral-500 line-clamp-4 break-words">
        {content}
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-2 text-xs text-neutral-500 line-clamp-1 underline"
      >
        {url}
      </a>
      <Button
        variant="outline"
        size="sm"
        className={colorPresets({ preset: 'primary' })}
        onClick={onAdd}
        disabled={isAdd}
      >
        {i18n.t('Add')}
      </Button>
    </div>
  );
};
