import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { API_ROUTES } from '@shared/constants/routes.constants';
import type { UserEntity } from '@shared/types/user.type';
import { generateLink } from '@shared/utils/route.utils';
import { AuthGuard } from '@thallesp/nestjs-better-auth';
import { User } from '../auth/auth.decorator';
import { UpdateUserDto } from './user.dto';
import { UserService } from './user.service';

@Controller(generateLink({ route: [API_ROUTES.USER.BASE] }))
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(API_ROUTES.USER.ME)
  async getMe(@User() user: UserEntity): Promise<{ user: UserEntity }> {
    const userEntity = await this.userService.findOne(user.id);

    if (!userEntity) {
      throw new NotFoundException('User not found');
    }
    return {
      user: userEntity,
    };
  }

  @Patch(API_ROUTES.USER.UPDATE)
  async updateMe(
    @User() user: UserEntity,
    @Body() body: UpdateUserDto,
  ): Promise<{ user: UserEntity }> {
    const updatedUser = await this.userService.update(user.id, body);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return {
      user: updatedUser,
    };
  }
}
