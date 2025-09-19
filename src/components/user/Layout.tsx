import { SelectUser } from '@/db/schemas/users';

interface UserLayoutProps {
  user?: SelectUser;
}

export default function UserLayout({ user }: UserLayoutProps) {
  return (
    <div>
      <div>UserLayout</div>
      <div>{user?.name}</div>
    </div>
  );
}
