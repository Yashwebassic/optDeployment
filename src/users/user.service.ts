import { BadRequestException, Get, HttpException, HttpStatus, Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { EmailService } from 'src/email/email.service';
import { SmsService } from 'src/sms/sms.service';
import { Brackets, Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly emailService: EmailService,
    private readonly smsService: SmsService
  ) { }

  async findOne(userName: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where:[ {email: userName},
        {username:userName}
      ]
    });
  }

  public findUserByMobileNo(mobileNo: string):Promise<User> {
    return this.userRepository.findOne({
        where: [
          { "mobile": mobileNo },
          { "alt_Mobile": mobileNo }
        ]
    });
}

  public listAll(query: PaginateQuery): Promise<Paginated<User>> {    
    // console.log('hits')
    // console.log(query)
    return paginate(query, this.userRepository, {
      sortableColumns: ['id', 'name', 'email', 'mobile', 'alt_Mobile', 'role', 'status', 'address','username','createdAt','updatedAt'],
      defaultSortBy: [ ['name', 'ASC']],
      searchableColumns: ['name', 'email', 'address', 'status', 'mobile', 'alt_Mobile', 'role'],
      filterableColumns: {
        name: [
          FilterOperator.EQ
        ],
        status: [
          FilterOperator.EQ
        ],
        role: [
          FilterOperator.EQ
        ],
      },
    })
  }


  async save(requestObj: any) {
    try {
      return await this.userRepository.save(requestObj);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async create(requestObj: User): Promise<User> {
    try {
      return await this.userRepository.save(requestObj);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  public findUserById(id: any) {
    return this.userRepository.findOne({
      where: { id: id }
    });
  }

  public findUserByEmail(email: any) {
    return this.userRepository.findOne({
      where: { email: email }
    });
  }
  async findUserByToken(token: any) {
    return await this.userRepository.findOne({
      where: { resetToken: token.resetToken }
    });
  }
  async update(id, user: any): Promise<any> {
    return await this.userRepository.update(id, user);
  }

  async delete(id): Promise<any> {
    return await this.userRepository.delete(id);
  }


  async forgotPassword(postemail): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email: postemail.email } })
    if (!user) {
      throw new HttpException('user not found', HttpStatus.FORBIDDEN);
    }
    if (user) {
      let mailDetails = {
        from: 'health.tech108@gmail.com',
        to: user.email,
        subject: "Forgot Password link to reset your password",
        text: 'http://localhost:3000/resetpassword'
      };
      let data = await this.emailService.sendMail(mailDetails);
      return { "status": HttpStatus.ACCEPTED };
    }
  }

  async changePassword(email: any, password: any) {
    const salth = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salth)
    return await this.userRepository.createQueryBuilder()
      .update(User)
      .set({ password: await bcrypt.hash(password.value, salth) })
      .where("email = :postemail.email", { email: email })
      .execute();
  }

  async smsSend(emailId: any): Promise<any> {
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'username', 'mobile'],
      where: { email: emailId.email }
    })
    return user;
  }


  // @Get()
  // async findByQuery(
  //   @Query('name') name: string,
  //   @Query('category') category: string,
  //   @Query('sort') sort: string,


async findByQuery(paramquery:any):Promise<any>{
   //console.log(paramquery.status)  
    const query = this.userRepository.createQueryBuilder('user');
query.select(['user.id', 'user.name', 'user.email','user.status', 'user.role','user.address','user.mobile','user.alt_Mobile'])

    if (paramquery.status) {
      query.andWhere('user.status = :status', { status: `${paramquery.status}` });
    }   
    if (paramquery.search) {
      query.andWhere(new Brackets(qb => {
        qb.where("user.name LIKE :name", { name: `%${paramquery.search}%`})
          .orWhere("user.email LIKE :email", { email: `%${paramquery.search}%`})
          .orWhere("user.mobile LIKE :mobile", { mobile: `%${paramquery.search}%`})
          .orWhere("user.role LIKE :role", { role: `%${paramquery.search}%`})
          .orWhere("user.address LIKE :address", { address: `%${paramquery.search}%`})
          .orWhere("user.createdAt LIKE :createdAt", { createdAt: `%${paramquery.search}%`})
    })) 
    }
      const usersData = await query.getMany();
      
    // console.log(usersData)
    return  usersData ;
  }
}











