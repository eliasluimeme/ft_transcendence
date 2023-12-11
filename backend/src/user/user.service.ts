import { BadGatewayException, BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import { Observable, of } from 'rxjs';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async createIntraUser(profile: any) {
        try {
            const user = await this.prisma.user.create({
                data: {
                    intraId: profile.id,
                    email: profile.emails[0].value,
                    userName: profile.username,
                    fullName: profile.displayName,
                    photo: profile._json.image.link,
                    level: {
                        create: {
                            level: 0,
                            wins: [0, 0],
                            losses: [0, 0],
                        }
                    },
                }
            });
            
            return user;
        } catch (error) {
            console.error('Error creating user: ', error);
        }
    }

    async getUserRank(userLevel: any): Promise<number> {
        try {
            const higherLevels = await this.prisma.ladderLevel.count({
                where: { level: { gt: userLevel } },
            })

            return higherLevels + 1;
        } catch (error) {
            console.error('Error getting user rank: ', error);
        }
    }

    async getUserLevel(userId: number): Promise<number | undefined> {
        try {
            const userLevel = await this.prisma.ladderLevel.findUnique({
                where: {
                    userId: userId,
                }
            });

            if (userLevel)
                return userLevel.level;
        } catch (error) {
            console.error('Error getting user level: ', error);
        }
    }

    async getProfile(user: any) {
        // const ladderLevel = await this.prisma.ladderLevel.update({
        //     where: {
        //         userId: user.id,
        //     },
        //     data: {
        //         userId: user.id,
        //         level: 3.3,
        //     }
        // });
        try {
            const userLevel = await this.getUserLevel(user.id);
            if (!userLevel) throw new NotFoundException('User not found');

            const userRank = await this.getUserRank(userLevel);
            if (!userRank) throw new NotFoundException('User not found');

            const { photo, userName, fullName, achievements } = user;
            return { userName, fullName, photo, rank: userRank, level: userLevel, achievements };
        } catch(error) {
            console.log('error getting profile: ', error)
        }
    }

    async getLadderboard(count: number): Promise<any> {
        try {
          const players = await this.prisma.user.findMany({
            take: count,
            orderBy: { level: { level: 'desc' } },
            include: { level: true, },
          });

          const topPlayers = await Promise.all(players.map( async user => {
            const rank = await this.getUserRank(user.level);
            return { user: user.userName, photo: user.photo, level: user.level.level, rank: rank };
          }))
    
          return topPlayers;
        } catch (error) {
          console.log("Failed to get ladderboard: ", error);
        }
    }

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
        await this.checkExistingData(id, newData);
        try {
            console.log('Updated profile')
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

    async findUserByIntraId(userId: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    intraId: userId,
                }
            });

            delete user.hash;
            return user;
        } catch (error) {
            // check prisma error status code
            console.error('Error finding user: ', error);
        }
    }

    async findUserById(userId: number) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: userId,
                },
            });

            delete user.hash;
            return user;
        } catch (error) {
            // check prisma error status code
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

    isValidQuery(query: string): boolean {
        const allowedPattern = /^[a-zA-Z0-9 ]+$/;
        return allowedPattern.test(query);
    }

    async searchUsers( userId: number, query: string ) {
        if (this.isValidQuery(query)) {
            try {
                const users = await this.prisma.user.findMany({
                    where: {
                        OR: [{
                            userName: {
                                startsWith: query.toLowerCase(),
                        }}, {
                            fullName: {
                                startsWith: `${query.charAt(0).toUpperCase()}${query.slice(1).toLowerCase()}`,
                            }
                        }]
                    },
                    select: {
                        id: true,
                        userName: true,
                        fullName: true,
                        photo: true,
                        level: {
                            select: {
                                level: true,
                            }
                        },
                        achievements: true,
                        blocking: {
                            where: {
                                blockedId: userId,
                            }
                        },
                        blocked: {
                            where: {
                                blockingId: userId,
                            }
                        },
                        sentRequests: {
                            where: {
                                receiverId: userId,
                            }
                        },
                        receivedRequests: {
                            where: {
                                senderId: userId,
                            }
                        }
                    }
                })

                if (users[0]) {
                    return Promise.all(users.map(async user => { // Check what to do about blocks in front to return appropiate data
                        const rank = await this.getUserRank(user.level);
    
                        if (user.id === userId)
                            return { id: user.id, userName: user.userName, fullName: user.fullName, photo: user.photo, level: user.level.level, rank: rank, self: true };
                        else if (user.blocking.find(block => block.blockedId === userId))
                            return { id: user.id, userName: user.userName, fullName: user.fullName, photo: user.photo, level: user.level.level, rank: rank, blocked: true };
                        else if (user.blocked.find(block => block.blockingId === userId))
                            return { id: user.id, userName: user.userName, fullName: user.fullName, photo: user.photo, level: user.level.level, rank: rank, blocking: true };
    
                        else if (user.sentRequests && user.sentRequests.find(request => request.receiverId === userId)) {
                            switch (user.sentRequests[0].status) {
                                case 'PENDING':
                                    return { id: user.id, userName: user.userName, fullName: user.fullName, photo: user.photo, level: user.level.level, rank: rank, friend: user.sentRequests[0].status };
                                case 'ACCEPTED':
                                    return { id: user.id, userName: user.userName, fullName: user.fullName, photo: user.photo, level: user.level.level, rank: rank, friend: user.sentRequests[0].status };
                                case 'DECLINED':
                                    return { id: user.id, userName: user.userName, fullName: user.fullName, photo: user.photo, level: user.level.level, rank: rank, friend: user.sentRequests[0].status };
                            }
                        }
                        
                        else if (user.receivedRequests && user.receivedRequests.find(request => request.senderId === userId)) {
                            switch (user.receivedRequests[0].status) {
                                case 'PENDING':
                                    return { id: user.id, userName: user.userName, fullName: user.fullName, photo: user.photo, level: user.level.level, rank: rank, friend: user.receivedRequests[0].status };
                                case 'ACCEPTED':
                                    return { id: user.id, userName: user.userName, fullName: user.fullName, photo: user.photo, level: user.level.level, rank: rank, friend: user.receivedRequests[0].status };
                                case 'DECLINED':
                                    return { id: user.id, userName: user.userName, fullName: user.fullName, photo: user.photo, level: user.level.level, rank: rank, friend: user.receivedRequests[0].status };
                            }
                        }
                        else
                            return { id: user.id, userName: user.userName, fullName: user.fullName, photo: user.photo, level: user.level.level, rank: rank, friend: "false" };
                    }))
                }
                else throw new NotFoundException('User not found');
            } catch(error) {
                if (error instanceof NotFoundException)
                    throw error;
                console.log('error finding users: ', error)
            }
        } else throw new BadRequestException('Invalid input');
    }
    
    async addFriend( senderId: number, receiverId: number ) {
        if (senderId === receiverId)
            throw new BadRequestException('You cannot send a friend request to yourself');
        try {
            // if front doesnt store receiverId search for userName to get id
            // check if friendship already exists in both sides
            const frindShipExists = await this.prisma.friends.findMany({
                where: {
                    OR: [{ 
                            senderId: senderId, 
                            receiverId: receiverId,
                        }, { 
                            senderId: receiverId, 
                            receiverId: senderId, 
                        },
                    ]
                }
            })

            if (frindShipExists) throw new BadRequestException('Friendship already exists');

            const friendShip = await this.prisma.friends.create({
                data: {
                    sender: { connect: { id: senderId } },
                    receiver: { connect: { id: receiverId } },
                    status: 'PENDING',
                }
            })
            // send notification to receiver
            return friendShip;
        } catch(error) {
            console.log('error adding friend: ', error)
            // throw error;
        }
    }
                
    async acceptFriend( receiverId: number, senderId: number) {
        if (senderId === receiverId)
            throw new BadRequestException('You cannot accept a friend request you sent to yourself');
        try {
            const sender = await this.prisma.user.findUnique({
                where: {
                    id: senderId,
                },
                include: {
                    sentRequests: {
                        where: {
                            senderId: senderId,
                            receiverId: receiverId,
                        },
                    }
                }
            })

            // const friendShip = await this.prisma.friends.findFirst({
            //     where: {
            //         AND: [
            //             { senderId: senderId, },
            //             { receiverId: receiverId, }
            //         ]
            //     }
            // })

            if (sender) {
                const newFriendShip = await this.prisma.friends.update({
                    where: {
                        id: sender.sentRequests[0].id,
                    },
                    data: {
                        status: 'ACCEPTED',
                    }
                })
                // send notification to sender
                // create chat room
                console.log('new friendShip:', newFriendShip)
                sender.sentRequests[0] = newFriendShip;
                console.log(sender);
                return sender;
            } else throw new BadRequestException('Bad request no friendShip found');
        } catch(error) {
            console.log('error accepting friend: ', error);
            // throw error;
        }
    }
                        
    async rejectFriend(receiverId: number, senderId: number): Promise<any> {
        if (senderId === receiverId)
            throw new BadRequestException('You cannot reject a friend request you sent to yourself');
        try {
            const friendShip = await this.prisma.friends.findFirst({
                where: {
                    AND: [
                        { senderId: senderId, },
                        { receiverId: receiverId, }
                    ]
                }
            })

            if (friendShip) {
                const newFriendShip = await this.prisma.friends.update({
                    where: {
                        id: friendShip.id,
                    },
                    data: {
                        status: 'DECLINED',
                    }
                })
                return newFriendShip;
            } else throw new BadRequestException('Bad request no friendShip found');
        } catch(error) {
            console.log('error accepting friend: ', error);
            throw error;
        }
    }

    // unfriend
    // sent friend requests to yourself
    // if blocked nnot found
    // if already friends unfried
    // when request accepted 

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
}