import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGroupChatDTO } from './dto/createGroupChat.dto';
import { VISIBILITY } from '@prisma/client';
import * as argon from 'argon2';
import { JoinGroupChatDTO } from './dto/joinGroupChat.dto';
import { LessThan } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

    async getConversations(userId: number) {
        try {

            const userConvos = await this.prisma.user.findUnique({
                where: {
                    id: userId,
                },
                include: {
                    ChatroomUsers: {
                        include: {
                            chatroom: {
                                select: {
                                    id: true,
                                    name: true,
                                    photo: true,
                                    group: true,
                                    visibility: true,
                                }
                            }
                        }
                    },
                    blocker: true,
                    blocked: true,
                }
            });

            // console.log("userconvos", userConvos);
            const iblocked = userConvos.blocker.filter(u => u.blockerId === userId);
            const blockedme = userConvos.blocked.filter(u => u.blockedId === userId);
            // console.log("blockedme", blockedme);
            // console.log("iblocked", iblocked);

            const convos = await this.prisma.chatroom.findMany({
                where: {
                    OR: [
                        { ChatroomUsers: { some: { userId: userId } } },
                        { visibility: 'PUBLIC' },
                    ],
                },
                include: {
                    ChatroomUsers: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    userName: true,
                                    photo: true,
                                    blocker: true,
                                    blocked: true,
                                }
                            }
                        }
                    },
                }
            })
            // console.log("convos", convos)
            const conv = convos.map(conv => {
                const { id, name, group, photo, visibility } = conv;
                if (group) {

                    if (visibility === 'PRIVATE' && conv.ChatroomUsers.find(u => u.userId === userId).isBanned === false)
                        return { convId: id, name, photo }
                    else if (visibility === 'PROTECTED' && conv.ChatroomUsers.find(u => u.userId === userId).isBanned === false) 
                        return { convId: id, name, photo }
                    // else if (visibility === 'PUBLIC')
                    //     if (conv.ChatroomUsers.find(u => u.userId === userId)) {
                    //         if (conv.ChatroomUsers.find(u => u.userId === userId).isBanned === false)
                    //             return { convId: id, name, photo }
                    //     } else 
                    //         return { convId: id, name, photo }
                    else return null;
                } else {
                    const user = conv.ChatroomUsers.find(u => u.userId !== userId).userId;

                    if (iblocked.find(u => u.blockedId === user) || blockedme.find(u => u.blockerId === user))
                        return null; 

                    const { userName, photo } = conv.ChatroomUsers.find(user => user.userId !== userId).user;
                    return { convId: id, name: userName, photo}
                }
            }).filter(conv => conv !== null);
            // TODO: check public rooms if included or not
            return conv
        } catch(error) {
            console.log(error);
        }
    }

  getVisibility(visibility: string): VISIBILITY {
    switch (visibility) {
      case 'DM':
        return VISIBILITY.DM;
      case 'PUBLIC':
        return VISIBILITY.PUBLIC;
      case 'PRIVATE':
        return VISIBILITY.PRIVATE;
      case 'PROTECTED':
        return VISIBILITY.PROTECTED;
      default:
        throw new Error(`Invalid visibility type: ${visibility}`);
    }
  }

  async getConvoMembers(userId: number, roomId: number) {
    try {
      const room = await this.prisma.chatroom.findUnique({
        where: {
          id: roomId,
        },
        include: {
          ChatroomUsers: {
            include: {
              user: {
                select: {
                  id: true,
                  userName: true,
                  photo: true,
                },
              },
            },
          },
        },
      });
      if (!room) throw new NotFoundException('Room does not exist');

      const userss = room.ChatroomUsers.map((user) => {
        return {
          id: user.user.id,
          userName: user.user.userName,
          photo: user.user.photo,
        };
      });

      if (!userss.find((user) => user.id === userId))
        throw new ForbiddenException('You are not in this room');

      const users = userss.map((user) => {
        if (user.id === userId) {
          return {
            id: user.id,
            name: user.userName,
            photo: user.photo,
            self: true,
          };
        } else {
          return {
            id: user.id,
            name: user.userName,
            photo: user.photo,
            self: false,
          };
        }
      });
      console.log(users, room.visibility);
      return { visibility: room.visibility, users };
    } catch (error) {
      console.log(error);
    }
  }

  async createGroupChat(userId: number, infos: CreateGroupChatDTO) {
    try {
      const visibility = this.getVisibility(infos.roomType);
      if (infos.pw) infos.pw = await argon.hash(infos.pw);

      const ifRoomExists = await this.prisma.chatroom.findFirst({
        where: {
          name: infos.roomName,
        },
      });
      if (ifRoomExists)
        throw new ForbiddenException('Room name already exists');

      const groupChat = await this.prisma.chatroom.create({
        data: {
          name: infos.roomName,
          group: true,
          visibility: visibility,
          password: infos.pw,
          ChatroomUsers: {
            create: {
              userId,
              role: 'OWNER',
            },
          },
        },
      });
      const { id, name, photo } = groupChat;
      return { id, name, photo };
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      console.log(error);
    }
  }

  async joinGroupChat(userId: number, infos: JoinGroupChatDTO) {
    try {
      const groupChat = await this.prisma.chatroom.findFirst({
        where: {
          name: infos.roomName,
        },
        include: {
          ChatroomUsers: {
            select: {
              userId: true,
            },
          },
        },
      });

      if (!groupChat) throw new ForbiddenException('Room does not exist');
      if (
        groupChat.password &&
        !(await argon.verify(groupChat.password, infos.pw))
      )
        throw new ForbiddenException('Wrong password');
      if (groupChat.ChatroomUsers.find((user) => user.userId === userId))
        throw new ForbiddenException('You are already in this room');

      const newChatroomUser = await this.prisma.chatroom.update({
        where: {
          id: groupChat.id,
        },
        data: {
          ChatroomUsers: {
            create: {
              userId: userId,
            },
          },
        },
      });

      const { id, name, photo } = newChatroomUser;
      return { id, name, photo };
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      console.log(error);
    }
  }

  async getConversationMessages(userId: number, roomId: number) {
    try {
      const messages = await this.prisma.chatroom.findMany({
        where: {
          id: roomId,
        },
        include: {
          messages: {
            include: {
              sender: {
                select: {
                  user: {
                    select: {
                      id: true,
                      userName: true,
                      photo: true,
                    },
                  },
                  role: true,
                },
              },
            },
          },
          ChatroomUsers: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

            const filtredMessages = await Promise.all(messages.map( async msg => {
                const { id, name, photo, group, visibility, messages } = msg;

          const msgs = messages.map((msg) => {
            const { id, content, createdAt, sender } = msg;
            const { userName, photo } = sender.user;

            // TODO: check ckicked users messages

            if (msg.senderId === userId)
              return {
                userId: msg.senderId,
                sender: 'me',
                photo,
                role: sender.role,
                content,
                createdAt,
              };
            else
              return {
                userId: id,
                sender: userName,
                photo,
                role: sender.role,
                content,
                createdAt,
              };
          });

          if (visibility === VISIBILITY.DM) {
            // TODO: check name of convo
            return { id, name, photo, group, visibility, messages: msgs };
          } else return { id, name, photo, group, visibility, messages: msgs };
        }),
      );

      return filtredMessages;
    } catch (error) {
      console.log(error);
    }
  }

  async leaveGroupChat(userId: number, roomId: number) {
    try {
      const groupChatUser = await this.prisma.chatroomUsers.findFirst({
        where: {
          userId: userId,
          chatroomId: roomId,
        },
        include: {
          chatroom: true,
        },
      });

      if (!groupChatUser) throw new NotFoundException('Room does not exist');

      if (groupChatUser.role === 'OWNER') {
        // Delete all ChatroomUsers associated with this room
        await this.prisma.chatroomUsers.deleteMany({
          where: {
            chatroomId: roomId,
          },
        });

        // Delete all messages associated with this room
        await this.prisma.message.deleteMany({
          where: {
            chatroomId: roomId,
          },
        });

        // Delete the room itself
        await this.prisma.chatroom.delete({
          where: {
            id: roomId,
          },
        });

        return { success: true, message: 'Room deleted' };
      } else {
        await this.prisma.chatroomUsers.delete({
          where: {
            id: groupChatUser.id,
          },
        });

        return { sucess: true, message: 'User deleted from room' };
      }
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.log(error);
    }
  }

  async getRole(userId: number, roomId: number) {
    try {
      const role = await this.prisma.chatroomUsers.findFirst({
        where: {
          userId: userId,
          chatroomId: roomId,
        },
      });

      if (!role) throw new NotFoundException('Room does not exist');

      return { role: role.role };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.log(error);
    }
  }

  async getStaff(userId: number, roomId: number) {
    try {
      const role = await this.prisma.chatroomUsers.findMany({
        where: {
          chatroomId: roomId,
          OR: [
            {
              role: 'OWNER',
            },
            {
              role: 'ADMIN',
            },
          ],
        },
        include: {
          user: {
            select: {
              id: true,
              userName: true,
              photo: true,
            },
          },
        },
      });

      if (!role) throw new NotFoundException('Room does not exist');

            const room = await this.prisma.chatroom.findUnique({
                where: {
                    id: roomId,
                },
                select: { visibility: true }
            })
            if (!room)
                throw new NotFoundException('Room does not exist')

            if (room.visibility !== VISIBILITY.DM) {
                const owner = role.find(user => user.role === 'OWNER');
                const admins = role.filter(user => user.role === 'ADMIN');
                if (admins[0])
                    return { owner: owner.user , admins: admins.map(admin => admin.user) };
                else return { owner: owner.user , admins: null };
            } else 
                return { id: roomId, visibility: room.visibility };
        } catch (error) {
            if ( error instanceof NotFoundException )
                throw error;
            console.log(error);
        }
    }

  async getMembers(userId: number, roomId: number) {
    try {
      const groupChatUsers = await this.prisma.chatroom.findFirst({
        where: {
          id: roomId,
        },
        include: {
          ChatroomUsers: {
            include: {
              user: {
                select: {
                  id: true,
                  userName: true,
                  photo: true,
                },
              },
            },
          },
        },
      });

      if (!groupChatUsers) throw new NotFoundException('Room does not exist');

            if ( groupChatUsers.ChatroomUsers.find(user => user.userId === userId) ) {
                if (groupChatUsers.ChatroomUsers.find(user => user.userId === userId).role === 'OWNER')
                    return groupChatUsers.ChatroomUsers.map( user => {
                        if ( (user.role === 'ADMIN' || user.role === 'USER') && !user.isBanned ) {
                            const { id, userName, photo } = user.user;
                            return { id, userName, photo, role: user.role };
                        }
                        return null
                    }).filter(user => user !== null);
            } if ( groupChatUsers.ChatroomUsers.find(user => user.userId === userId) ) {
                if (groupChatUsers.ChatroomUsers.find(user => user.userId === userId).role === 'ADMIN')
                    return groupChatUsers.ChatroomUsers.map( user => {
                        if ( user.role === 'USER' && !user.isBanned ) {
                            const { id, userName, photo } = user.user;
                            return { id, userName, photo, role: user.role };
                        }
                        return null
                    }).filter(user => user !== null);
            } else return null;
           
        } catch (error) {
            if ( error instanceof NotFoundException)
                throw error;
            console.log(error);
        }
    }

  async getMembersInfos(
    userId: number,
    roomId: number,
    memberId: number,
  ): Promise<any> {
    try {
      const user = await this.prisma.chatroom.findFirst({
        where: {
          id: roomId,
        },
        select: {
          ChatroomUsers: {
            where: {
              userId: memberId,
            },
            include: {
              user: {
                select: {
                  id: true,
                  userName: true,
                  photo: true,
                },
              },
            },
          },
        },
      });

      if (!user) throw new NotFoundException('Room does not exist');

      return {
        id: user.ChatroomUsers[0].userId,
        photo: user.ChatroomUsers[0].user.photo,
        role: user.ChatroomUsers[0].role,
        isMuted: user.ChatroomUsers[0].isMuted,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.log(error);
    }
  }

    async muteMember(userId: number, roomId: number, memberId: number) {
        const user = await this.prisma.chatroomUsers.findFirst({
            where: {
                userId: userId,
                chatroomId: roomId,
            },
            include: {
                chatroom: {
                    include: {
                        ChatroomUsers: true,
                    }
                },
            }
        }).then( async (user) => {
            if (!user)
                throw new NotFoundException('Room does not exist')
            if (user.role !== 'OWNER' && user.role !== 'ADMIN')
                throw new ForbiddenException('You are not allowed to mute members')
            if (!user.chatroom.ChatroomUsers.find( user => user.userId === memberId))
                throw new ForbiddenException('Member does not exist')
            // if (user.chatroom.ChatroomUsers.find( user => user.userId === memberId).isMuted === true)
            //     throw new ForbiddenException('Member already muted')

            const chatRoomUserId = user.chatroom.ChatroomUsers.find( user => user.userId === memberId).id;
            const status = user.chatroom.ChatroomUsers.find( user => user.userId === memberId).isMuted;

            let update: any;
            if (status) {
                update = await this.prisma.chatroomUsers.update({
                    where: {
                        id: chatRoomUserId,
                    },
                    data: {
                        isMuted: false,
                    }
                })
            }
            else {
                const currentTime = new Date();
                const muteExpiration = new Date(currentTime.getTime() + 10 * 60000);
                update = await this.prisma.chatroomUsers.update({
                    where: {
                        id: chatRoomUserId,
                    },
                    data: {
                        isMuted: true,
                        muteExpiration,
                    }
                })
            }
            return {isMuted: update.isMuted}
        }).catch( (error) => {
            if (error instanceof ForbiddenException || error instanceof NotFoundException)
                throw error;
            console.log(error);
            throw new BadRequestException('Something went wrong');
          });
      })
      .catch((error) => {
        if (
          error instanceof ForbiddenException ||
          error instanceof NotFoundException
        )
          throw error;
        console.log(error);
      });

    return user;
  }

    // async unmuteMember(userId: number, roomId: number, memberId: number) {
    //     const user = await this.prisma.chatroomUsers.findFirst({
    //         where: {
    //             userId: userId,
    //             chatroomId: roomId,
    //         },
    //         include: {
    //             chatroom: {
    //                 include: {
    //                     ChatroomUsers: true,
    //                 }
    //             },
    //         }
    //     }).then( async (user) => {
    //         console.log("user", user.chatroom.ChatroomUsers)
    //         if (!user)
    //             throw new NotFoundException('Room does not exist')
    //         if (user.role !== 'OWNER' && user.role !== 'ADMIN')
    //             throw new ForbiddenException('You are not allowed to unmute members')
    //         if (!user.chatroom.ChatroomUsers.find( user => user.userId === memberId))
    //             throw new ForbiddenException('Member does not exist')
    //         if (user.chatroom.ChatroomUsers.find( user => user.userId === memberId).isMuted === false)
    //             throw new ForbiddenException('Member already unmuted')

    //         const chatRoomUserId = user.chatroom.ChatroomUsers.find( user => user.userId === memberId).id;

    //         return await this.prisma.chatroomUsers.update({
    //             where: {
    //                 id: chatRoomUserId,
    //             },
    //             data: {
    //                 isMuted: false,
    //             }
    //         }).then(() => {
    //             return { success: true, message: 'Member unmuted' }
    //         }).catch((error) => {
    //             console.log(error);
    //             throw new BadRequestException('Something went wrong')
    //         })
    //     }).catch( (error) => {
    //         if (error instanceof ForbiddenException || error instanceof NotFoundException)
    //             throw error;
    //         console.log(error);
    //     })

    //     return user;
    // }

    async unmutescheduler(): Promise<any> {
        const currentTime = new Date();

        const expiredUsers = await this.prisma.chatroomUsers.findMany({
          where: {
            isMuted: true,
            muteExpiration: {
              lt: currentTime,
            },
          },
        });

        if (expiredUsers && expiredUsers.length > 0) {
          for (const user of expiredUsers) {
            await this.prisma.chatroomUsers.update({
              where: { id: user.id },
              data: {
                isMuted: false,
                muteExpiration: null,
              },
            });

            console.log(`User ${user.id} has been unmuted.`);
          }
        }
    }

  async kickMember(userId: number, roomId: number, memberId: number) {
    try {
      const groupChatUser = await this.prisma.chatroomUsers.findFirst({
        where: {
          userId: userId,
          chatroomId: roomId,
        },
        include: {
          chatroom: {
            include: {
              ChatroomUsers: true,
            },
          },
        },
      });

      if (!groupChatUser) throw new NotFoundException('Room does not exist');
      if (
        !groupChatUser.chatroom.ChatroomUsers.find(
          (user) => user.userId === memberId,
        )
      )
        throw new ForbiddenException('Member does not exist in chatroom');

      if (groupChatUser.role === 'OWNER' || groupChatUser.role === 'ADMIN') {
        await this.prisma.chatroomUsers.deleteMany({
          where: {
            userId: memberId,
            chatroomId: roomId,
          },
        });

        return { success: true, message: 'User kicked' };
      } else
        throw new ForbiddenException('You are not allowed to kick members');
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      )
        throw error;
      console.log(error);
    }
  }

  async banMember(userId: number, roomId: number, memberId: number) {
    const user = await this.prisma.chatroomUsers
      .findFirst({
        where: {
          userId: userId,
          chatroomId: roomId,
        },
        include: {
          chatroom: {
            include: {
              ChatroomUsers: true,
            },
          },
        },
      })
      .then(async (user) => {
        if (!user) throw new NotFoundException('Room does not exist');
        if (user.role !== 'OWNER' && user.role !== 'ADMIN')
          throw new ForbiddenException('You are not allowed to ban members');
        if (
          !user.chatroom.ChatroomUsers.find((user) => user.userId === memberId)
        )
          throw new ForbiddenException('Member does not exist');
        if (user.chatroom.ChatroomUsers.find((user) => user.isBanned === true))
          throw new ForbiddenException('Member already banned');

        const chatRoomUserId = user.chatroom.ChatroomUsers.find(
          (user) => user.userId === memberId,
        ).id;

        await this.prisma.chatroomUsers
          .update({
            where: {
              id: chatRoomUserId,
            },
            data: {
              isBanned: true,
            },
          })
          .then(() => {
            return { success: true, message: 'Member banned' };
          })
          .catch((error) => {
            console.log(error);
            throw new BadRequestException('Something went wrong');
          });
      })
      .catch((error) => {
        if (
          error instanceof ForbiddenException ||
          error instanceof NotFoundException
        )
          throw error;
        console.log(error);
      });

    return user;
  }

    // async unbanMember(userId: number, roomId: number, memberId: number) {
    //     const user = await this.prisma.chatroomUsers.findFirst({
    //         where: {
    //             userId: userId,
    //             chatroomId: roomId,
    //         },
    //         include: {
    //             chatroom: {
    //                 include: {
    //                     ChatroomUsers: true,
    //                 }
    //             },
    //         }
    //     }).then( async (user) => {
    //         if (!user)
    //             throw new NotFoundException('Room does not exist')
    //         if (user.role !== 'OWNER' && user.role !== 'ADMIN')
    //             throw new ForbiddenException('You are not allowed to unban members')
    //         if (!user.chatroom.ChatroomUsers.find( user => user.userId === memberId))
    //             throw new ForbiddenException('Member does not exist')
    //         if (user.chatroom.ChatroomUsers.find( user => user.isBanned === true))
    //             throw new ForbiddenException('Member already unbanned')

    //         const chatRoomUserId = user.chatroom.ChatroomUsers.find( user => user.userId === memberId).id;

    //         await this.prisma.chatroomUsers.update({
    //             where: {
    //                 id: chatRoomUserId,
    //             },
    //             data: {
    //                 isBanned: false,
    //             }
    //         }).then(() => {
    //             return { success: true, message: 'Member unbanned' }
    //         }).catch((error) => {
    //             console.log(error);
    //             throw new BadRequestException('Something went wrong')
    //         })

    //     }).catch( (error) => {
    //         if (error instanceof ForbiddenException || error instanceof NotFoundException)
    //             throw error;
    //         console.log(error);
    //     })

    //     return user;
    // }

    async addAdmin(userId: number, roomId: number, memberId: number) {
        const user = await this.prisma.chatroomUsers.findFirst({
            where: {
                userId: userId,
                chatroomId: roomId,
            },
            include: {
                chatroom: {
                    include: {
                        ChatroomUsers: true,
                    }
                },
            }
        }).then( async (user) => {
            if (!user)
                throw new NotFoundException('Room does not exist')
            // if (user.role !== 'OWNER')
            //     throw new ForbiddenException('You are not allowed to add admins to this room')
            if (!user.chatroom.ChatroomUsers.find( user => user.userId === memberId))
                throw new ForbiddenException('Member does not exist')
            // if (user.chatroom.ChatroomUsers.find( user => user.userId === memberId).role === 'ADMIN')
            //     throw new ForbiddenException('Member already admin')

            const chatRoomUserId = user.chatroom.ChatroomUsers.find( user => user.userId === memberId).id;
            const role = user.chatroom.ChatroomUsers.find( user => user.userId === memberId).role;

            let update: any;
            if (role === 'ADMIN') {
                update = await this.prisma.chatroomUsers.update({
                    where: {
                        id: chatRoomUserId,
                    },
                    data: {
                        role: 'USER',
                    }
                })
            } else if (role === 'USER') {
                update = await this.prisma.chatroomUsers.update({
                    where: {
                        id: chatRoomUserId,
                    },
                    data: {
                        role: 'ADMIN',
                    }
                })
            }

            if (update)
                return { role: update.role }
        }).catch( (error) => {
            if (error instanceof ForbiddenException || error instanceof NotFoundException)
                throw error;
            console.log(error);
            throw new BadRequestException('Something went wrong');
          });
      })
      .catch((error) => {
        if (
          error instanceof ForbiddenException ||
          error instanceof NotFoundException
        )
          throw error;
        console.log(error);
      });

    return user;
  }

  async changeRoomPw(userId: number, roomId: number, pw: string) {
    try {
      const room = await this.prisma.chatroom.findUnique({
        where: {
          id: roomId,
        },
        include: {
          ChatroomUsers: true,
        },
      });

      if (!room) throw new NotFoundException('Room does not exist');
      if (
        room.ChatroomUsers.find((user) => user.userId === userId).role !==
        'OWNER'
      )
        throw new ForbiddenException(
          'You are not allowed to change the password',
        );
      if (room.visibility !== VISIBILITY.PROTECTED)
        throw new ForbiddenException(
          'Room is not protected, you cannot set a password',
        );

            const newPw = await argon.hash(pw);
            const newPassword = await this.prisma.chatroom.update({
                where: {
                    id: roomId,
                },
                data: {
                    password: newPw,
                }
            })
            
            if (newPassword)
                return { success: true, message: 'Password changed' }
            else throw new BadRequestException('Something went wrong. Please try again');
        } catch (error) {
            if ( error instanceof NotFoundException || error instanceof ForbiddenException || error instanceof BadRequestException )
                throw error;
            throw error
        }
    }

  async disableRoomPw(userId: number, roomId: number) {
    try {
      const room = await this.prisma.chatroom.findUnique({
        where: {
          id: roomId,
        },
        include: {
          ChatroomUsers: true,
        },
      });

      if (!room) throw new NotFoundException('Room does not exist');
      if (
        room.ChatroomUsers.find((user) => user.userId === userId).role !==
        'OWNER'
      )
        throw new ForbiddenException(
          'You are not allowed to disable the password',
        );
      if (room.visibility !== VISIBILITY.PROTECTED)
        throw new ForbiddenException(
          'Room is not protected, you cannot disable password',
        );

      const newPassword = await this.prisma.chatroom.update({
        where: {
          id: roomId,
        },
        data: {
          visibility: 'PUBLIC',
          password: null,
        },
      });

      if (newPassword) return { success: true, message: 'Password disabled' };
      else
        throw new BadRequestException('Something went wrong. Please try again');
    } catch (error) {
      console.log(error);
    }
  }
}

    async leaveRoom(userId: number, roomId: number) {
        try {
            const room = await this.prisma.chatroom.findUnique({
                where: {
                    id: roomId,
                },
                include: {
                    ChatroomUsers: true,
                }
            })
            
            if (!room)
                throw new BadRequestException('Room not found')
            if (!room.ChatroomUsers.find(user => user.userId === userId))
                throw new BadRequestException('You are not in this room')
            if (room.visibility === VISIBILITY.DM)
                throw new ForbiddenException('You are not allowed to leave this room')

            if (room.ChatroomUsers.find(user => user.userId === userId).role === 'OWNER') {
                const user = await this.prisma.chatroom.deleteMany({
                    where: {
                        id: roomId,
                    }
                })
                if (user)
                    return { success: true, message: 'Owner left' }
                else throw new BadRequestException('Something went wrong. Please try again');
            } else {
                const user = await this.prisma.chatroomUsers.deleteMany({
                    where: {
                        userId: userId,
                        chatroomId: roomId,
                    }
                })
                if (user)
                    return { success: true, message: 'User left' }
                else throw new BadRequestException('Something went wrong. Please try again');
            }

        } catch (error) {
            if (error instanceof BadRequestException)
                throw error;
            console.log(error)
        }
    }

    async addMember(userId: number, roomId: number, memberName: string) {
        try {
            const room = await this.prisma.chatroom.findUnique({
                where: {
                    id: roomId,
                },
                include: {
                    ChatroomUsers: true,
                }
            });
            if (!room) throw new BadRequestException('Room does not exist');
            // if (room.ChatroomUsers.find(user => user.userId === userId).role !== 'OWNER')
            //     throw new ForbiddenException('You are not allowed to add members')

            const member = await this.prisma.user.findUnique({
                where: {
                    userName: memberName,
                }
            })
            if (!member) throw new BadRequestException('User does not exist');

            const memberInRoom = await this.prisma.chatroomUsers.findFirst({
                where: {
                    userId: member.id,
                    chatroomId: roomId,
                }
            })
            if (memberInRoom) throw new ForbiddenException('User already in room');

            const newMember = await this.prisma.chatroomUsers.create({
                data: {
                    // userId: { connect: { id: member.id }},
                    userId: member.id,
                    chatroomId: roomId,
                }
            })
            console.log('new member', newMember)
            return newMember
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof ForbiddenException)
                throw error
            console.log(error)
        }
    }

}