import { TicketsEntity } from '../../tickets/entity/tickets.entity';
import {Entity,Column,PrimaryGeneratedColumn, OneToMany} from 'typeorm'

export enum Roles{
    user = 'user',
    admin = 'admin'
}

export enum Estado{
    activo = 'activo',
    inactivo = 'inactivo'
}

@Entity('usuarios')
export class UsuarioEntity{

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({name:'nombre', type:'varchar'})
    nombre! : string;

    @Column({name:'apellido', type:'varchar'})
    apellido!: string;

    @Column({name:'nombreUsuario', type:'varchar', unique:true})
    nombreUsuario!: string;

    @Column({name:'email', type:'varchar', unique:true})
    email!: string;

    @Column({name:'password', type:'varchar'})
    password!: string;

    @Column({name:'rol', type:'enum', enum: Roles, default: Roles.user})
    rol!: Roles;

    @Column({name:'estado', type:'enum', enum:Estado, default:Estado.activo})
    estado!: Estado;

    @OneToMany(()=>TicketsEntity,(ticket)=>ticket.usuario)
    tickets!: TicketsEntity[];
}