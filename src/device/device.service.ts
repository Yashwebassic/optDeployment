import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Brackets, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { DeviceDto } from './device.dto';
// import { DeviceDTo } from './device.dto';

import { Device } from './device.entity';

@Injectable()
export class DeviceService {
    constructor(
        @InjectRepository(Device) private deviceRepository: Repository<Device>,
    ) { }

    public listAll(query:PaginateQuery):Promise<Paginated<Device>>{
        console.log('hits')
        console.log(query)
        return paginate(query,this.deviceRepository,{
          sortableColumns: ['id', 'serialNo', 'address', 'location','customerName', 'status','createdAt','updatedAt'],
            defaultSortBy:[['serialNo','ASC']],
            searchableColumns:['serialNo','address','location','status','customerName','createdAt','updatedAt'],
            filterableColumns:{
              address:[
                    FilterOperator.EQ
                ],
                location:[
                  FilterOperator.EQ          
                  ],
                  status:[
            FilterOperator.EQ
                  ],
                 
            },
        })
      }

    public findDeviceById(id: any) {
        return this.deviceRepository.findOne({
            where: { id: id }
        });
    }
    public findDeviceBySerialNo(serialNo: number):Promise<Device> {
        return this.deviceRepository.findOne({
            where: { "serialNo": serialNo }
        });
    }

    async create(device: DeviceDto): Promise<Device> {
        return await this.deviceRepository.save(device);
    }

    async update(id, device: DeviceDto): Promise<UpdateResult> {
        return await this.deviceRepository.update(id, device);
    }

    async delete(id): Promise<DeleteResult> {
        return await this.delete(id);
    }
    async findByQueryDevice(paramquery:any):Promise<any>{
        //console.log(paramquery.status)  
         const query = this.deviceRepository.createQueryBuilder('devices');
query.select(['devices.id', 'devices.serialNo', 'devices.address','devices.location', 'devices.customerName','devices.status'])
         if (paramquery.status) {
           query.andWhere('devices.status = :status', { status: `${paramquery.status}` });
         }   
         if (paramquery.search) {
           query.andWhere(new Brackets(qb => {     
              
               qb.where("devices.serialNo LIKE :serialNo", { serialNo: `%${paramquery.search}%`})
               .orWhere("devices.customerName LIKE :customerName", { customerName: `%${paramquery.search}%`})               
               .orWhere("devices.address LIKE :address", { address: `%${paramquery.search}%`})
               .orWhere("devices.createdAt LIKE :createdAt", { createdAt: `%${paramquery.search}%`})
         })) 
         }
           const usersData = await query.getMany();
           
         // console.log(usersData)
         return  usersData ;
       }
     }
     