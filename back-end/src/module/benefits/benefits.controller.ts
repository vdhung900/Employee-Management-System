import { Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { BenefitsService } from './benefits.service';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Benefits')
@Controller('benefits')
export class BenefitsController {
    constructor(private readonly benefitsService: BenefitsService) { }

    @Get()
    async findAll() {
        const data = await this.benefitsService.findAll();
        return { success: true, data };
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const data = await this.benefitsService.findOne(id);
        return { success: true, data };
    }

    @Post()
    async create(@Body() body: any, @Req() req: Request) {
        const data = await this.benefitsService.create(body, (req as any).user);
        return { success: true, data };
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
        const data = await this.benefitsService.update(id, body, (req as any).user);
        return { success: true, data };
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Req() req: Request) {
        const data = await this.benefitsService.delete(id, (req as any).user);
        return { success: true, data };
    }
} 