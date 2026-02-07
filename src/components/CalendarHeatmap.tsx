import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, startOfWeek, endOfWeek, addMonths, subMonths } from 'date-fns';
import { id } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Post } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CalendarHeatmapProps {
  posts: Post[];
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
}

export function CalendarHeatmap({ posts, onDateSelect, selectedDate }: CalendarHeatmapProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Calculate post count per day
  const postsByDate = useMemo(() => {
    const map = new Map<string, number>();
    posts.forEach(post => {
      const dateKey = format(new Date(post.createdAt), 'yyyy-MM-dd');
      map.set(dateKey, (map.get(dateKey) || 0) + 1);
    });
    return map;
  }, [posts]);

  // Get max posts in a day for intensity calculation
  const maxPosts = useMemo(() => {
    return Math.max(...Array.from(postsByDate.values()), 1);
  }, [postsByDate]);

  // Get calendar days
  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { locale: id });
    const end = endOfWeek(endOfMonth(currentMonth), { locale: id });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const getIntensity = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const count = postsByDate.get(dateKey) || 0;
    if (count === 0) return 0;
    return Math.ceil((count / maxPosts) * 4);
  };

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0: return 'bg-secondary/30';
      case 1: return 'bg-primary/20';
      case 2: return 'bg-primary/40';
      case 3: return 'bg-primary/60';
      case 4: return 'bg-primary/80';
      default: return 'bg-secondary/30';
    }
  };

  const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          {format(currentMonth, 'MMMM yyyy', { locale: id })}
        </h3>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(new Date())}
          >
            Hari Ini
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {/* Week days header */}
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map(day => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const postCount = postsByDate.get(dateKey) || 0;
            const intensity = getIntensity(day);
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
            const isToday = isSameDay(day, new Date());
            const isSelected = selectedDate && isSameDay(day, selectedDate);

            return (
              <button
                key={day.toISOString()}
                onClick={() => onDateSelect(day)}
                className={cn(
                  'aspect-square rounded-lg transition-all relative group',
                  getIntensityColor(intensity),
                  !isCurrentMonth && 'opacity-30',
                  isToday && 'ring-2 ring-primary',
                  isSelected && 'ring-2 ring-primary ring-offset-2',
                  'hover:scale-110 hover:z-10'
                )}
                title={`${format(day, 'd MMM yyyy', { locale: id })} - ${postCount} post`}
              >
                <span className={cn(
                  'text-xs font-medium',
                  intensity > 2 ? 'text-primary-foreground' : 'text-foreground'
                )}>
                  {format(day, 'd')}
                </span>
                {postCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {postCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Aktivitas</span>
        <div className="flex items-center gap-1">
          <span>Sedikit</span>
          {[0, 1, 2, 3, 4].map(i => (
            <div
              key={i}
              className={cn('w-3 h-3 rounded', getIntensityColor(i))}
            />
          ))}
          <span>Banyak</span>
        </div>
      </div>
    </div>
  );
}
