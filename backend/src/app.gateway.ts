// import { Server, Socket } from 'socket.io';
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import {
//   WebSocketGateway,
//   WebSocketServer,
//   OnGatewayDisconnect,
//   OnGatewayConnection,
// } from '@nestjs/websockets';
// import { JwtService } from '@nestjs/jwt';
// import { PrismaService } from 'src/prisma/prisma.service';

// @Injectable()
// @WebSocketGateway({
//   cors: {
//     origin: 'http://localhost:3000',
//     credentials: true,
//   },
//   namespace: 'status',
// })
// export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   constructor(
//     private prisma: PrismaService,
//     private jwtService: JwtService,
//   ) {}

//   @WebSocketServer()
//     server: Server;
//     socket: Socket;

//   userToClient = new Map< string, number>();

//   extractTokenFromCookies(cookies: any): string | null {
//     const accessToken = cookies?.split('=')[1].replace(/"/g, '');
//     if (accessToken)
//       return accessToken;
//     return null;
//   }

//   async findUserByIntraId(userId: string) {
//     try {
//         const user = await this.prisma.user.findUnique({
//             where: {
//                 intraId: userId,
//             },
//             include: {
//                 level: true,
//             }
//         });
//         if (user) {
//             delete user.hash;
//             return user;
//         } else return user;
//     } catch (error) {
//         //console.logor('Error finding user: ', error);
//     }
// }

// async handleConnection(client: Socket) {
//     try {
//       const token = this.extractTokenFromCookies(client.handshake.headers.cookie);
//       if (!token) return this.disconnect(client);
      
//       const verifiedToken = await this.jwtService.verifyAsync(token, {
//         secret: process.env.JWT_SECRET,
//       });
//       if (!verifiedToken) return this.disconnect(client);
      
//       const user = await this.findUserByIntraId(verifiedToken.userId)
//     if (!user)
//       return this.disconnect(client);

//     this.userToClient.set(client.id, user.id);
//     //console.log(client.id, 'successfully connected ++++++ ');
//     client.data.user = verifiedToken
    
//     await this.prisma.user.update({
//         where: {
//             id: user.id
//         },
//         data: {
//             status: 'ONLINE'
//         }
//     })

//     } catch (error) {
//         //console.log('erroooor: ', error);
//       return this.disconnect(client);
//     }
//   }

//   async handleDisconnect(client: Socket) {
//     const user_id = this.userToClient.get(client.id);
//     //console.log('user ID to disctonnected       ==== ', client.id ,  user_id);
//       await this.prisma.user.update({
//           where: {
//               id: user_id
//             },
//             data: {
//                 status: 'OFFLINE'
//             }
//         })
//     delete this.userToClient[client.id];
//     this.disconnect(client);
//     //console.log('disconnected =++++++++++++', client.id);
//   }

//   private disconnect(client: Socket) {
//     client.emit('error', new UnauthorizedException());
//     client.disconnect();
//   }
// }