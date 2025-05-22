import { UserRepository } from '@/app/user/user.repository';
import { UserService } from '@/app/user/user.service';
import { Provider } from '@nestjs/common';

export const userProviders: Provider[] = [UserRepository, UserService];
