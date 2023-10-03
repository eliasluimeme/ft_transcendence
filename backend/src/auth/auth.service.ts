import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    async validateUser(profile: any): Promise<any> {

      const user = await this.prisma.user.findUnique({
          where: {
              email: profile.emails[0].value
          }
      });

      if (!user)
        return this.createUser(profile);
      else {
        console.log('User found: ', user);
        return user;
      }
    }

    async createUser(profile: any): Promise<any> {

        const newUser = await this.prisma.user.create({
            data: {
                email: profile.emails[0].value,
                userName: profile.username,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                photo: profile._json.image.link,
            }
        })

        console.log('New user created: ', newUser);
        if (newUser)
            return newUser;
        else
            throw new Error('Cannot create user');
    }
}
