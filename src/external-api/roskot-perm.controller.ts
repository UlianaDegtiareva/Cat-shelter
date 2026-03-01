import { Controller, Post, Body, Headers, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiBody } from '@nestjs/swagger';
import { RosKotRegistrationDto } from './roskot-registration.dto';

@ApiTags('Perm-External-Agency (РосКотМониторинг)')
@Controller('external-api/roskot')
export class RosKotPermController {
  private readonly logger = new Logger('RosKotPerm');

  @Post('register-chip')
  @ApiOperation({ summary: 'Simulating an external chip registration API' })
  @ApiHeader({ name: 'x-api-key', description: 'Secret access key' })
  @ApiBody({ type: RosKotRegistrationDto })
  async registerCat(
    @Body() data: RosKotRegistrationDto,
    @Headers('x-api-key') apiKey: string,
  ) {
    const VALID_KEY = 'super-secret-token-777';

    this.logger.log(`Получен запрос на регистрацию кошки: ${data.name}`);
    
    if (!data || Object.keys(data).length === 0) {
      throw new HttpException('Body is empty', HttpStatus.BAD_REQUEST);
    }
    
    if (!apiKey || apiKey !== VALID_KEY) {
      this.logger.error('Попытка доступа с неверным API ключом');
      throw new HttpException('Unauthorized: Invalid API Key', HttpStatus.UNAUTHORIZED);
    } 
    //если имя слишком коротко
    if (!data.name || data.name.length < 2) {
      throw new HttpException('Bad Request: Cat name is too short', HttpStatus.BAD_REQUEST);
    }

    // если кошку зовут "SystemError"
    if (data.name === 'SystemError') {
      this.logger.warn('Имитация падения внешней системы');
      throw new HttpException('Internal Server Error in Government System', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    //если кошку зовут "Slowy"
    if (data.name === 'Slowy') {
      this.logger.warn('Имитация долгого ответа (10 секунд)');
      await new Promise(resolve => setTimeout(resolve, 10000));
    }

    //генерация государственного номера
    const randomId = Math.random().toString(36).substring(2, 7).toUpperCase();
    const chipId = `RU-STATE-${randomId}`;

    return {
      chipId: chipId,
      registrationDate: new Date().toISOString(),
      status: 'SUCCESS',
      metadata: {
        agency: 'RosKotMonitoring',
        region: 'Perm-region'
      }
    };
  }
}