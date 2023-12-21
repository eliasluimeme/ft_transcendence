import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGroupChatDTO } from './dto/createGroupChat.dto';
import { VISIBILITY } from '@prisma/client';
import * as argon from 'argon2';
import { JoinGroupChatDTO } from './dto/joinGroupChat.dto';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {}

    async getConversations(userId: number) {
        try {
            const convos = await this.prisma.chatroom.findMany({
                where: {
                    ChatroomUsers: {
                        some: {
                            userId: userId
                        }
                    }
                },
                include: {
                    ChatroomUsers: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    userName: true,
                                    photo: true,
                                }
                            }
                        }
                    },
                }
            })
            
            const conv = convos.map(conv => {
                const { id, name, group, photo } = conv;
                if (group) {
                    return { convId: id, name, photo }
                } else {
                    const { userName, photo } = conv.ChatroomUsers.find(user => user.userId !== userId).user;
                    return { convId: id, name: userName, photo}
                }
            })
            // TODO: check public rooms if included or not
            return conv;
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

    async createGroupChat(userId: number, infos: CreateGroupChatDTO) {
        try {
            const visibility = this.getVisibility(infos.roomType);
            if (infos.pw)
                infos.pw = await argon.hash(infos.pw)

            const ifRoomExists = await this.prisma.chatroom.findFirst({
                where: {
                    name: infos.roomName
                }
            })
            if (ifRoomExists)
                throw new ForbiddenException('Room name already exists')

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
                        }
                    }
                }
            })
            const { id, name, photo } = groupChat;
            return { id, name, photo }
        } catch(error) {
            if (error instanceof ForbiddenException)
                throw error;
            console.log(error);
        }
    }

    async joinGroupChat(userId: number, infos: JoinGroupChatDTO) {
        try {
            const groupChat = await this.prisma.chatroom.findFirst({
                where: {
                    name: infos.roomName
                },
                include: {
                    ChatroomUsers: {
                        select: {
                            userId: true
                        }
                    }
                }
            })

            if (!groupChat)
                throw new ForbiddenException('Room does not exist')
            if (groupChat.password && !await argon.verify(groupChat.password, infos.pw))
                throw new ForbiddenException('Wrong password')
            if (groupChat.ChatroomUsers.find(user => user.userId === userId))
                throw new ForbiddenException('You are already in this room')

            const newChatroomUser = await this.prisma.chatroom.update({
                where: {
                    id: groupChat.id,
                },
                data: {
                    ChatroomUsers: {
                        create: {
                            userId: userId, 
                        }
                    }
                }
            })

            const { id, name, photo } = newChatroomUser;
            return { id, name, photo };
        } catch (error) {
            if ( error instanceof ForbiddenException)
                throw error;
            console.log(error);
        }
    }

    async getConversationMessages(userId: number, roomId: number) {
        try {
            const messages = await this.prisma.chatroom.findMany({
                where: {
                    id: roomId
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
                                        }
                                    },
                                    role: true,
                                },
                            },
                        }
                    },
                    ChatroomUsers: true,
                },
                orderBy: {
                    createdAt: 'desc',
                }
            })

            const filtredMessages = await Promise.all(messages.map( async msg => {
                console.log('msg', msg);
                const { id, name, photo, group, visibility, messages } = msg;

                const msgs = messages.map(msg => {
                    const { id, content, createdAt, sender } = msg;
                    const { userName, photo } = sender.user;

                    // TODO: check ckicked users messages

                    if ( msg.senderId === userId )
                        return { userId: msg.senderId, sender: "me", photo, role: sender.role , content, createdAt,  }
                    else return { userId: id, sender: userName, photo, role: sender.role , content, createdAt,  }
                })

                if (visibility === VISIBILITY.DM) {
                    // TODO: check name of convo
                    return { id, name, photo, group, visibility, messages: msgs }
                } else
                    return { id, name, photo, group, visibility, messages: msgs }
            }))

            return filtredMessages;
        } catch(error) {
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
                }
            })

            if (!groupChatUser)
                throw new NotFoundException('Room does not exist')

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

                return { success: true, message: 'Room deleted' }
            } else {
                await this.prisma.chatroomUsers.delete({
                    where: {
                        id: groupChatUser.id,
                    },
                });

                return { sucess: true, message: 'User deleted from room' };
            }

        } catch (error) {
            if ( error instanceof NotFoundException)
                throw error;
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
            })

            if (!role)
                throw new NotFoundException('Room does not exist')

            return { role: role.role };
        } catch (error) {
            if ( error instanceof NotFoundException )
                throw error;
            console.log(error);
        }
    }

    async getStaff(userId: number, roomId: number) {
        try {
            const role = await this.prisma.chatroomUsers.findMany({
                where: {
                    chatroomId: roomId,
                    OR: [
                        { role: 'OWNER'},
                        { role: 'ADMIN'}
                    ]
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            userName: true,
                            photo: true,
                        }
                    }
                }
            })

            if (!role)
                throw new NotFoundException('Room does not exist')

            const owner = role.find(user => user.role === 'OWNER');
            const admins = role.filter(user => user.role === 'ADMIN');

            return { owner: owner.user , admins: admins.map(admin => admin.user) };
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
                                }
                            }
                        }
                    }
                }
            })

            if (!groupChatUsers)
                throw new NotFoundException('Room does not exist')

            if ( groupChatUsers.ChatroomUsers.find(user => user.userId === userId).role === 'OWNER' ) {
                return groupChatUsers.ChatroomUsers.map( user => {
                    if ( (user.role === 'ADMIN' || user.role === 'USER') && !user.isBanned ) {
                        const { id, userName, photo } = user.user;
                        return { id, userName, photo, role: user.role };
                    }
                    return null
                }).filter(user => user !== null);
            } else if ( groupChatUsers.ChatroomUsers.find(user => user.userId === userId).role === 'ADMIN' ) {
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

    async getMembersInfos(userId: number, roomId: number, memberId: number): Promise<any> {
        try {
            const user = await this.prisma.chatroom.findFirst({
                where: {
                    id: roomId,
                },
                select: {
                    ChatroomUsers: {
                        where: {
                            userId: memberId
                        },
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    userName: true,
                                    photo: true,
                                }
                            }
                        }
                    }
                }
            })

            if (!user)
                throw new NotFoundException('Room does not exist')

            return {id: user.ChatroomUsers[0].userId, photo: user.ChatroomUsers[0].user.photo, role: user.ChatroomUsers[0].role, isMuted: user.ChatroomUsers[0].isMuted}
           
        } catch (error) {
            if ( error instanceof NotFoundException)
                throw error;
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
            if (user.chatroom.ChatroomUsers.find( user => user.isMuted === true))
                throw new ForbiddenException('Member already muted')

            const chatRoomUserId = user.chatroom.ChatroomUsers.find( user => user.userId === memberId).id;

            await this.prisma.chatroomUsers.update({
                where: {
                    id: chatRoomUserId,
                },
                data: {
                    isMuted: true,
                }
            }).then(() => {
                return { success: true, message: 'Member muted' }
            }).catch((error) => {
                console.log(error);
                throw new BadRequestException('Something went wrong')
            })
        }).catch( (error) => {
            if (error instanceof ForbiddenException || error instanceof NotFoundException)
                throw error;
            console.log(error);
        })

        return user;
    }

    async unmuteMember(userId: number, roomId: number, memberId: number) {
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
                throw new ForbiddenException('You are not allowed to unmute members')
            if (!user.chatroom.ChatroomUsers.find( user => user.userId === memberId))
                throw new ForbiddenException('Member does not exist')
            if (user.chatroom.ChatroomUsers.find( user => user.isMuted === true))
                throw new ForbiddenException('Member already unmuted')

            const chatRoomUserId = user.chatroom.ChatroomUsers.find( user => user.userId === memberId).id;

            await this.prisma.chatroomUsers.update({
                where: {
                    id: chatRoomUserId,
                },
                data: {
                    isMuted: false,
                }
            }).then(() => {
                return { success: true, message: 'Member unmuted' }
            }).catch((error) => {
                console.log(error);
                throw new BadRequestException('Something went wrong')
            })
        }).catch( (error) => {
            if (error instanceof ForbiddenException || error instanceof NotFoundException)
                throw error;
            console.log(error);
        })

        return user;
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
                        }
                    }
                }
            })

            if (!groupChatUser)
                throw new NotFoundException('Room does not exist')
            if (!groupChatUser.chatroom.ChatroomUsers.find( user => user.userId === memberId))
                throw new ForbiddenException('Member does not exist in chatroom')

            if (groupChatUser.role === 'OWNER' || groupChatUser.role === 'ADMIN') {
                await this.prisma.chatroomUsers.deleteMany({
                    where: {
                        userId: memberId,
                        chatroomId: roomId,
                    },
                });

                return { success: true, message: 'User kicked' }
            } else
               throw new ForbiddenException('You are not allowed to kick members')

        } catch (error) {
            if ( error instanceof NotFoundException || error instanceof ForbiddenException )
                throw error;
            console.log(error);
        }
    }

    async banMember(userId: number, roomId: number, memberId: number) {
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
                throw new ForbiddenException('You are not allowed to ban members')
            if (!user.chatroom.ChatroomUsers.find( user => user.userId === memberId))
                throw new ForbiddenException('Member does not exist')
            if (user.chatroom.ChatroomUsers.find( user => user.isBanned === true))
                throw new ForbiddenException('Member already banned')

            const chatRoomUserId = user.chatroom.ChatroomUsers.find( user => user.userId === memberId).id;

            await this.prisma.chatroomUsers.update({
                where: {
                    id: chatRoomUserId,
                },
                data: {
                    isBanned: true,
                }
            }).then(() => {
                return { success: true, message: 'Member banned' }
            }).catch((error) => {
                console.log(error);
                throw new BadRequestException('Something went wrong')
            })

        }).catch( (error) => {
            if (error instanceof ForbiddenException || error instanceof NotFoundException)
                throw error;
            console.log(error);
        })

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
            if (user.role !== 'OWNER' && user.role !== 'ADMIN')
                throw new ForbiddenException('You are not allowed to add admins to this room')
            if (!user.chatroom.ChatroomUsers.find( user => user.userId === memberId))
                throw new ForbiddenException('Member does not exist')
            if (user.chatroom.ChatroomUsers.find( user => user.role === "ADMIN"))
                throw new ForbiddenException('Member already admin')

            const chatRoomUserId = user.chatroom.ChatroomUsers.find( user => user.userId === memberId).id;

            await this.prisma.chatroomUsers.update({
                where: {
                    id: chatRoomUserId,
                },
                data: {
                    role: 'ADMIN',
                }
            }).then(() => {
                return { success: true, message: 'Admin added' }
            }).catch((error) => {
                console.log(error);
                throw new BadRequestException('Something went wrong')
            })

        }).catch( (error) => {
            if (error instanceof ForbiddenException || error instanceof NotFoundException)
                throw error;
            console.log(error);
        })

        return user;
    }

}