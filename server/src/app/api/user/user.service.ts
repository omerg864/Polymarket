import { Injectable } from '@nestjs/common';
import { UserEntity } from '@shared/types/user.type';
import { UserProvider } from './user.provider';

@Injectable()
export class UserService {
  constructor(private readonly userProvider: UserProvider) {}

  async findOne(id: string): Promise<UserEntity | null> {
    return this.userProvider.findById(id);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userProvider.findByEmail(email);
  }

  async findAll(ids?: string[]): Promise<UserEntity[]> {
    return this.userProvider.list(ids);
  }

  async update(
    id: string,
    data: Partial<UserEntity>,
  ): Promise<UserEntity | null> {
    return this.userProvider.update(id, data);
  }
}
