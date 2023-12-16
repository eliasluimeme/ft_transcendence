import { Injectable } from '@nestjs/common';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}
  async findUserById(userId: number): Promise<User> {
    try {
      const user: User = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      return user;
    } catch (error) {
      console.log(error);
    }
  }
  create(createSearchDto: CreateSearchDto) {
    return 'This action adds a new search';
  }

  async findAll() {
    try {
      const allUsers: User[] = await this.prisma.user.findMany();
      if (allUsers) {
        return allUsers;
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getMyFriends(myId: number, friendName: string) {
    const friend = await this.prisma.user.findMany({
      where: {
        id: myId,
        friends: { // friendship
          some: {
            name: {
              contains: friendName,
            },
          },
        },
      },
    });
    if (!friend) {
      console.log('friend not found');
    }

    // search in friendship request
  }

  findOne(userName: number) {
    return `This action returns a #${userName} search`;
  }

  update(id: number, updateSearchDto: UpdateSearchDto) {
    return `This action updates a #${id} search`;
  }

  remove(id: number) {
    return `This action removes a #${id} search`;
  }
}
