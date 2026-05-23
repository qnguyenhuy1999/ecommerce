import { Injectable, NotFoundException } from '@nestjs/common'
import { type CommissionRule, PrismaService } from '@ecom/database'
import { CreateCommissionRuleDto, UpdateCommissionRuleDto } from './dto/commission-fees.dto'

function serializeRule(rule: CommissionRule) {
  return {
    ...rule,
    commissionPct: rule.commissionPct.toNumber(),
    paymentFeePct: rule.paymentFeePct.toNumber(),
  }
}

@Injectable()
export class CommissionFeesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const rules = await this.prisma.commissionRule.findMany({ orderBy: { createdAt: 'asc' } })
    return rules.map(serializeRule)
  }

  async create(dto: CreateCommissionRuleDto) {
    const rule = await this.prisma.commissionRule.create({
      data: {
        scope: dto.scope,
        label: dto.label,
        targetId: dto.targetId ?? null,
        commissionPct: dto.commissionPct,
        paymentFeePct: dto.paymentFeePct,
        effectiveFrom: new Date(dto.effectiveFrom),
      },
    })
    return serializeRule(rule)
  }

  async update(id: string, dto: UpdateCommissionRuleDto) {
    const existing = await this.prisma.commissionRule.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('Commission rule not found')

    const rule = await this.prisma.commissionRule.update({
      where: { id },
      data: {
        ...(dto.label !== undefined && { label: dto.label }),
        ...(dto.commissionPct !== undefined && { commissionPct: dto.commissionPct }),
        ...(dto.paymentFeePct !== undefined && { paymentFeePct: dto.paymentFeePct }),
        ...(dto.effectiveFrom !== undefined && { effectiveFrom: new Date(dto.effectiveFrom) }),
      },
    })
    return serializeRule(rule)
  }
}
