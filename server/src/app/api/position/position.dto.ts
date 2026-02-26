import { CreatePositionSchema } from '@shared/schemas/position.schemas';
import { PositionEntity } from '@shared/types/position.type';
import { createZodDto } from 'nestjs-zod';

export class CreatePositionDto extends createZodDto(CreatePositionSchema) {}

export type PositionDto = PositionEntity;
