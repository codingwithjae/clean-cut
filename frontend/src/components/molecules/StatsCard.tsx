import type { IconType } from 'react-icons';
import { Card } from '@/components/atoms/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: IconType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatsCard = ({ title, value, icon: Icon, trend }: StatsCardProps) => {
  return (
    <Card className="relative overflow-hidden group hover:border-cyber-blue/50 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-white">{value}</span>
            {trend && (
              <span
                className={`text-xs font-medium ${trend.isPositive ? 'text-neon-green' : 'text-red-500'} `}
              >
                {trend.isPositive ? '+' : ''}
                {trend.value}%
              </span>
            )}
          </div>
        </div>
        <div className="p-2 bg-cyber-blue/10 rounded-lg group-hover:bg-cyber-blue/20 transition-colors">
          <Icon className="h-5 w-5 text-cyber-blue" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-cyber-blue to-neon-green opacity-0 group-hover:opacity-100 transition-opacity" />
    </Card>
  );
};
