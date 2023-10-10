import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	login42: string; // 42 login

	@Column({ unique: true })
	display_name: string; // name chosen by the user
}