import {  Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export type UserRole = 'ADMIN' | 'USER';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: true })
    emailConfirmToken: string | null;

    @Column({ nullable: false, default: 'USER' })
    roleType: UserRole;

}