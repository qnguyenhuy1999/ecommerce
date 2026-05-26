import { Injectable } from '@nestjs/common'
import type { ChannelDeliveryResult, NotificationDeliveryPayload } from './types'

@Injectable()
export class PushChannel {
  deliver(_payload: NotificationDeliveryPayload): ChannelDeliveryResult {
    return { channel: 'PUSH', status: 'SKIPPED' }
  }
}
