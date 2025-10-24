import { Edit, Trash2, User as UserIcon } from 'lucide-react';
import { User } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

const roleColors: Record<string, string> = {
  Admin: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
  'Front-desk': 'bg-blue-500/10 text-blue-700 border-blue-500/20',
  Doctor: 'bg-green-500/10 text-green-700 border-green-500/20',
  Nurse: 'bg-pink-500/10 text-pink-700 border-pink-500/20',
  'Lab tech': 'bg-orange-500/10 text-orange-700 border-orange-500/20',
  'Scan tech': 'bg-cyan-500/10 text-cyan-700 border-cyan-500/20',
};

export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
          <UserIcon className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No users found</h3>
        <p className="text-muted-foreground">Start by registering your first user</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl   bg-card shadow-medium overflow-hidden ">
      <Table>
        <TableHeader className='bg-indigo-400 '>
          <TableRow className="bg-muted/50 hover:bg-muted/50  border-b border-gray-200">
            <TableHead className="font-semibold">User</TableHead>
            <TableHead className="font-semibold">Contact</TableHead>
            <TableHead className="font-semibold">Role</TableHead>
            <TableHead className="font-semibold">Speciality</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-muted/30 transition-smooth  border-b border-gray-200">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-border">
                    <AvatarImage src={user.profilePhoto} alt={user.firstName} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {user.firstName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{user.firstName}</p>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{user.email}</p>
                  <p className="text-sm text-muted-foreground">{user.contact}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={cn('font-medium', roleColors[user.userRole])}>
                  {user.userRole}
                </Badge>
              </TableCell>
              <TableCell>
                {user.doctorDetails ? (
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">{user.doctorDetails.speciality}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.doctorDetails.yearsOfExperience} years exp.
                    </p>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(user)}
                    className="hover:bg-primary/10 hover:text-primary transition-smooth"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(user.id)}
                    className="hover:bg-destructive/10 hover:text-destructive transition-smooth"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
