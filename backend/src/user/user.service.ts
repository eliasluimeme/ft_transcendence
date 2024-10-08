import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { settingsDTO } from './dto/settings.dto';
// import { ChatGateway } from 'src/chat/chat.gateway';

@Injectable()
export class UserService {
    constructor( private prisma: PrismaService ) {}

  async createIntraUser(profile: any): Promise<any> {
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
      //ror('Error creating user: ', error);
    }
  }

  async getUserRank(userLevel: number): Promise<number> {
    try {
      const higherLevels = await this.prisma.ladderLevel.count({
        where: { level: { gt: userLevel } },
      });

      return higherLevels + 1;
    } catch (error) {
      //ror('Error getting user rank: ', error);
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
      //ror('Error getting user level: ', error);
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
      //('Error getting match history: ', error);
    }
  }

  async getStatus(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (user) return user.status;
    } catch (error) {
      //ror('Error getting user level: ', error);
    }
  }

  async updateIntraUser(id: string, newData: any ): Promise<any> {
    try {
        const user = await this.prisma.user.update({
            where: {
                intraId: id,
            },
            data: newData,
        });
        return user;
    } catch (error) {
        //ror('Error updating user: ', error);
    }
}



  async getProfile(user: any): Promise<any> {
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
      // //('matchHistory: ', matchHistory);
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
      //('error getting profile: ', error);
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
      //('Failed to get ladderboard: ', error);
    }
  }

  async getRank(userlevel: number): Promise<any> {
    try {
      const rank = await this.getUserRank(userlevel);
      return { rank: rank };
    } catch (error) {
      //('Failed to get rank: ', error);
    }
  }

    async getSettings( intraId: string ): Promise<any> {
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
            //ror('Error getting user settings: ', error);
            if (error instanceof NotFoundException)
                throw error;
        }
    }

  async checkExistingData (id: string,data: { fullName: string;  userName: string;  country: string;  number: string;} ): Promise<any> {
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
        else if (existingNumber[0] && existingNumber[0].number.length !== 10)
          throw new ForbiddenException('Invalid phone number');
    }

    async updateProfile(intraId: string , newData: settingsDTO ): Promise<any> {
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
            //ror('Error updating user: ', error);
        }
    }

    async updateAvatar(userId: number, photo: string): Promise<any> {
        try {
            const user = await this.prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    photo: photo,
                },
                select: {
                    photo: true,
                }
            });
            return user;
        } catch (error) {
            //ror('Error updating user avatar: ', error);
        }
    }

    async updateUser(id: number, newData: any ): Promise<any> {
        try {
            const user = await this.prisma.user.update({
                where: {
                    id: id,
                },
                data: newData,
            });
            return user;
        } catch (error) {
            //ror('Error updating user: ', error);
        }
    }

    async findUserByIntraId(userId: string): Promise<any> {
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
            //ror('Error finding user: ', error);
        }
    }

    async findUserById(userId: number): Promise<any> {
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
            //ror('Error finding user: ', error);
        }
    }

    async deleteUser(id: number): Promise<any> {
        try {
            const user = await this.prisma.user.delete({
                where: {
                    id: id,
                }
            });
            //('User deleted');
        } catch (error) {
            //ror('Error deleting user: ', error);
        }
    }

    isValidQuery(query: string): boolean {
        const allowedPattern = /^[a-zA-Z0-9  -]+$/;
        return allowedPattern.test(query);
    }

  async checkUser(userId: number, query: string): Promise<any> {
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
      //(error);
    }
  }

  async searchUser(user: any, query: string): Promise<any> {
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
          const status = await this.getStatus(user.id);
          if (foundUser.id === user.id)
            return {
              id: foundUser.id,
              userName: foundUser.userName,
              fullName: foundUser.fullName,
              photo: foundUser.photo,
              rank: rank,
              self: true,
              status: status,
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
              status: status,
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
              status: status,
            };
          else
            return {
              id: foundUser.id,
              userName: foundUser.userName,
              fullName: foundUser.fullName,
              photo: foundUser.photo,
              rank: rank,
              friend: 'NONE',
              status: status,
            };
        } else throw new NotFoundException('User not found');
      } catch (error) {
        if (error instanceof NotFoundException) throw error;
        //('error finding users: ', error);
      }
    } else throw new BadRequestException('Invalid input');
  }

  async searchUserAchievements(userName: string): Promise<any> {
    try {
      const userAchievements = await this.prisma.user.findUnique({
        where: {
          userName: userName,
        },
        select: {
          achievements: true,
        },
      });
      // //('userrr', userAchievements);
      return userAchievements;
    } catch (error) {
      //('error finding users: ', error);
    }
  }

  async searchUserMatchHistory(me: any, userName: string): Promise<any> {
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
              where: { id: match.player2Id },
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
              where: { id : match.player1Id },
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
      //('error searching users: ', error);
    }
  }

  async getFriends(userId: number): Promise<any> {
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
                intraId: true,
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
                intraId: true,
                userName: true,
                photo: true,
              },
            });
          }
          return { intraId: user.intraId, userName: user.userName, photo: user.photo };
        }),
      );

      const me = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          intraId: true,
          userName: true,
          photo: true,
        },
      })

      return {me, friends};
    } catch (error) {
      //('error getting friends: ', error);
    }
  }

  async getFriendship(userId: number, friendId: number): Promise<any> {
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
      //('error getting friendship: ', error);
    }
  }

  async addFriend(senderId: number, receiverId: number): Promise<any> {
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
      // //('room: ', room);

      // send notification to receiver
      return { status: friendShip.status };
    } catch (error) {
      //('error adding friend: ', error);
      throw error;
    }
  }

  async acceptFriend(receiverId: number, senderId: number): Promise<any> {
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
      //('error accepting friend: ', error);
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
      //('error accepting friend: ', error);
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
      if (friendShip.count) {
        const conv = await this.prisma.chatroom.deleteMany({
          where: {
            AND: [
              {
                name: 'DM',
              },
              {
                ChatroomUsers: {
                  some: {
                    OR: [
                      {
                        userId: senderId,
                      },
                      {
                        userId: receiverId,
                      },
                    ],
                  },
                },
                // messages: { roomId: senderId} // delete messages
              },
            ],
          },
        });
        if (conv.count)
          return { unfriend: true };
        else throw new BadRequestException('An error occured');
      }
      else throw new BadRequestException('No friendShip found');
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      //('error accepting friend: ', error);
    }
  }

  async getBlockStatus(userId: number, friendId: number): Promise<any> {
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

      // //('block: ', block);
      if (block[0]) return { block: true };
      else return { block: false };
    } catch (error) {
      //('error getting friendship: ', error);
    }
  }

  async blockUser(userId: number, blockedId: number): Promise<any> {
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
      //('in block', user);
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
      //('error blocking user: ', error);
      throw error;
    }
  }

  async unblockUser(userId: number, blockedId: number): Promise<any> {
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
      //('error blocking user: ', error);
      throw error;
    }
  }

    async gameInvite( userId: number, opponentId: number): Promise<any> {
        try {
            // const invite = await this.chatGateway.notifications({
            //     senderId: userId,
            //     reciverId: opponentId,
            //     content: 'Game invite',
            // });
            // //(invite);
        } catch(error) {
            //('error inviting user: ', error);
            throw error;
        }
    }

    // accept game invite

  // async createLocalUser(dto: AuthDto): Promise<any> {
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

  async addToGameHistory(room: any) {
    try {
        // const game = await this.prisma.gameHistory.create({
        //     data: {
        //         winner: {connect: { id: room.winnerId } },
        //         winnerScore: room.winnerScore,
        //         looser: {connect: { id: room.looserId } },
        //         looserScore: room.winnerScore,
        //         disconnect: room.disconnect,
        //     }
        // });
        // if (game)
        //     return game;
    } catch (error) {
        //ror('Error adding game to the games history: ', error);
    }
}
}
