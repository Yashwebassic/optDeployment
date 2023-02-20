import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';
import { DeviceDto } from './device.dto';
import { Device } from './device.entity';
import { DeviceService } from './device.service';

@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get() 
  @UseGuards(JwtAuthGuard)
  public listAll(@Paginate() query:PaginateQuery): Promise<Paginated<Device>>{
    return this.deviceService.listAll(query);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  public findtById(@Param('id') deviceId: number) {
    return this.deviceService.findDeviceById(deviceId);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(@Body() deviceData: DeviceDto): Promise<any> {
    return this.deviceService.create(deviceData);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id, @Body() deviceData: DeviceDto): Promise<any> {
    return this.deviceService.update(id, deviceData);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id): Promise<any> {
    return this.delete(id);
  }
}
