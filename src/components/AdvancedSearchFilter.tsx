import { useState } from 'react';
import { Calendar, Image, Video, FileText, MessageCircle, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export interface SearchFilters {
  dateFrom?: Date;
  dateTo?: Date;
  mediaType?: 'all' | 'image' | 'video' | 'text';
  searchInComments?: boolean;
}

interface AdvancedSearchFilterProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export function AdvancedSearchFilter({ filters, onFiltersChange }: AdvancedSearchFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters = filters.dateFrom || filters.dateTo || filters.mediaType !== 'all' || filters.searchInComments;

  const clearFilters = () => {
    onFiltersChange({
      mediaType: 'all',
      searchInComments: false,
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative rounded-full"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filter
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Filter Pencarian</h4>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                Reset
              </Button>
            )}
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Rentang Tanggal</label>
            <div className="grid grid-cols-2 gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="justify-start text-left">
                    <Calendar className="w-4 h-4 mr-2" />
                    {filters.dateFrom ? format(filters.dateFrom, 'dd MMM', { locale: id }) : 'Dari'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarUI
                    mode="single"
                    selected={filters.dateFrom}
                    onSelect={(date) => onFiltersChange({ ...filters, dateFrom: date })}
                    locale={id}
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="justify-start text-left">
                    <Calendar className="w-4 h-4 mr-2" />
                    {filters.dateTo ? format(filters.dateTo, 'dd MMM', { locale: id }) : 'Sampai'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarUI
                    mode="single"
                    selected={filters.dateTo}
                    onSelect={(date) => onFiltersChange({ ...filters, dateTo: date })}
                    locale={id}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Media Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipe Konten</label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={filters.mediaType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onFiltersChange({ ...filters, mediaType: 'all' })}
              >
                <FileText className="w-4 h-4 mr-2" />
                Semua
              </Button>
              <Button
                variant={filters.mediaType === 'text' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onFiltersChange({ ...filters, mediaType: 'text' })}
              >
                <FileText className="w-4 h-4 mr-2" />
                Teks
              </Button>
              <Button
                variant={filters.mediaType === 'image' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onFiltersChange({ ...filters, mediaType: 'image' })}
              >
                <Image className="w-4 h-4 mr-2" />
                Foto
              </Button>
              <Button
                variant={filters.mediaType === 'video' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onFiltersChange({ ...filters, mediaType: 'video' })}
              >
                <Video className="w-4 h-4 mr-2" />
                Video
              </Button>
            </div>
          </div>

          {/* Search in Comments */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Cari di Komentar
            </label>
            <Button
              variant={filters.searchInComments ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFiltersChange({ ...filters, searchInComments: !filters.searchInComments })}
            >
              {filters.searchInComments ? 'Aktif' : 'Nonaktif'}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
