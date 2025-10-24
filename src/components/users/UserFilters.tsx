import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@/contexts/UserContext';

interface UserFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  roleFilter: UserRole | 'All';
  onRoleFilterChange: (role: UserRole | 'All') => void;
}

export function UserFilters({
  searchQuery,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
}: UserFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, role or username..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={roleFilter} onValueChange={(value) => onRoleFilterChange(value as UserRole | 'All')}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent className='bg-white'>
          <SelectItem value="All">All Roles</SelectItem>
          <SelectItem value="Admin">Admin</SelectItem>
          <SelectItem value="Front-desk">Front-desk</SelectItem>
          <SelectItem value="Doctor">Doctor</SelectItem>
          <SelectItem value="Nurse">Nurse</SelectItem>
          <SelectItem value="Lab tech">Lab tech</SelectItem>
          <SelectItem value="Scan tech">Scan tech</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
