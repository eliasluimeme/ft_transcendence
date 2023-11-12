import { ForbiddenException, Injectable } from '@nestjs/common';
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
                    photo: profile._json.image.link,
                }
            });
            if (user)
                return user;
        } catch (error) {
            console.error('Error creating user: ', error);
        }
    }

    // async createLocalUser(dto: AuthDto) {
    //     try {
    //         const user = await this.prisma.user.create({
    //             data: {
    //                 email: dto.email,
    //                 userName: dto.userName,
    //                 fullName: dto.fullName,
    //                 hash: dto.password,
    //                 photo: '',
    //             }
    //         });
    //         delete user.hash;
    //         return user;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    async checkExistingData( id: number, data: { fullName: string, userName: string, country: string, number: string } ) {
        const existingUserName = await this.prisma.user.findUnique({
            where: {
                userName: data.userName,
            },
        });

        if (existingUserName && existingUserName.id !== id)
            throw new ForbiddenException('User name already in use');

        const existingFullName = await this.prisma.user.findUnique({
            where: {
                fullName: data.fullName,
            },
        });

        if (existingFullName && existingFullName.id !== id)
            throw new ForbiddenException('Full name already in use');

        const existingNumber = await this.prisma.user.findUnique({
            where: {
                number: data.number,
            },
        });

        if (existingNumber && existingNumber.id !== id)
            throw new ForbiddenException('Number already in use');
    }

    async updateProfile(id: number, newData: { fullName: string, userName: string, country: string, number: string } ) {
        try {
            // await this.checkExistingData(id, newData);

            const user = await this.prisma.user.update({
                where: {
                    id: id,
                },
                data: newData,
            });

            return user;
        } catch (error) {
            console.error('Error updating user: ', error);
            throw error;
        }
    }

    async updateUser(id: number, newData: any ) {
        try {
            const user = await this.prisma.user.update({
                where: {
                    id: id,
                },
                data: newData,
            });
            return user;
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
            delete user.hash;
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
            delete user.hash;
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