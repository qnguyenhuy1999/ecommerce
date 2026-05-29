/**
 * Plain TypeScript pagination query type — no decorators, no NestJS deps.
 * NestJS-decorated DTOs (PaginationQueryDto, PaginationMetaDto) live in @ecom/nestjs-core.
 * PaginationMeta is exported from @ecom/contracts/http (response.ts).
 */

export interface PaginationQuery {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
}
