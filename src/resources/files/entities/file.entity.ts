import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";
import { FileScopesEnum } from "../../../enums/FileScopes.enum";
import { FileSourcesEnum } from "../../../enums/FileSources.enum";

@Entity('files')
class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public uri: string

  @Column({
    nullable: true
  })
  public name: string;

  @Column()
  public scope: FileScopesEnum;

  @Column()
  public source: FileSourcesEnum;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE'
  })
  @JoinColumn()
  public owner: UserEntity;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}

export { FileEntity }
