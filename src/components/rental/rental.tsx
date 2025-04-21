'use client'
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RentalProfile } from '@/lib/types';
import RentalCard from '@/components/rental/RentalCard';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';


interface RentalGridProps {
  profiles: RentalProfile[];
}

const RentalGrid: React.FC<RentalGridProps> = ({ profiles }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(100);
  // const { toast } = useToast();

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'hangout', label: 'Hangout' },
    { value: 'events', label: 'Events' },
    { value: 'activities', label: 'Activities' },
    { value: 'travel', label: 'Travel Buddy' },
  ];

  const handleRent = (profile: RentalProfile) => {
    toast( 'Request Sent!',{
      description: `Your request to rent ${profile.name} has been sent.`,
    });
  };

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || 
                          profile.services.some(service => service.toLowerCase().includes(selectedCategory.toLowerCase()));
    const matchesPrice = profile.hourlyRate <= maxPrice;
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="container px-4 py-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search by name or service"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex gap-2">
              <SlidersHorizontal size={18} />
              Filters
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filter Options</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Price Range (per hour)</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm">$0</span>
                  <span className="text-sm font-medium">${maxPrice}</span>
                  <span className="text-sm">$100+</span>
                </div>
                <Slider
                  value={[maxPrice]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(value) => setMaxPrice(value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Popular Services</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['Hangout', 'Coffee Date', 'Events', 'Shopping', 'Travel', 'Dinner'].map((service) => (
                    <Badge key={service} variant="outline" className="cursor-pointer hover:bg-accent">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline">Reset</Button>
              <Button>Apply Filters</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfiles.map((profile) => (
          <RentalCard 
            key={profile.id} 
            profile={profile} 
            onRent={handleRent}
          />
        ))}
      </div>
      
      {filteredProfiles.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-600 mb-2">No matches found</h3>
          <p className="text-gray-500">Try adjusting your filters or search term</p>
        </div>
      )}
    </div>
  );
};

export default RentalGrid;