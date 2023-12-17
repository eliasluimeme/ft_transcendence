import {
  Controller,
  Get,
  Param,
  // Post,
  // Body,
  // Patch,
  // Param,
  // Delete,
  Req,
} from '@nestjs/common';
import { SearchService } from './search.service';
// import { CreateSearchDto } from './dto/create-search.dto';
// import { UpdateSearchDto } from './dto/update-search.dto';
import { User } from '@prisma/client';
import { Request } from 'express';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}
  @Get()
  findAll() {
    return ['hello', 'world'];
  }

  @Get('myId/:id')
  getMyId(@Param('id') id: number) {
    return id;
  }

  @Get('myId')
  async getMe(@Req() req: Request) {
    // return req.user;
    // try {
    //   if (!req.user) {
    //     return '';
    //   }
    //   console.log('req.user.id', req.user.id);
    //   const user: User = await this.searchService.findUserById(req.user.id);
    //   return user;
    // } catch (err) {
    //   console.log('error: ', err);
    // }
  }

  // @Post()
  // create(@Body() createSearchDto: CreateSearchDto) {
  //   return this.searchService.create(createSearchDto);
  // }

  // @Get()
  // findAll() {
  //   return this.searchService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.searchService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSearchDto: UpdateSearchDto) {
  //   return this.searchService.update(+id, updateSearchDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.searchService.remove(+id);
  // }
}
