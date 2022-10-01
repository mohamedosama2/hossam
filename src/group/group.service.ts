import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PaginateResult } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { FilterQueryOptionsGroup } from './dto/filter.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupRepository } from './group.repository';
import { GroupDocument } from './models/group.model';

@Injectable()
export class GroupService
{
  constructor(
    private readonly GroupRepository: GroupRepository,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService
  ) { }
  async create(createGroupDto: CreateGroupDto)
  {
    let ids = createGroupDto.students.map((doc) => { return doc.student })

    console.log(ids)
    let validateStudent = await this.usersService.getCustomeDocs(ids as [])
    for (let i = 0; validateStudent.length; i++)
    {
      if (validateStudent[i].enabled === false)
      {
        throw new BadRequestException('user desabled !!')
      }
    }

    return await this.GroupRepository.create(createGroupDto);
  }

  async findAll(
    queryFiltersAndOptions: FilterQueryOptionsGroup,
  ): Promise<PaginateResult<GroupDocument> | GroupDocument[]>
  {
    const groups = await this.GroupRepository.findAllWithPaginationOption(
      queryFiltersAndOptions,
      ['name', 'enable'],
      { populate: ['students.student', 'university'] },
    );
    return groups;
  }

  async findOne(_id: string)
  {
    const isExisted = await this.GroupRepository.findOne(
      { _id },
      {
        populate: [
          { path: 'students.student' },
          { path: 'university', select: 'nameAr nameEn' },
        ],
      },
    );
    if (!isExisted || isExisted.enable == false) throw new NotFoundException();
    return isExisted;
  }

  async update(_id: string, updateGroupDto: UpdateGroupDto)
  {
    await this.findOne(_id);
    return await this.GroupRepository.updateOne({ _id }, updateGroupDto);
  }

  async remove(_id: string)
  {
    await this.findOne(_id);
    return await this.GroupRepository.updateOne({ _id }, { enable: false });

    // return await this.GroupRepository.deleteOne({ _id });
  }

  async removeStudent(_id: string)
  {
    await this.GroupRepository.pullStudent(_id);
  }
}
