
import { IsEmail, IsNotEmpty, IsNumberString, MaxLength, MinLength } from "class-validator";

import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('optEvents')
export class OptEvent{
  @PrimaryGeneratedColumn("uuid")
  id: number;

   @Column()
  @IsNotEmpty()
  name: string;

   @Column()
  @IsNotEmpty()
  mobile: string;

    @Column()
  @IsNotEmpty()
  email: string;

   @Column()
  @IsNotEmpty()
  deviceSerialNo: number;

  @Column()
  @IsNotEmpty()
  rqstForResponse: string;

    @Column()
  @IsNotEmpty()
  otpStatus: string;

  @Column()
  @IsNotEmpty()
  otpResponse: string;
  
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: Date;


}
