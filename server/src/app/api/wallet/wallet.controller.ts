import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { API_ROUTES } from '@shared/constants/routes.constants';
import type { UserEntity } from '@shared/types/user.type';
import { WalletEntity } from '@shared/types/wallet.type';
import { generateLink } from '@shared/utils/route.utils';
import { AuthGuard } from '@thallesp/nestjs-better-auth';
import { ParseObjectIdPipe } from '../../../pipes/parse-object-id.pipe';
import { User } from '../auth/auth.decorator';
import { CreateWalletDto, UpdateWalletDto } from './wallet.dto';
import { WalletService } from './wallet.service';

@Controller(generateLink({ route: [API_ROUTES.WALLET.BASE] }))
@UseGuards(AuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post(API_ROUTES.WALLET.CREATE)
  async create(
    @User() user: UserEntity,
    @Body() createWalletDto: CreateWalletDto,
  ): Promise<WalletEntity> {
    return this.walletService.create({
      ...createWalletDto,
      userId: user.id,
    });
  }

  @Get(API_ROUTES.WALLET.FIND_ALL)
  async findAll(@User() user: UserEntity): Promise<WalletEntity[]> {
    return this.walletService.findByUserId(user.id);
  }

  @Get(API_ROUTES.WALLET.FIND_ONE)
  async findOne(
    @User() user: UserEntity,
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<WalletEntity> {
    const wallet = await this.walletService.findOne(id);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (wallet.userId.toString() !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    return wallet;
  }

  @Patch(API_ROUTES.WALLET.UPDATE)
  async update(
    @User() user: UserEntity,
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateWalletDto: UpdateWalletDto,
  ): Promise<WalletEntity | null> {
    const wallet = await this.walletService.findOne(id);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (wallet.userId.toString() !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    return this.walletService.update(id, updateWalletDto);
  }

  @Delete(API_ROUTES.WALLET.DELETE)
  async remove(
    @User() user: UserEntity,
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<WalletEntity | null> {
    const wallet = await this.walletService.findOne(id);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (wallet.userId.toString() !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    return this.walletService.remove(id);
  }
}
