import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import type { SessionData } from '@ecom/auth/session.service'
import { ApiAuth } from '@ecom/nestjs-core/openapi/decorators/api-auth.decorator'
import { ApiErrorResponses } from '@ecom/nestjs-core/openapi/decorators/api-error-responses.decorator'
import { ApiOkResponseData } from '@ecom/nestjs-core/openapi/decorators/api-response.decorator'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { AuthGuard } from '../auth/guards/auth.guard'
import { AddressesService } from './addresses.service'
import type { CreateAddressDto, UpdateAddressDto } from './dto/address.dto'
import { AddressDto } from './dto/address.dto'

@ApiTags('Storefront/Addresses')
@ApiAuth()
@ApiErrorResponses()
@Controller('addresses')
@UseGuards(AuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  @ApiOperation({ summary: 'List saved delivery addresses' })
  @ApiOkResponseData(AddressDto)
  async listAddresses(@CurrentUser() user: SessionData) {
    return this.addressesService.listAddresses(user)
  }

  @Post()
  @ApiOperation({ summary: 'Create a new delivery address' })
  @ApiOkResponseData(AddressDto)
  async createAddress(@CurrentUser() user: SessionData, @Body() dto: CreateAddressDto) {
    return this.addressesService.createAddress(user, dto)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a delivery address' })
  @ApiOkResponseData(AddressDto)
  async updateAddress(
    @CurrentUser() user: SessionData,
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.addressesService.updateAddress(user, id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a delivery address' })
  async deleteAddress(@CurrentUser() user: SessionData, @Param('id') id: string) {
    return this.addressesService.deleteAddress(user, id)
  }
}
