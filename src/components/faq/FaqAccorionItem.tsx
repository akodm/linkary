import { Trans } from '@lingui/react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'src/components/ui/accordion';

interface FaqAccordionContentProps {
  id: string;
  title: string;
  description: string;
}

export default function FaqAccorionItem({
  id,
  title,
  description,
}: FaqAccordionContentProps) {
  return (
    <AccordionItem value={id}>
      <AccordionTrigger className="text-sm md:text-base font-medium">
        {title}
      </AccordionTrigger>
      <AccordionContent className="text-xs md:text-sm text-gray-700">
        <Trans
          id={description}
          message={description}
          components={{
            a: (
              <a
                href="https://cloud.google.com/web-risk/docs/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm md:text-base font-medium underline"
              >
                {'https://cloud.google.com/web-risk/docs/overview'}
              </a>
            ),
          }}
        />
      </AccordionContent>
    </AccordionItem>
  );
}
