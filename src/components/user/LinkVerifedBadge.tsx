import { Badge } from 'src/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from 'src/components/ui/tooltip';
import dayjs from 'dayjs';

interface LinkVerifedBadgeProps {
  createdAt: Date;
  trigger: React.ReactNode;
  tooltip: string;
}

export default function LinkVerifedBadge({
  createdAt,
  trigger,
  tooltip,
}: LinkVerifedBadgeProps) {
  return (
    <Badge className="bg-white space-x-1">
      {createdAt && (
        <span className="text-xs text-neutral-500">
          {dayjs(createdAt).format('YYYY-MM-DD')}
        </span>
      )}
      <Tooltip>
        <TooltipTrigger>{trigger}</TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </Badge>
  );
}
