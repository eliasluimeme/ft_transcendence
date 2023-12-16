import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
import { User } from '@prisma/client';
import { Request } from 'express';
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('myId')
  async getMe(@Req() req: Request) {
    try {
      if (!req.user) {
        return '';
      }
      const user: User = await this.searchService.findUserById(req.user['sub']);
      return user;
    } catch (err) {
      console.log('error: ', err);
    }
  }

  @Post()
  create(@Body() createSearchDto: CreateSearchDto) {
    return this.searchService.create(createSearchDto);
  }

  @Get()
  findAll() {
    return this.searchService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.searchService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSearchDto: UpdateSearchDto) {
    return this.searchService.update(+id, updateSearchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.searchService.remove(+id);
  }
}
