import React, { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

export interface FilterOptions {
  searchTerm?: string;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: 'price' | 'quantity' | 'date';
  sortOrder?: 'asc' | 'desc';
}

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
  type: 'product' | 'buyer-listing';
}

const categories = {
  product: [
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'grains', label: 'Grains' },
    { value: 'pulses', label: 'Pulses' },
    { value: 'spices', label: 'Spices' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'other', label: 'Other' },
  ],
  'buyer-listing': [
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'grains', label: 'Grains' },
    { value: 'pulses', label: 'Pulses' },
    { value: 'spices', label: 'Spices' },
    { value: 'other', label: 'Other' },
  ],
};

export const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, type }) => {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    const newFilters = { ...filters, searchTerm: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== null && v !== ''
  ).length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={
              type === 'product'
                ? 'Search products by name...'
                : 'Search crop requests by name...'
            }
            value={filters.searchTerm || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2 relative">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Options</SheetTitle>
              <SheetDescription>
                Refine your search with advanced filters
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 mt-6">
              {/* Category Filter */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={filters.category || ''}
                  onValueChange={(value: string) => handleFilterChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    {categories[type].map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location Filter */}
              <div className="space-y-2">
                <Label>Location (City/State)</Label>
                <Input
                  placeholder="e.g., Mumbai, Maharashtra"
                  value={filters.location || ''}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                />
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <Label>Price Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min price"
                    value={filters.minPrice || ''}
                    onChange={(e) =>
                      handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Max price"
                    value={filters.maxPrice || ''}
                    onChange={(e) =>
                      handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)
                    }
                  />
                </div>
              </div>

              {/* Minimum Rating */}
              <div className="space-y-2">
                <Label>Minimum {type === 'product' ? 'Farmer' : 'Buyer'} Rating</Label>
                <Select
                  value={filters.minRating?.toString() || ''}
                  onValueChange={(value: string) =>
                    handleFilterChange('minRating', value ? Number(value) : undefined)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any rating</SelectItem>
                    <SelectItem value="4">4+ stars</SelectItem>
                    <SelectItem value="3">3+ stars</SelectItem>
                    <SelectItem value="2">2+ stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select
                  value={filters.sortBy || ''}
                  onValueChange={(value: string) => handleFilterChange('sortBy', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Newest first" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Newest first</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="quantity">Quantity</SelectItem>
                    <SelectItem value="date">
                      {type === 'product' ? 'Harvest Date' : 'Delivery Date'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Order */}
              {filters.sortBy && (
                <div className="space-y-2">
                  <Label>Sort Order</Label>
                  <Select
                    value={filters.sortOrder || 'asc'}
                    onValueChange={(value: string) => handleFilterChange('sortOrder', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Low to High</SelectItem>
                      <SelectItem value="desc">High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Clear Filters Button */}
              {activeFilterCount > 0 && (
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="w-full gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear All Filters
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.category && (
            <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-sm flex items-center gap-2">
              <span>
                Category:{' '}
                {categories[type].find((c) => c.value === filters.category)?.label}
              </span>
              <button
                onClick={() => handleFilterChange('category', undefined)}
                className="hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {filters.location && (
            <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-sm flex items-center gap-2">
              <span>Location: {filters.location}</span>
              <button
                onClick={() => handleFilterChange('location', undefined)}
                className="hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {(filters.minPrice || filters.maxPrice) && (
            <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-sm flex items-center gap-2">
              <span>
                Price: ₹{filters.minPrice || 0} - ₹{filters.maxPrice || '∞'}
              </span>
              <button
                onClick={() => {
                  handleFilterChange('minPrice', undefined);
                  handleFilterChange('maxPrice', undefined);
                }}
                className="hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {filters.minRating && (
            <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-sm flex items-center gap-2">
              <span>Min Rating: {filters.minRating}+</span>
              <button
                onClick={() => handleFilterChange('minRating', undefined)}
                className="hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
