import { ReturnStatus } from '@ecom/contracts/enums/order'
import { type Prisma } from '@ecom/database'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import { buildOffsetResponse } from '@ecom/shared/pagination/prisma'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import type { ReturnQueryDto } from './dto/return-query.dto'
import { ReturnRepository } from './repositories/return.repository'

const VALID_TRANSITIONS: Partial<Record<ReturnStatus, ReturnStatus[]>> = {
  [ReturnStatus.REQUESTED]: [ReturnStatus.REVIEWING, ReturnStatus.REJECTED],
  [ReturnStatus.REVIEWING]: [ReturnStatus.APPROVED, ReturnStatus.REJECTED],
  [ReturnStatus.APPROVED]: [ReturnStatus.RETURN_SHIPPING],
  [ReturnStatus.REJECTED]: [ReturnStatus.CLOSED],
  [ReturnStatus.RETURN_SHIPPING]: [ReturnStatus.RECEIVED],
  [ReturnStatus.RECEIVED]: [ReturnStatus.REFUNDED],
  [ReturnStatus.REFUNDED]: [ReturnStatus.CLOSED],
  [ReturnStatus.CLOSED]: [],
}

@Injectable()
export class ReturnService {
  constructor(private readonly returnRepository: ReturnRepository) {}

  async list(shopId: string, query: ReturnQueryDto) {
    const {
      page = 1,
      limit = PAGINATION_DEFAULTS.DEFAULT_LIMIT,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      status,
    } = query

    const where: Prisma.ReturnRequestWhereInput = { shopId }
    if (status !== undefined) where.status = status
    if (search) where.description = { contains: search, mode: 'insensitive' }

    const { items, total } = await this.returnRepository.findMany(where, page, limit, {
      [sortBy]: sortOrder,
    })

    return buildOffsetResponse(items, page, limit, total)
  }

  async getById(shopId: string, returnId: string) {
    const returnRequest = await this.returnRepository.findOne(returnId, shopId)

    if (!returnRequest) {
      throw new NotFoundException('Return request not found')
    }

    return returnRequest
  }

  async updateStatus(
    shopId: string,
    returnId: string,
    newStatus: ReturnStatus,
    note?: string,
    _performedBy?: string,
  ) {
    const returnRequest = await this.returnRepository.findOneBasic(returnId, shopId)

    if (!returnRequest) {
      throw new NotFoundException('Return request not found')
    }

    const currentStatus = returnRequest.status
    const allowed = VALID_TRANSITIONS[currentStatus] ?? []

    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${currentStatus} to ${newStatus}. Allowed: ${allowed.join(', ')}`,
      )
    }

    return this.returnRepository.$transaction(async (tx: Prisma.TransactionClient) => {
      const data: Prisma.ReturnRequestUpdateInput = { status: newStatus }

      if (newStatus === ReturnStatus.REFUNDED || newStatus === ReturnStatus.CLOSED) {
        data.resolvedAt = new Date()
      }

      const updated = await tx.returnRequest.update({
        where: { id: returnId },
        data,
      })

      const timelineData: Prisma.ReturnTimelineUncheckedCreateInput = {
        returnRequestId: returnId,
        fromStatus: currentStatus,
        toStatus: newStatus,
      }

      if (note !== undefined) {
        timelineData.note = note
      }

      await tx.returnTimeline.create({ data: timelineData })

      return updated
    })
  }

  async addEvidence(
    shopId: string,
    returnId: string,
    _uploadedBy: string,
    url: string,
    description?: string,
  ) {
    const returnRequest = await this.returnRepository.findOneBasic(returnId, shopId)

    if (!returnRequest) {
      throw new NotFoundException('Return request not found')
    }

    const evidenceData: Prisma.ReturnEvidenceUncheckedCreateInput = {
      returnRequestId: returnId,
      url,
    }

    if (description !== undefined) {
      evidenceData.description = description
    }

    return this.returnRepository.createEvidence(evidenceData)
  }

  async getStats(shopId: string) {
    const [total, pending, approved, refunded] = await Promise.all([
      this.returnRepository.countAll(shopId),
      this.returnRepository.countByStatus(shopId, [ReturnStatus.REQUESTED, ReturnStatus.REVIEWING]),
      this.returnRepository.countSingleStatus(shopId, ReturnStatus.APPROVED),
      this.returnRepository.countSingleStatus(shopId, ReturnStatus.REFUNDED),
    ])

    return { total, pending, approved, refunded }
  }
}
