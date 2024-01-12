import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn, JoinTable, ManyToMany, ManyToOne,
  OneToMany, OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { FileEntity } from "../../files/entities/file.entity";
import { UserEntity } from "../../users/entities/user.entity";
import { ObjmcConfigState } from "../../../types/ObjmcConfigState";

@Entity('objmc')
class ObjmcEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    type: 'json'
  })
  public config: ObjmcConfigState;

  @ManyToMany(() => FileEntity)
  @JoinTable()
  public textureFiles: FileEntity[];

  @ManyToMany(() => FileEntity)
  @JoinTable()
  public modelFiles: FileEntity[];

  @ManyToOne(() => UserEntity, null)
  @JoinColumn()
  public owner: UserEntity;

  @OneToOne(() => FileEntity)
  @JoinColumn({ name: 'resultId' })
  public result: FileEntity;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}

export { ObjmcEntity }
