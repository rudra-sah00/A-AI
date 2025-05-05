import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User } from '@/lib/services/userService';
import { TableCell, TableRow } from '@/components/ui/table';

interface UserCardProps {
  user: User;
  onClick: () => void;
}

export function UserCard({ user, onClick }: UserCardProps) {
  return (
    <TableRow className="cursor-pointer" onClick={onClick}>
      <TableCell>
        <Avatar>
          <AvatarImage 
            src={user.photo_url || user.photoData} 
            alt={user.username} 
          />
          <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell className="font-medium">{user.username}</TableCell>
      <TableCell>{user.age}</TableCell>
      <TableCell>
        <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
          {user.role}
        </Badge>
      </TableCell>
      <TableCell className="text-right"> 
      </TableCell>
    </TableRow>
  );
}