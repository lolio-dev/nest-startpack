import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FileEntity } from "../../files/entities/file.entity";
import { AuthProviders } from "../../../enums/AuthProviders.enum";

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true
  })
  password?: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  username: string;

  @Column()
  authProvider: AuthProviders;

  @OneToOne(() => FileEntity, { nullable: true })
  @JoinColumn()
  avatar?: FileEntity;
}
