export class NotificationNotFoundException extends Error {
  readonly code = 'NOTIFICATION_NOT_FOUND'
  constructor(id?: string) {
    super(id ? `Notification ${id} not found` : 'Notification not found')
  }
}

export class NotNotificationOwnerException extends Error {
  readonly code = 'NOT_NOTIFICATION_OWNER'
  constructor() {
    super('You do not own this notification')
  }
}
