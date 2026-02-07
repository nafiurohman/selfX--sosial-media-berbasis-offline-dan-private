import { useMemo } from 'react';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval } from 'date-fns';
import { id } from 'date-fns/locale';
import { TrendingUp, Heart, MessageCircle, Image, Calendar, BookOpen } from 'lucide-react';
import type { Post } from '@/lib/types';
import { getStories } from '@/lib/stats';

interface PeriodSummaryProps {
  posts: Post[];
  period: 'month' | 'year';
  date: Date;
}

export function PeriodSummary({ posts, period, date }: PeriodSummaryProps) {
  const stats = useMemo(() => {
    const start = period === 'month' ? startOfMonth(date) : startOfYear(date);
    const end = period === 'month' ? endOfMonth(date) : endOfYear(date);

    const periodPosts = posts.filter(post => 
      isWithinInterval(new Date(post.createdAt), { start, end })
    );

    const totalPosts = periodPosts.length;
    const totalLikes = periodPosts.filter(p => p.liked).length;
    const totalComments = periodPosts.reduce((sum, p) => sum + (p.comments?.length || 0), 0);
    const totalMedia = periodPosts.filter(p => p.image || p.video).length;
    
    // Story stats
    const allStories = getStories();
    const periodStories = allStories.filter(story => 
      isWithinInterval(new Date(story.createdAt), { start, end })
    );
    const totalStories = periodStories.length;
    
    // Most active day
    const dayCount = new Map<string, number>();
    periodPosts.forEach(post => {
      const day = format(new Date(post.createdAt), 'EEEE', { locale: id });
      dayCount.set(day, (dayCount.get(day) || 0) + 1);
    });
    const mostActiveDay = Array.from(dayCount.entries())
      .sort((a, b) => b[1] - a[1])[0];

    // Average posts per day
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const avgPerDay = (totalPosts / days).toFixed(1);

    return {
      totalPosts,
      totalLikes,
      totalComments,
      totalMedia,
      totalStories,
      mostActiveDay: mostActiveDay ? `${mostActiveDay[0]} (${mostActiveDay[1]} post)` : '-',
      avgPerDay,
    };
  }, [posts, period, date]);

  const periodLabel = period === 'month' 
    ? format(date, 'MMMM yyyy', { locale: id })
    : format(date, 'yyyy', { locale: id });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Ringkasan {period === 'month' ? 'Bulan' : 'Tahun'} {periodLabel}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="modern-card p-4 rounded-xl">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-xs">Total Post</span>
          </div>
          <p className="text-2xl font-bold">{stats.totalPosts}</p>
          <p className="text-xs text-muted-foreground mt-1">
            ~{stats.avgPerDay} per hari
          </p>
        </div>

        <div className="modern-card p-4 rounded-xl">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Heart className="w-4 h-4 text-like" />
            <span className="text-xs">Total Like</span>
          </div>
          <p className="text-2xl font-bold">{stats.totalLikes}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.totalPosts > 0 ? Math.round((stats.totalLikes / stats.totalPosts) * 100) : 0}% dari post
          </p>
        </div>

        <div className="modern-card p-4 rounded-xl">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs">Komentar</span>
          </div>
          <p className="text-2xl font-bold">{stats.totalComments}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.totalPosts > 0 ? (stats.totalComments / stats.totalPosts).toFixed(1) : 0} per post
          </p>
        </div>

        <div className="modern-card p-4 rounded-xl">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Image className="w-4 h-4" />
            <span className="text-xs">Media</span>
          </div>
          <p className="text-2xl font-bold">{stats.totalMedia}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.totalPosts > 0 ? Math.round((stats.totalMedia / stats.totalPosts) * 100) : 0}% dengan media
          </p>
        </div>

        <div className="modern-card p-4 rounded-xl col-span-2">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span className="text-xs">Total Cerita</span>
          </div>
          <p className="text-2xl font-bold">{stats.totalStories}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Cerita yang ditulis periode ini
          </p>
        </div>
      </div>

      <div className="modern-card p-4 rounded-xl">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">Hari Paling Aktif</span>
        </div>
        <p className="text-lg font-semibold">{stats.mostActiveDay}</p>
      </div>
    </div>
  );
}
