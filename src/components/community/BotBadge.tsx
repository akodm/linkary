'use client';

import { useLingui } from '@lingui/react';
import { BotIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from 'src/components/ui/tooltip';
import { Badge } from 'src/components/ui/badge';

export default function BotBadge() {
  const { i18n } = useLingui();

  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge className="bg-blue-500 p-1">
          <BotIcon className="text-white size-4" />
        </Badge>
      </TooltipTrigger>
      <TooltipContent>{i18n.t('This link is added by the bot')}</TooltipContent>
    </Tooltip>
  );
}
