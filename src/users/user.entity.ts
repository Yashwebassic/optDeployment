import { IsEmail, IsNotEmpty, IsNumberString, MaxLength, MinLength } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('user')  
export class User {

  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsNotEmpty()
  username: string;

  @Column()
  @IsNotEmpty()
  address: string;

  @Column({ type: "varchar", length: 100, name: "email", unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column({ default: null })
  password: string;

  @Column({ unique: true })
  @IsNotEmpty()
  // @MinLength(10, { message: 'please enter 10 digits mobile no' })
  // @MaxLength(10, { message: 'please enter 10 digits mobile no' })
  @IsNumberString()
  mobile: string;

  @Column({ default: null})
  alt_Mobile: string;

  @IsNotEmpty()
  @Column({ default: 'staff' })
  role: string;

  @Column({ default: 'Active' })
  status: string;

  @Column({ default: null })
  token: string;

  @Column({ default: null })
  resetToken: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: Date;


}
