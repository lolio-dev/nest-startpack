import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ObjmcEntity } from "../../objmc/entities/objmc.entity";
import { UserEntity } from "../../users/entities/user.entity";

@Entity("models")
export class ModelEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @OneToOne(() => ObjmcEntity)
  @JoinColumn()
  objmc: ObjmcEntity;

  @Column()
  name: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  owner: UserEntity;
}
