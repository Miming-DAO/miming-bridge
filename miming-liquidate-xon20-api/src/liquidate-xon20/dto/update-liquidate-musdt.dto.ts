import { PartialType } from '@nestjs/mapped-types';
import { CreateLiquidateMUSDTDto } from './create-liquidate-musdt.dto';

export class UpdateLiquidateMUSDTDto extends PartialType(CreateLiquidateMUSDTDto) {}
