import { PartialType } from '@nestjs/swagger';
import { CreateCollageDto } from './create-collage.dto';

export class UpdateCollageDto extends PartialType(CreateCollageDto) {}
