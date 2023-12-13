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

    async getUserRank(userLevel: number): Promise<number> {
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

    async getMatchHistory(userId: number): Promise<any> {
        try {
            const matchHistory = await this.prisma.matchHistory.findMany({
                where: {
                    OR: [
                        { player1Id: userId },
                        { player2Id: userId },
                    ]
                },
            });
            return matchHistory;
        } catch (error) {
            console.log('Error getting match history: ', error);
        }
    }

    async getProfile(user: any) {
        try {
            const userLevel = await this.getUserLevel(user.id);
            const userRank = await this.getUserRank(userLevel);
            const matchs = await this.getMatchHistory(user.id);

            const matchHistory = await Promise.all(matchs.map( async match => {
                if (match.player1Id === user.id) {
                    const { id, userName, photo } = user;
                    match.player1 = { id, userName, photo };
                    match.player2 = await this.prisma.user.findUnique({ 
                        where: { id: match.player2Id },
                        select: {
                            id: true,
                            userName: true,
                            photo: true,
                        }
                    })
                } else {
                    const { id, userName, photo } = user;
                    match.player2 = { id, userName, photo };
                    match.player1 = await this.prisma.user.findUnique({ 
                        where: { id: match.player1Id },
                        select: {
                            id: true,
                            userName: true,
                            photo: true,
                        }
                    })
                }
                // create dm
                const { player1, player2, score1, score2, mode } = match;
                return { player1, player2, score1, score2, mode };
            }))
            console.log('matchHistory: ', matchHistory)
            const { photo, userName, fullName, achievements } = user;
            return { userName, fullName, photo, rank: userRank, level: userLevel, achievements, matchHistory };
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
            const rank = await this.getUserRank(user.level.level);
            return { user: user.userName, photo: user.photo, level: user.level.level, rank: rank };
          }))
    
          return topPlayers;
        } catch (error) {
          console.log("Failed to get ladderboard: ", error);
        }
    }

    async getRank(userlevel: number): Promise<number> {
        try {
            return await this.getUserRank(userlevel);
        } catch (error) {
            console.log('Failed to get rank: ', error);
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
                },
                include: {
                    level: true,
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
        const allowedPattern = /^[a-zA-Z0-9  -]+$/;
        return allowedPattern.test(query);
    }

    async checkUser( userId: number, query: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    userName: query,
                },
                select: {
                    blocker: {
                        where: {
                            blockedId: userId,
                        }
                    },
                    blocked: {
                        where: {
                            blockerId: userId,
                        }
                    },
                }
            });
            console.log('user:', user);
            if (!user) throw new NotFoundException('User not found');
            else if (user.blocker.find(block => block.blockedId === userId))
                throw new NotFoundException('User not found');
            else return { block: false };
        } catch(error) {
            if (error instanceof NotFoundException)
                throw error;
            console.log(error);
        }
    }

    async searchUsers( user: any, query: string ) {
        if (this.isValidQuery(query)) {
            try {
                const foundUser = await this.prisma.user.findUnique({
                    where: {
                        userName: query,
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
                        player1: true,
                        player2: true,
                        blocker: {
                            where: {
                                blockedId: user.id,
                            }
                        },
                        blocked: {
                            where: {
                                blockerId: user.id,
                            }
                        },
                        sentRequests: {
                            where: {
                                receiverId: user.id,
                            }
                        },
                        receivedRequests: {
                            where: {
                                senderId: user.id,
                            }
                        }
                    }
                })
                console.log('user:', user);

                if (foundUser) {
                    const rank = await this.getUserRank(user.level.level);
                    const matchs = await this.getMatchHistory(user.id);

                    const matchHistory = matchs.map( match => {
                        if (match.player1Id === user.id) {
                            const { id, userName, photo } = user;
                            match.player1 = { id, userName, photo };
                            match.player2 = { id: foundUser.id, userName: foundUser.userName, photo: foundUser.photo};
                            match.score = match.score1.toString() + " - " + match.score2.toString();
                        } else {
                            const { id, userName, photo } = user;
                            match.player2 = { id, userName, photo };
                            match.player1 = { id: foundUser.id, userName: foundUser.userName, photo: foundUser.photo};
                            match.score = match.score1.toString() + " - " + match.score2.toString();
                        }
                        const { player1, player2, score, mode } = match;
                        return { player1, player2, score, mode };
                    })

                    if (foundUser.id === user.id)
                        return { id: foundUser.id, userName: foundUser.userName, fullName: foundUser.fullName, photo: foundUser.photo, rank: rank, achievements: foundUser.achievements, matchs: matchHistory, self: true };
                    
                    else if (foundUser.blocker.find(block => block.blockedId === foundUser.id))
                        return { id: foundUser.id, userName: foundUser.userName, fullName: foundUser.fullName, photo: foundUser.photo, rank: rank, achievements: foundUser.achievements, matchs: matchHistory, block: true };
                    else if (foundUser.blocked.find(block => block.blockerId === foundUser.id))
                        return { id: foundUser.id, userName: foundUser.userName, fullName: foundUser.fullName, photo: foundUser.photo, rank: rank, achievements: foundUser.achievements, matchs: matchHistory, block: true };

                    else if (foundUser.sentRequests && foundUser.sentRequests.find(request => request.receiverId === foundUser.id))
                        return { id: foundUser.id, userName: foundUser.userName, fullName: foundUser.fullName, photo: foundUser.photo, rank: rank, achievements: foundUser.achievements, matchs: matchHistory, friend: foundUser.sentRequests[0].status };
                    else if (foundUser.receivedRequests && foundUser.receivedRequests.find(request => request.senderId === foundUser.id))
                        return { id: foundUser.id, userName: foundUser.userName, fullName: foundUser.fullName, photo: foundUser.photo, rank: rank, achievements: foundUser.achievements, matchs: matchHistory, friend: foundUser.receivedRequests[0].status };
                    
                    else
                        return { id: foundUser.id, userName: foundUser.userName, fullName: foundUser.fullName, photo: foundUser.photo, rank: rank, achievements: foundUser.achievements, matchs: matchHistory, friend: "NONE" };
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
            // create chat room
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

    async blockUser( userId: number, blockedId: number) {
        if (userId === blockedId)
            throw new BadRequestException('You cannot block yourself');
        try {
            const user = await this.prisma.blocks.findMany({
                where: {
                    OR: [{ 
                            blockerId: userId, 
                            blockedId: blockedId,
                        }, { 
                            blockerId: blockedId, 
                            blockedId: userId, 
                        },
                    ]
                }
            })

            if (user) {
                const newBlock = await this.prisma.blocks.create({
                    data: {
                        blocker: { connect: { id: userId } },
                        blocked: { connect: { id: blockedId } },
                    }
                })
                return newBlock;
            } else throw new BadRequestException('User already blocked');
        } catch(error) {
            console.log('error blocking user: ', error);
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