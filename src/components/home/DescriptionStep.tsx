import { LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

interface DescriptionStepProps {
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >;
  title: string;
  description: string;
}

export default function DescriptionStep({
  Icon,
  title,
  description,
}: DescriptionStepProps) {
  return (
    <div className="flex flex-col items-center w-full gap-y-3 md:gap-y-4 text-center">
      <div className="flex justify-center items-center w-15 h-15 md:w-20 md:h-20 rounded-full bg-blue-100">
        <Icon size={20} className="text-blue-500" />
      </div>
      <span className="text-sm md:text-base font-medium">{title}</span>
      <h4 className="text-xs md:text-sm text-gray-600">{description}</h4>
    </div>
  );
}
