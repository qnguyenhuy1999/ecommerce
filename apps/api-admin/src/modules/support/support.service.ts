import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService, type Prisma } from '@ecom/database'
import { offsetPaginate, buildOffsetResponse } from '@ecom/shared/pagination/prisma'
import { withDefined } from '@ecom/shared/utils/optional-object'
import type {
  SupportTicketQueryDto,
  SendReplyDto,
  ChangeStatusDto,
  ChangeAssigneeDto,
} from './dto/support.dto'

@Injectable()
export class SupportService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: SupportTicketQueryDto) {
    const where: Prisma.SupportTicketWhereInput = {}
    if (query.status) where.status = query.status
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { submitterName: { contains: query.search, mode: 'insensitive' } },
      ]
    }

    const { items, total } = await offsetPaginate(this.prisma.supportTicket, {
      ...withDefined({ page: query.page, limit: query.limit }),
      where,
      orderBy: { createdAt: 'desc' },
    })

    return buildOffsetResponse(items, query.page ?? 1, query.limit ?? 20, total)
  }

  async findMessages(ticketId: string) {
    const ticket = await this.prisma.supportTicket.findUnique({ where: { id: ticketId } })
    if (!ticket) throw new NotFoundException('Ticket not found')
    return this.prisma.supportMessage.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'asc' },
    })
  }

  async sendReply(ticketId: string, dto: SendReplyDto, adminId: string) {
    const [ticket, admin] = await Promise.all([
      this.prisma.supportTicket.findUnique({ where: { id: ticketId } }),
      this.prisma.admin.findUnique({
        where: { id: adminId },
        select: { firstName: true, lastName: true },
      }),
    ])
    if (!ticket) throw new NotFoundException('Ticket not found')
    const senderName = admin ? `${admin.firstName} ${admin.lastName}` : 'Admin'
    return this.prisma.supportMessage.create({
      data: {
        ticketId,
        sender: 'AGENT',
        senderName,
        content: dto.content,
        isInternal: dto.isInternal,
      },
    })
  }

  async changeStatus(ticketId: string, dto: ChangeStatusDto) {
    const ticket = await this.prisma.supportTicket.findUnique({ where: { id: ticketId } })
    if (!ticket) throw new NotFoundException('Ticket not found')
    return this.prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status: dto.status },
    })
  }

  async changeAssignee(ticketId: string, dto: ChangeAssigneeDto) {
    const ticket = await this.prisma.supportTicket.findUnique({ where: { id: ticketId } })
    if (!ticket) throw new NotFoundException('Ticket not found')
    return this.prisma.supportTicket.update({
      where: { id: ticketId },
      data: { assignedAdminId: dto.assignedAdminId },
    })
  }
}
