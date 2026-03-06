import { Controller, Post, Body, Headers, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiBody, ApiResponse } from '@nestjs/swagger';
import { RosKotRegistrationDto } from './roskot-registration.dto';

@ApiTags('Perm-External-Agency (РосКотМониторинг)')
@Controller('external-api/roskot')
export class RosKotPermController {
  private readonly logger = new Logger('RosKotPerm');

  @Post('register-chip')
  @ApiOperation({ summary: 'Simulating an external chip registration API' })
  @ApiHeader({ name: 'x-api-key', description: 'Secret access key' })
  @ApiBody({ type: RosKotRegistrationDto })
  @ApiResponse({ status: 201, description: 'Success: Chip registered.' })
  @ApiResponse({ status: 400, description: 'Validation Error: Name too short.' })
  @ApiResponse({ status: 401, description: 'Auth Error: Invalid API Key.' })
  @ApiResponse({ status: 429, description: 'Quota Error: Daily limit reached.' })
  @ApiResponse({ status: 500, description: 'Server Error: System crash (SystemError case).' })
  async registerCat(
    @Body() data: RosKotRegistrationDto,
    @Headers('x-api-key') apiKey: string,
  ) {
    const VALID_KEY = 'super-secret-token-777';

    this.logger.log(`Получен запрос на регистрацию кошки: ${data.name}`);
    
    if (!apiKey || apiKey !== VALID_KEY) {
      throw new HttpException(
        { message: 'Unauthorized: Invalid API Key', error: 'ExternalAuthError' }, 
        HttpStatus.UNAUTHORIZED
      );
    } 
    if (!data.name || data.name.length < 2) {
      throw new HttpException(
        { message: 'Bad Request: Cat name is too short', error: 'ValidationError' }, 
        HttpStatus.BAD_REQUEST
      );
    }
    if (data.name === 'SystemError') {
      throw new HttpException(
        { message: 'Internal Server Error in Government System', error: 'RegistryCrash' }, 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    if (data.name === 'Slowy') {
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
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