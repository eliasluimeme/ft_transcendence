import { BadGatewayException, BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import { Observable, of } from 'rxjs';
import { CLIENT_RENEG_LIMIT } from 'tls';
import { settingsDTO } from './dto/settings.dto';
// import { ChatGateway } from 'src/chat/chat.gateway';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService, 
        // private chatGateway: ChatGateway,
        ) {}

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
            },
          },
        },
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
      });

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
        },
      });

      if (userLevel) return userLevel.level;
    } catch (error) {
      console.error('Error getting user level: ', error);
    }
  }

  async getMatchHistory(userId: number): Promise<any> {
    try {
      const matchHistory = await this.prisma.matchHistory.findMany({
        where: {
          OR: [{ player1Id: userId }, { player2Id: userId }],
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

      const matchHistory = await Promise.all(
        matchs.map(async (match) => {
          if (match.player1Id === user.id) {
            const { id, userName, photo } = user;
            match.player1 = { id, userName, photo };
            match.player2 = await this.prisma.user.findUnique({
              where: { id: match.player2Id },
              select: {
                id: true,
                userName: true,
                photo: true,
              },
            });
          } else {
            const { id, userName, photo } = user;
            match.player2 = { id, userName, photo };
            match.player1 = await this.prisma.user.findUnique({
              where: { id: match.player1Id },
              select: {
                id: true,
                userName: true,
                photo: true,
              },
            });
          }
          const { player1, player2, score1, score2, mode } = match;
          return {
            player1,
            player2,
            result: score1.toString() + ' - ' + score2.toString(),
            mode,
          };
        }),
      );
      console.log('matchHistory: ', matchHistory);
      const { photo, userName, fullName, achievements } = user;
      return {
        userName,
        fullName,
        photo,
        rank: userRank,
        level: userLevel,
        achievements,
        match: matchHistory,
      };
    } catch (error) {
      console.log('error getting profile: ', error);
    }
  }

  async getLadderboard(count: number): Promise<any> {
    try {
      const players = await this.prisma.user.findMany({
        take: count,
        orderBy: { level: { level: 'desc' } },
        include: { level: true },
      });

      const topPlayers = await Promise.all(
        players.map(async (user) => {
          const rank = await this.getUserRank(user.level.level);
          return {
            user: user.userName,
            photo: user.photo,
            level: user.level.level,
            rank: rank,
          };
        }),
      );

      return topPlayers;
    } catch (error) {
      console.log('Failed to get ladderboard: ', error);
    }
  }

  async getRank(userlevel: number) {
    try {
      const rank = await this.getUserRank(userlevel);
      return { rank: rank };
    } catch (error) {
      console.log('Failed to get rank: ', error);
    }
  }

    async getSettings( intraId: string ) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    intraId: intraId,
                },
                select: {
                    fullName: true,
                    userName: true,
                    country: true,
                    number: true,
                    photo: true,
                    isTwoFactorAuthEnabled: true
                }
            });
            if (user)
                return user;
            else throw new NotFoundException('User not found');
        } catch (error) {
            console.error('Error getting user settings: ', error);
            if (error instanceof NotFoundException)
                throw error;
        }
    }

  async checkExistingData(
    id: string,
    data: {
      fullName: string;
      userName: string;
      country: string;
      number: string;
    },
  ) {
    const existingUserName = await this.prisma.user.findMany({
      where: {
        userName: data.userName,
      },
    });

        if (existingUserName[0] && existingUserName[0].intraId !== id)
            throw new ForbiddenException('User name already in use');
    
        const existingFullName = await this.prisma.user.findMany({
            where: {
                fullName: data.fullName,
            },
        });

        if (existingFullName[0] && existingFullName[0].intraId !== id)
            throw new ForbiddenException('Full name already in use');

        const existingNumber = await this.prisma.user.findMany({
            where: {
                number: data.number,
            },
        });

        if (existingNumber[0] && existingNumber[0].number && existingNumber[0].intraId !== id)
            throw new ForbiddenException('Number already in use');
    }

    async updateProfile(intraId: string , newData: settingsDTO ) {
        await this.checkExistingData(intraId, newData);
        try {
            const user = await this.prisma.user.update({
                where: {
                    intraId: intraId,
                },
                data: {
                    fullName: newData.fullName,
                    userName: newData.userName,
                    country: newData.country,
                    number: newData.number,
                },
                select: {
                    id: true,
                    fullName: true,
                    userName: true,
                    country: true,
                    number: true,
                    photo: true,
                }
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
            if (user) {
                delete user.hash;
                return user;
            } else return user;
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

  async checkUser(userId: number, query: string) {
    try {
      // check query
      const user = await this.prisma.user.findUnique({
        where: {
          userName: query,
        },
        select: {
          id: true,
          blocker: {
            where: {
              blockedId: userId,
            },
          },
        },
      });

      if (!user) throw new NotFoundException('User not found');
      else if (user.blocker.find((block) => block.blockedId === userId))
        throw new NotFoundException('User not found');
      else if (user.id === userId) return { user: query, self: true };
      else return { user: query };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.log(error);
    }
  }

  async searchUser(user: any, query: string) {
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
              },
            },
            // achievements: true,
            player1: true,
            player2: true,
            // blocker: {
            //     where: {
            //         blockedId: user.id,
            //     }
            // },
            // blocked: {
            //     where: {
            //         blockerId: user.id,
            //     }
            // },
            sentRequests: {
              where: {
                receiverId: user.id,
              },
            },
            receivedRequests: {
              where: {
                senderId: user.id,
              },
            },
          },
        });

        if (foundUser) {
          const rank = await this.getUserRank(user.level.level);

          if (foundUser.id === user.id)
            return {
              id: foundUser.id,
              userName: foundUser.userName,
              fullName: foundUser.fullName,
              photo: foundUser.photo,
              rank: rank,
              self: true,
            };
          // else if (foundUser.blocker.find(block => block.blockedId === foundUser.id))
          //     return { id: foundUser.id, userName: foundUser.userName, fullName: foundUser.fullName, photo: foundUser.photo, rank: rank, block: true };
          // else if (foundUser.blocked.find(block => block.blockerId === foundUser.id))
          //     return { id: foundUser.id, userName: foundUser.userName, fullName: foundUser.fullName, photo: foundUser.photo, rank: rank, block: true };
          else if (
            foundUser.sentRequests &&
            foundUser.sentRequests.find(
              (request) => request.receiverId === user.id,
            )
          )
            return {
              id: foundUser.id,
              userName: foundUser.userName,
              fullName: foundUser.fullName,
              photo: foundUser.photo,
              rank: rank,
              friend: foundUser.sentRequests[0].status,
            };
          else if (
            foundUser.receivedRequests &&
            foundUser.receivedRequests.find(
              (request) => request.senderId === user.id,
            )
          )
            return {
              id: foundUser.id,
              userName: foundUser.userName,
              fullName: foundUser.fullName,
              photo: foundUser.photo,
              rank: rank,
              friend: foundUser.receivedRequests[0].status,
            };
          else
            return {
              id: foundUser.id,
              userName: foundUser.userName,
              fullName: foundUser.fullName,
              photo: foundUser.photo,
              rank: rank,
              friend: 'NONE',
            };
        } else throw new NotFoundException('User not found');
      } catch (error) {
        if (error instanceof NotFoundException) throw error;
        console.log('error finding users: ', error);
      }
    } else throw new BadRequestException('Invalid input');
  }

  async searchUserAchievements(userName: string) {
    try {
      const userAchievements = await this.prisma.user.findUnique({
        where: {
          userName: userName,
        },
        select: {
          achievements: true,
        },
      });
      console.log('userrr', userAchievements);
      return userAchievements;
    } catch (error) {
      console.log('error finding users: ', error);
    }
  }

  async searchUserMatchHistory(me: any, userName: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { userName: userName },
        select: {
          id: true,
          userName: true,
          photo: true,
          player1: true,
          player2: true,
        },
      });

      const matchs = await this.getMatchHistory(user.id);

      const matchHistory = await Promise.all(
        matchs.map(async (match) => {
          if (match.player1Id === user.id) {
            const { id, userName, photo } = user;

            const user2 = await this.prisma.user.findUnique({
              where: { userName: match.player2.userName },
              select: {
                id: true,
                userName: true,
                photo: true,
              },
            });

            match.player1 = { id, userName, photo };
            match.player2 = {
              id: user2.id,
              userName: user2.userName,
              photo: user2.photo,
            };
            match.score =
              match.score1.toString() + ' - ' + match.score2.toString();
          } else {
            const { id, userName, photo } = user;

            const user2 = await this.prisma.user.findUnique({
              where: { userName: match.player1.userName },
              select: {
                id: true,
                userName: true,
                photo: true,
              },
            });

            match.player2 = { id, userName, photo };
            match.player1 = {
              id: user2.id,
              userName: user2.userName,
              photo: user2.photo,
            };
            match.score =
              match.score1.toString() + ' - ' + match.score2.toString();
          }
          const { player1, player2, score, mode } = match;
          return { player1, player2, score, mode };
        }),
      );

      return matchHistory;
    } catch (error) {
      console.log('error searching users: ', error);
    }
  }

  async getFriends(userId: number) {
    try {
      const friendShip = await this.prisma.friends.findMany({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
      });
      const friends = await Promise.all(
        friendShip.map(async (friend) => {
          let user: any;
          if (friend.senderId === userId) {
            user = await this.prisma.user.findUnique({
              where: {
                id: friend.receiverId,
              },
              select: {
                userName: true,
                photo: true,
              },
            });
          } else if (friend.receiverId === userId) {
            user = await this.prisma.user.findUnique({
              where: {
                id: friend.senderId,
              },
              select: {
                userName: true,
                photo: true,
              },
            });
          }
          return { userName: user.userName, photo: user.photo };
        }),
      );
      return friends;
    } catch (error) {
      console.log('error getting friends: ', error);
    }
  }

  async getFriendship(userId: number, friendId: number) {
    if (!friendId)
      throw new BadRequestException('Bad request no friendShip found');

    try {
      // search in friends table
      const friendship = await this.prisma.friends.findFirst({
        where: {
          OR: [
            {
              senderId: userId,
              receiverId: friendId,
            },
            {
              senderId: friendId,
              receiverId: userId,
            },
          ],
        },
      });

      if (!friendship) return { status: 'NONE' };
      else return { status: friendship.status };
    } catch (error) {
      console.log('error getting friendship: ', error);
    }
  }

  async addFriend(senderId: number, receiverId: number) {
    if (senderId === receiverId)
      throw new BadRequestException(
        'You cannot send a friend request to yourself',
      );
    try {
      const friendShipExists = await this.prisma.friends.findMany({
        where: {
          OR: [
            {
              senderId: senderId,
              receiverId: receiverId,
            },
            {
              senderId: receiverId,
              receiverId: senderId,
            },
          ],
        },
      });

      if (friendShipExists[0])
        throw new BadRequestException('Friendship already exists');

      const friendShip = await this.prisma.friends.create({
        data: {
          sender: { connect: { id: senderId } },
          receiver: { connect: { id: receiverId } },
          status: 'ACCEPTED',
        },
        include: {
          receiver: true,
        },
      });
      // check if room already exists
      // create chat room
      const room = await this.prisma.chatroom.create({
        data: {
          name: 'DM',
          ChatroomUsers: {
            createMany: {
              data: [
                { userId: senderId, role: 'USER' },
                { userId: receiverId, role: 'USER' },
              ],
            },
          },
        },
        include: {
          ChatroomUsers: true,
        },
      });
      console.log('room: ', room);

      // send notification to receiver
      return { status: friendShip.status };
    } catch (error) {
      console.log('error adding friend: ', error);
      throw error;
    }
  }

  async acceptFriend(receiverId: number, senderId: number) {
    if (senderId === receiverId)
      throw new BadRequestException(
        'You cannot accept a friend request you sent to yourself',
      );
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
          },
        },
      });

      if (sender) {
        const newFriendShip = await this.prisma.friends.update({
          where: {
            id: sender.sentRequests[0].id,
          },
          data: {
            status: 'ACCEPTED',
          },
        });
        // send notification to sender
        // create chat room
        sender.sentRequests[0] = newFriendShip;
        return sender;
      } else throw new BadRequestException('Bad request no friendShip found');
    } catch (error) {
      console.log('error accepting friend: ', error);
      throw error;
    }
  }

  async rejectFriend(receiverId: number, senderId: number): Promise<any> {
    if (senderId === receiverId)
      throw new BadRequestException(
        'You cannot reject a friend request you sent to yourself',
      );
    try {
      const friendShip = await this.prisma.friends.findFirst({
        where: {
          AND: [{ senderId: senderId }, { receiverId: receiverId }],
        },
      });

      if (friendShip) {
        const newFriendShip = await this.prisma.friends.update({
          where: {
            id: friendShip.id,
          },
          data: {
            status: 'DECLINED',
          },
        });
        return newFriendShip;
      } else throw new BadRequestException('Bad request no friendShip found');
    } catch (error) {
      console.log('error accepting friend: ', error);
      throw error;
    }
  }

  async unfriend(senderId: number, receiverId: number): Promise<any> {
    if (senderId === receiverId)
      throw new BadRequestException('You cannot unfriend yourself');
    try {
      const friendShip = await this.prisma.friends.deleteMany({
        where: {
          OR: [
            {
              senderId: senderId,
              receiverId: receiverId,
            },
            {
              senderId: receiverId,
              receiverId: senderId,
            },
          ],
        },
      });
      if (friendShip.count) return { unfriend: true };
      else throw new BadRequestException('No friendShip found');
    } catch (error) {
      console.log('error accepting friend: ', error);
      throw error;
    }
  }

  async getBlockStatus(userId: number, friendId: number) {
    try {
      const block = await this.prisma.blocks.findMany({
        where: {
          OR: [
            {
              blockerId: userId,
              blockedId: friendId,
            },
            {
              blockerId: friendId,
              blockedId: userId,
            },
          ],
        },
      });

      console.log('block: ', block);
      if (block[0]) return { block: true };
      else return { block: false };
    } catch (error) {
      console.log('error getting friendship: ', error);
    }
  }

  async blockUser(userId: number, blockedId: number) {
    if (userId === blockedId)
      throw new BadRequestException('You cannot block yourself');
    try {
      const user = await this.prisma.blocks.findMany({
        where: {
          OR: [
            {
              blockerId: userId,
              blockedId: blockedId,
            },
            {
              blockerId: blockedId,
              blockedId: userId,
            },
          ],
        },
      });
      console.log('in block', user);
      if (!user[0]) {
        await this.prisma.blocks.create({
          data: {
            blocker: { connect: { id: userId } },
            blocked: { connect: { id: blockedId } },
          },
        });
        return { block: true };
      } else throw new BadRequestException('User already blocked');
    } catch (error) {
      console.log('error blocking user: ', error);
      throw error;
    }
  }

  async unblockUser(userId: number, blockedId: number) {
    if (userId === blockedId)
      throw new BadRequestException('You cannot block yourself');
    try {
      const unblock = await this.prisma.blocks.deleteMany({
        where: {
          blockerId: userId,
          blockedId: blockedId,
        },
      });
      if (unblock.count) return { unblock: true };
      else throw new BadRequestException('Cannot unblock user');
    } catch (error) {
      console.log('error blocking user: ', error);
      throw error;
    }
  }

    async gameInvite( userId: number, opponentId: number) {
        try {
            // const invite = await this.chatGateway.notifications({
            //     senderId: userId,
            //     reciverId: opponentId,
            //     content: 'Game invite',
            // });
            // console.log(invite);
        } catch(error) {
            console.log('error inviting user: ', error);
            throw error;
        }
    }

    // accept game invite

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
