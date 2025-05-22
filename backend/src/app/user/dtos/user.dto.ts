import { User } from '@/app/user/user.entity';

export class UserDto extends User {
  constructor(user: User) {
    super();
    Object.assign(this, user);
  }
}
