import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { chownSync } from 'fs';
import { FilterOperator, paginate, Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Brackets, Repository } from 'typeorm';
import { OtpEventDto } from './otp-event-log.dto';
import { OptEvent } from './otp-event-log.entity';

@Injectable()
export class OptEventService{
  constructor(     
    @InjectRepository(OptEvent) private optEvent: Repository<OptEvent>,     
  ){} 
  async create(requestObj:any): Promise<OtpEventDto> {
    try {
      return await this.optEvent.save(requestObj);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

   public findAll(query:PaginateQuery):Promise<Paginated<OptEvent>>{  
    console.log(query) 
       return paginate(query,this.optEvent,{
    sortableColumns: ['id','name','mobile','email','deviceSerialNo','rqstForResponse','otpStatus','otpResponse','createdAt' ],
    defaultSortBy:[['createdAt','DESC']],
    searchableColumns:['createdAt','name','mobile','email','deviceSerialNo','rqstForResponse','otpStatus','otpResponse','createdAt' ],
    filterableColumns:{
   name:[
        FilterOperator.EQ
      ],
       otpResponse:[
        FilterOperator.EQ
      ],
      email:[
       FilterOperator.EQ
     ],
     otpStatus:[
      FilterOperator.EQ
    ],
    mobile:[
     FilterOperator.EQ
   ],
   createdAt: [FilterOperator.BTW],
 
       
    },
   })
  }

  findOne(id: number) {
    return `This action returns a #${id} optEventLog`;
  }

  update(id: number, updateOptEvent: OtpEventDto) {
    return `This action updates a #${id} optEventLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} optEventLog`;
  }


async findByQueryEvent(paramquery:any):Promise<any>{
  //console.log(paramquery.status)  
   const query = this.optEvent.createQueryBuilder('optEvents');
query.select(['optEvents.id', 'optEvents.name', 'optEvents.email','optEvents.deviceSerialNo', 'optEvents.rqstForResponse','optEvents.otpStatus','optEvents.otpResponse','optEvents.mobile'])
   if (paramquery.status) {
     query.andWhere('optEvents.status = :status', { status: `${paramquery.status}` });
   }   
   if (paramquery.search) {
     query.andWhere(new Brackets(qb => {
       qb.where("optEvents.name LIKE :name", { name: `%${paramquery.search}%`})
         .orWhere("optEvents.email LIKE :email", { email: `%${paramquery.search}%`})
         .orWhere("optEvents.mobile LIKE :mobile", { mobile: `%${paramquery.search}%`})
         .orWhere("optEvents.createdAt LIKE :createdAt", { createdAt: `%${paramquery.search}%`})
   })) 
   }
     const data = await query.getMany();
     console.log(data)
   return data;
 }
}

