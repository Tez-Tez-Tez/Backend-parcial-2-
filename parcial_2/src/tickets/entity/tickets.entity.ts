import { UsuarioEntity } from '../../usuarios/entity/usuarios.entity';
import {Entity,Column,PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm'

export enum Prioridad {
    alta = 'alta',
    media='media',
    baja='baja'
}

export enum Estado{
    abierto='abierto',
    en_proceso='en_proceso',
    cerrado='cerrado'
}

@Entity('tickets')
export class TicketsEntity{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({name:'asunto', type:'varchar'})
    asunto!: string;

    @Column({name:'descripcion', type:'varchar'})
    descripcion!: string;

    @Column({name:'prioridad', type:'enum', enum:Prioridad})
    prioridad!: Prioridad;

    @Column({name:'estado',type:'enum',enum:Estado, default:Estado.abierto})
    estado!: Estado;

    @ManyToOne(()=>UsuarioEntity,(usuario)=>usuario.tickets)
    @JoinColumn({name:'id_usuario'})
    usuario!: UsuarioEntity;
}