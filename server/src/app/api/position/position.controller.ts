import {
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { API_ROUTES } from '@shared/constants/routes.constants';
import { PositionEntity } from '@shared/types/position.type';
import type { UserEntity } from '@shared/types/user.type';
import { generateLink } from '@shared/utils/route.utils';
import { AuthGuard } from '@thallesp/nestjs-better-auth';
import { ParseObjectIdPipe } from '../../../pipes/parse-object-id.pipe';
import { User } from '../auth/auth.decorator';
import { WalletService } from '../wallet/wallet.service';
import { PositionService } from './position.service';

@Controller(generateLink({ route: [API_ROUTES.POSITION.BASE] }))
@UseGuards(AuthGuard)
export class PositionController {
  constructor(
    private readonly positionService: PositionService,
    private readonly walletService: WalletService,
  ) {}

  @Get(API_ROUTES.POSITION.FIND_BY_WALLET)
  async findByWallet(
    @User() user: UserEntity,
    @Param('walletId', ParseObjectIdPipe) walletId: string,
  ): Promise<PositionEntity[]> {
    const wallet = await this.walletService.findOne(walletId);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (wallet.userId.toString() !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    return this.positionService.findByWalletId(walletId);
  }

  @Get(API_ROUTES.POSITION.FIND_ONE)
  async findOne(
    @User() user: UserEntity,
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<PositionEntity> {
    const position = await this.positionService.findOne(id);
    if (!position) {
      throw new NotFoundException('Position not found');
    }

    const wallet = await this.walletService.findOne(position.walletId);
    if (!wallet || wallet.userId.toString() !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    return position;
  }
}
