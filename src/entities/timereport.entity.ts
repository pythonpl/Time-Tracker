import { BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./project.entity";
import { User } from "./user.entity";

@Entity('time-reports')
export class TimeReport {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column({ nullable: false })
    timeStart: Date;

    @Column({ nullable: true })
    timeEnd: Date | null;

    @Column({ default: 0 })
    duration: number;

    @ManyToOne(() => Project)
    project: Project;

    @ManyToOne(() => User)
    user: User;

    @BeforeInsert()
    setTimeStart() {
        this.timeStart = new Date();
    }

}