import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { settingsDTO } from './dto/settings.dto';

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
              wins: 0,
              losses: 0,
            },
          },
        },
      });

      return user;
    } catch (error) {
    }
  }

  async getUserRank(userLevel: number): Promise<number> {
    try {
      const higherLevels = await this.prisma.ladderLevel.count({
        where: { level: { gt: userLevel } },
      });

      return higherLevels + 1;
    } catch (error) {
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
    }
  }

  async getMatchHistory(userId: number): Promise<any> {
    try {
      const matchHistory = await this.prisma.matchHistory.findMany({
        where: {
          OR: [{ winnerId: userId }, { looserId: userId }],
        },
      });
      return matchHistory;
    } catch (error) {

    }
  }

  async getStatus(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          status: true,
        },
      });
      if (user) return user.status;
    } catch (error) {
    }
  }

  async getProfile(user: any): Promise<any> {
    try {
      const userLevel = await this.getUserLevel(user.id);
      const userRank = await this.getUserRank(userLevel);
      const matchs = await this.getMatchHistory(user.id);
      const status = await this.getStatus(user.id);

      const matchHistory = await Promise.all(
        matchs.map(async (match) => {
          if (match.winnerId === user.id) {
            const { id, userName, photo } = user;
            match.winner = { id, userName, photo };
            match.looser = await this.prisma.user.findUnique({
              where: { id: match.looserId },
              select: {
                id: true,
                userName: true,
                photo: true,
              },
            });
          } else {
            const { id, userName, photo } = user;
            match.looser = { id, userName, photo };
            match.winner = await this.prisma.user.findUnique({
              where: { id: match.winnerId },
              select: {
                id: true,
                userName: true,
                photo: true,
              },
            });
          }
          const { winner, looser, score1, score2, mode } = match;
          return {
            winner,
            looser,
            result: score1.toString() + ' - ' + score2.toString(),
            mode,
          };
        }),
      );
      const { photo, userName, fullName, achievements } = user;
      return {
        userName,
        fullName,
        photo,
        rank: userRank,
        level: userLevel,
        achievements,
        match: matchHistory,
        status: status,
      };
    } catch (error) {
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
    }
  }

  async getRank(userlevel: number): Promise<any> {
    try {
      const rank = await this.getUserRank(userlevel);
      return { rank: rank };
    } catch (error) {
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
            if (user.number === null)
              user.number = '';
            if (user.country === null)
              user.country = '';
            if (user)
                return user;
            else throw new NotFoundException('User not found');
        } catch (error) {
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

        if (data.number.length != 10)
          throw new ForbiddenException('Invalid phone number');

        const existingNumber = await this.prisma.user.findMany({
            where: {
                number: data.number,
            },
        });

        if (existingNumber[0] && existingNumber[0].intraId !== id)
          throw new ForbiddenException('Number already in use');
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
        }
    }

    async updateIntraUser(id: string, newData: any ): Promise<any> {
      if (id) {
        try {
            const user = await this.prisma.user.update({
                where: {
                    intraId: id,
                },
                data: newData,
            });
            return user;
        } catch (error) {
        }
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
        }
    }

    async deleteUser(id: number): Promise<any> {
        try {
            const user = await this.prisma.user.delete({
                where: {
                    id: id,
                }
            });
        } catch (error) {
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
            winner: true,
            looser: true,
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
          const rank = await this.getUserRank(foundUser.level.level);
          const status = await this.getStatus(foundUser.id);

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
      return userAchievements;
    } catch (error) {
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
          winner: true,
          looser: true,
        },
      });

      const matchs = await this.getMatchHistory(user.id);

      const matchHistory = await Promise.all(
        matchs.map(async (match) => {
          if (match.winnerId === user.id) {
            const { id, userName, photo } = user;

            const user2 = await this.prisma.user.findUnique({
              where: { id: match.looserId },
              select: {
                id: true,
                userName: true,
                photo: true,
              },
            });

            match.winner = { id, userName, photo };
            match.looser = {
              id: user2.id,
              userName: user2.userName,
              photo: user2.photo,
            };
            match.score =
              match.score1.toString() + ' - ' + match.score2.toString();
          } else {
            const { id, userName, photo } = user;

            const user2 = await this.prisma.user.findUnique({
              where: { id : match.winnerId },
              select: {
                id: true,
                userName: true,
                photo: true,
              },
            });

            match.looser = { id, userName, photo };
            match.winner = {
              id: user2.id,
              userName: user2.userName,
              photo: user2.photo,
            };
            match.score =
              match.score1.toString() + ' - ' + match.score2.toString();
          }
          const { winner, looser, score, mode } = match;
          return { winner, looser, score, mode };
        }),
      );

      return matchHistory;
    } catch (error) {
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
    }
  }

  async getFriendship(userId: number, friendId: number): Promise<any> {
    if (!friendId)
      throw new BadRequestException('Bad request no friendShip found');

    try {
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
      return { status: friendShip.status };
    } catch (error) {
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
        sender.sentRequests[0] = newFriendShip;
        return sender;
      } else throw new BadRequestException('Bad request no friendShip found');
    } catch (error) {
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

      if (block[0]) return { block: true };
      else return { block: false };
    } catch (error) {
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
            // console.log(invite);
        } catch(error) {
            throw error;
        }
    }

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
        const game = await this.prisma.matchHistory.create({
            data: {
                winner: {connect: { intraId: room.winnerId } },
                score1: room.winnerScore,
                looser: {connect: { intraId: room.looserId } },
                score2: room.looserScore,
                mode: 'CLASSIC',
            }
        });

        const winner = await this.prisma.user.findUnique({
          where: {
            intraId: room.winnerId,
          },
          select: { id: true }
        });

        const level = await this.prisma.ladderLevel.update({
          where: {
            id: winner.id,
          },
          data: {
            level: {
              increment: 0.5,
            }
          }
        });

        if (game)
            return game;
    } catch (error) {
    }
}

  async setAchievements(winner: any, looser: any) {
    try {
      const w = await this.prisma.user.findUnique({
        where: {
          intraId: winner.id,
        },
        select: {
          achievements: true,
        }
      })
      const l = await this.prisma.user.findUnique({
        where: {
          intraId: looser.id,
        },
        select: {
          achievements: true,
        }
      })
  
      const wr = w.achievements.map((a: boolean, index) => {
        if (a === false && winner.achievs[index] === true)
          return true;
        else if (a === true) return true
        else return false
      })

      const lr = l.achievements.map((a: boolean, index) => {
        if (a === false && winner.achievs[index] === true)
          return true;
        else if (a === true) return true
        else return false
      })

      await this.prisma.user.update({
        where: {
          intraId: winner.id,
        },
        data: {
          achievements: wr
        }
      })
  
      await this.prisma.user.update({
        where: {
          intraId: looser.id,
        },
        data: {
          achievements: lr
        }
      })

    } catch (error){
    }
  }

}
