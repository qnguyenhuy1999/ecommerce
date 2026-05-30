/* eslint-disable @typescript-eslint/unbound-method */
import 'reflect-metadata'
import { DECORATORS } from '@nestjs/swagger/dist/constants'
import { describe, expect, it } from 'vitest'
import { PERMISSIONS_KEY } from '../auth/decorators/permissions.decorator'
import { ChatController } from './chat.controller'

describe('ChatController metadata', () => {
  it('uses concrete dto decorators instead of Object', () => {
    const listResponses = Reflect.getMetadata(
      DECORATORS.API_RESPONSE,
      ChatController.prototype.listConversations,
    ) as string[]
    const conversationResponses = Reflect.getMetadata(
      DECORATORS.API_RESPONSE,
      ChatController.prototype.getConversation,
    ) as string[]
    const createResponses = Reflect.getMetadata(
      DECORATORS.API_RESPONSE,
      ChatController.prototype.createConversation,
    ) as string[]
    const messageResponses = Reflect.getMetadata(
      DECORATORS.API_RESPONSE,
      ChatController.prototype.getMessages,
    ) as string[]

    expect(JSON.stringify(listResponses)).toContain('ChatConversationSummaryDto')
    expect(JSON.stringify(createResponses)).toContain('ChatConversationSummaryDto')
    expect(JSON.stringify(conversationResponses)).toContain('ChatConversationDetailDto')
    expect(JSON.stringify(messageResponses)).toContain('ChatMessageDto')
    expect(JSON.stringify(listResponses)).not.toContain('Object')
    expect(JSON.stringify(createResponses)).not.toContain('Object')
    expect(JSON.stringify(conversationResponses)).not.toContain('Object')
    expect(JSON.stringify(messageResponses)).not.toContain('Object')
  })

  it('requires SUPPORT_MANAGE on chat endpoints', () => {
    const permissions = Reflect.getMetadata(
      PERMISSIONS_KEY,
      ChatController.prototype.createConversation,
    ) as string[]

    expect(permissions).toEqual(['SUPPORT_MANAGE'])
  })
})
