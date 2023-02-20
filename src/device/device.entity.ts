import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "devices" })
export class Device{

    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column({ unique: true })
    serialNo: number;//auto increment //uique 

    @Column()
    address: string;

    @Column()
    location: string;

    @Column()
    customerName: string;//name

    @Column({default:"Active"})
    status: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at" })
    deletedAt: Date;


}

