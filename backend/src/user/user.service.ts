import { Injectable } from '@nestjs/common';
import { AuthDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async createIntraUser(profile: any) {
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: profile.emails[0].value,
                    userName: profile.username,
                    fullName: profile.displayName,
                    hash: '',
                    photo: profile._json.image.link,
                }
            });
            return user;
        } catch (error) {
            console.error('Error creating user: ', error);
        }
    }

    async createLocalUser(dto: AuthDto) {
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    userName: dto.userName,
                    fullName: dto.fullName,
                    hash: dto.password,
                    photo: '',
                }
            });
            return user;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(id: number, newData: { email: string, userName: string, fullName: string }) {
        // check if credentials are valid and doesnt exist
        try {
            const user = await this.prisma.user.update({
                where: {
                    id: id,
                },
                data: newData,
            });
        } catch (error) {
            console.error('Error updating user: ', error);
        }
    }

    async findUserById(userId: number) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: userId,
                }
            });
            return user;
        } catch (error) {
            console.error('Error finding user: ', error);
            return null;
        }
    }

    async findUserByEmail(email: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email: email,
                }
            });
            return user;
        } catch (error) {
            console.error('Error finding user: ', error);
        }
    }

    async deleteUser(id: number) {
        try {
            const user = await this.prisma.user.delete({
                where: {
                    id: id,
                }
            });
            console.log('User deleted');
        } catch (error) {
            console.error('Error deleting user: ', error);
        }
    }
}
