-- Add MESSAGE to seller NotificationType enum
ALTER TYPE "NotificationType" ADD VALUE 'MESSAGE';

-- Add NEW_MESSAGE to buyer UserNotificationType enum
ALTER TYPE "UserNotificationType" ADD VALUE 'NEW_MESSAGE';
