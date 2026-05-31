/**
 * Auto-generated from packages/database/prisma/schema.prisma
 * DO NOT EDIT MANUALLY — run: pnpm --filter @ecom/database generate:enums
 */

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
  BANNED: 'BANNED',
} as const
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus]

export const USER_STATUS_VALUES = [
  UserStatus.ACTIVE,
  UserStatus.INACTIVE,
  UserStatus.SUSPENDED,
  UserStatus.BANNED,
] as const

export const ShopStatus = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  CLOSED: 'CLOSED',
} as const
export type ShopStatus = (typeof ShopStatus)[keyof typeof ShopStatus]

export const SHOP_STATUS_VALUES = [
  ShopStatus.PENDING,
  ShopStatus.ACTIVE,
  ShopStatus.SUSPENDED,
  ShopStatus.CLOSED,
] as const

export const ProductStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
  REJECTED: 'REJECTED',
} as const
export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus]

export const PRODUCT_STATUS_VALUES = [
  ProductStatus.DRAFT,
  ProductStatus.PUBLISHED,
  ProductStatus.ARCHIVED,
  ProductStatus.REJECTED,
] as const

export const OrderStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PACKING: 'PACKING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]

export const ORDER_STATUS_VALUES = [
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
  OrderStatus.PACKING,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
  OrderStatus.CANCELLED,
] as const

export const InventoryTransactionType = {
  STOCK_IN: 'STOCK_IN',
  STOCK_OUT: 'STOCK_OUT',
  RESERVATION: 'RESERVATION',
  RESERVATION_RELEASE: 'RESERVATION_RELEASE',
  ADJUSTMENT: 'ADJUSTMENT',
} as const
export type InventoryTransactionType =
  (typeof InventoryTransactionType)[keyof typeof InventoryTransactionType]

export const INVENTORY_TRANSACTION_TYPE_VALUES = [
  InventoryTransactionType.STOCK_IN,
  InventoryTransactionType.STOCK_OUT,
  InventoryTransactionType.RESERVATION,
  InventoryTransactionType.RESERVATION_RELEASE,
  InventoryTransactionType.ADJUSTMENT,
] as const

export const ShipmentStatus = {
  PENDING: 'PENDING',
  PICKED_UP: 'PICKED_UP',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED: 'DELIVERED',
  FAILED: 'FAILED',
} as const
export type ShipmentStatus = (typeof ShipmentStatus)[keyof typeof ShipmentStatus]

export const SHIPMENT_STATUS_VALUES = [
  ShipmentStatus.PENDING,
  ShipmentStatus.PICKED_UP,
  ShipmentStatus.IN_TRANSIT,
  ShipmentStatus.DELIVERED,
  ShipmentStatus.FAILED,
] as const

export const NotificationType = {
  NEW_ORDER: 'NEW_ORDER',
  ORDER_CANCELLED: 'ORDER_CANCELLED',
  LOW_STOCK: 'LOW_STOCK',
  PRODUCT_REJECTED: 'PRODUCT_REJECTED',
  SYSTEM: 'SYSTEM',
  MESSAGE: 'MESSAGE',
} as const
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType]

export const NOTIFICATION_TYPE_VALUES = [
  NotificationType.NEW_ORDER,
  NotificationType.ORDER_CANCELLED,
  NotificationType.LOW_STOCK,
  NotificationType.PRODUCT_REJECTED,
  NotificationType.SYSTEM,
  NotificationType.MESSAGE,
] as const

export const UserNotificationType = {
  ORDER_CONFIRMED: 'ORDER_CONFIRMED',
  ORDER_SHIPPED: 'ORDER_SHIPPED',
  ORDER_DELIVERED: 'ORDER_DELIVERED',
  ORDER_CANCELLED: 'ORDER_CANCELLED',
  RETURN_APPROVED: 'RETURN_APPROVED',
  SYSTEM: 'SYSTEM',
  NEW_MESSAGE: 'NEW_MESSAGE',
} as const
export type UserNotificationType = (typeof UserNotificationType)[keyof typeof UserNotificationType]

export const USER_NOTIFICATION_TYPE_VALUES = [
  UserNotificationType.ORDER_CONFIRMED,
  UserNotificationType.ORDER_SHIPPED,
  UserNotificationType.ORDER_DELIVERED,
  UserNotificationType.ORDER_CANCELLED,
  UserNotificationType.RETURN_APPROVED,
  UserNotificationType.SYSTEM,
  UserNotificationType.NEW_MESSAGE,
] as const

export const NotificationChannel = {
  IN_APP: 'IN_APP',
  EMAIL: 'EMAIL',
  PUSH: 'PUSH',
  SMS: 'SMS',
} as const
export type NotificationChannel = (typeof NotificationChannel)[keyof typeof NotificationChannel]

export const NOTIFICATION_CHANNEL_VALUES = [
  NotificationChannel.IN_APP,
  NotificationChannel.EMAIL,
  NotificationChannel.PUSH,
  NotificationChannel.SMS,
] as const

export const DeliveryState = {
  QUEUED: 'QUEUED',
  SENT: 'SENT',
  DELIVERED: 'DELIVERED',
  FAILED: 'FAILED',
  SKIPPED: 'SKIPPED',
} as const
export type DeliveryState = (typeof DeliveryState)[keyof typeof DeliveryState]

export const DELIVERY_STATE_VALUES = [
  DeliveryState.QUEUED,
  DeliveryState.SENT,
  DeliveryState.DELIVERED,
  DeliveryState.FAILED,
  DeliveryState.SKIPPED,
] as const

export const OutboxStatus = {
  PENDING: 'PENDING',
  PUBLISHED: 'PUBLISHED',
  FAILED: 'FAILED',
} as const
export type OutboxStatus = (typeof OutboxStatus)[keyof typeof OutboxStatus]

export const OUTBOX_STATUS_VALUES = [
  OutboxStatus.PENDING,
  OutboxStatus.PUBLISHED,
  OutboxStatus.FAILED,
] as const

export const CouponType = {
  PERCENTAGE: 'PERCENTAGE',
  FIXED_AMOUNT: 'FIXED_AMOUNT',
  FREE_SHIPPING: 'FREE_SHIPPING',
} as const
export type CouponType = (typeof CouponType)[keyof typeof CouponType]

export const COUPON_TYPE_VALUES = [
  CouponType.PERCENTAGE,
  CouponType.FIXED_AMOUNT,
  CouponType.FREE_SHIPPING,
] as const

export const CouponScope = {
  ALL_PRODUCTS: 'ALL_PRODUCTS',
  SPECIFIC_PRODUCTS: 'SPECIFIC_PRODUCTS',
  SPECIFIC_CATEGORIES: 'SPECIFIC_CATEGORIES',
} as const
export type CouponScope = (typeof CouponScope)[keyof typeof CouponScope]

export const COUPON_SCOPE_VALUES = [
  CouponScope.ALL_PRODUCTS,
  CouponScope.SPECIFIC_PRODUCTS,
  CouponScope.SPECIFIC_CATEGORIES,
] as const

export const CouponStatus = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  EXPIRED: 'EXPIRED',
  DEPLETED: 'DEPLETED',
} as const
export type CouponStatus = (typeof CouponStatus)[keyof typeof CouponStatus]

export const COUPON_STATUS_VALUES = [
  CouponStatus.DRAFT,
  CouponStatus.ACTIVE,
  CouponStatus.PAUSED,
  CouponStatus.EXPIRED,
  CouponStatus.DEPLETED,
] as const

export const ReviewStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  HIDDEN: 'HIDDEN',
} as const
export type ReviewStatus = (typeof ReviewStatus)[keyof typeof ReviewStatus]

export const REVIEW_STATUS_VALUES = [
  ReviewStatus.PENDING,
  ReviewStatus.APPROVED,
  ReviewStatus.REJECTED,
  ReviewStatus.HIDDEN,
] as const

export const ReturnStatus = {
  REQUESTED: 'REQUESTED',
  REVIEWING: 'REVIEWING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  RETURN_SHIPPING: 'RETURN_SHIPPING',
  RECEIVED: 'RECEIVED',
  REFUNDED: 'REFUNDED',
  CLOSED: 'CLOSED',
} as const
export type ReturnStatus = (typeof ReturnStatus)[keyof typeof ReturnStatus]

export const RETURN_STATUS_VALUES = [
  ReturnStatus.REQUESTED,
  ReturnStatus.REVIEWING,
  ReturnStatus.APPROVED,
  ReturnStatus.REJECTED,
  ReturnStatus.RETURN_SHIPPING,
  ReturnStatus.RECEIVED,
  ReturnStatus.REFUNDED,
  ReturnStatus.CLOSED,
] as const

export const ReturnReason = {
  DEFECTIVE: 'DEFECTIVE',
  WRONG_ITEM: 'WRONG_ITEM',
  NOT_AS_DESCRIBED: 'NOT_AS_DESCRIBED',
  CHANGED_MIND: 'CHANGED_MIND',
  DAMAGED_IN_SHIPPING: 'DAMAGED_IN_SHIPPING',
  OTHER: 'OTHER',
} as const
export type ReturnReason = (typeof ReturnReason)[keyof typeof ReturnReason]

export const RETURN_REASON_VALUES = [
  ReturnReason.DEFECTIVE,
  ReturnReason.WRONG_ITEM,
  ReturnReason.NOT_AS_DESCRIBED,
  ReturnReason.CHANGED_MIND,
  ReturnReason.DAMAGED_IN_SHIPPING,
  ReturnReason.OTHER,
] as const

export const RefundMethod = {
  ORIGINAL_PAYMENT: 'ORIGINAL_PAYMENT',
  STORE_CREDIT: 'STORE_CREDIT',
  BANK_TRANSFER: 'BANK_TRANSFER',
} as const
export type RefundMethod = (typeof RefundMethod)[keyof typeof RefundMethod]

export const REFUND_METHOD_VALUES = [
  RefundMethod.ORIGINAL_PAYMENT,
  RefundMethod.STORE_CREDIT,
  RefundMethod.BANK_TRANSFER,
] as const

export const ApprovalStatus = {
  PENDING_REVIEW: 'PENDING_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  REVISION_REQUESTED: 'REVISION_REQUESTED',
} as const
export type ApprovalStatus = (typeof ApprovalStatus)[keyof typeof ApprovalStatus]

export const APPROVAL_STATUS_VALUES = [
  ApprovalStatus.PENDING_REVIEW,
  ApprovalStatus.APPROVED,
  ApprovalStatus.REJECTED,
  ApprovalStatus.REVISION_REQUESTED,
] as const

export const BulkJobStatus = {
  QUEUED: 'QUEUED',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  PARTIALLY_COMPLETED: 'PARTIALLY_COMPLETED',
} as const
export type BulkJobStatus = (typeof BulkJobStatus)[keyof typeof BulkJobStatus]

export const BULK_JOB_STATUS_VALUES = [
  BulkJobStatus.QUEUED,
  BulkJobStatus.PROCESSING,
  BulkJobStatus.COMPLETED,
  BulkJobStatus.FAILED,
  BulkJobStatus.PARTIALLY_COMPLETED,
] as const

export const BulkJobType = {
  PRODUCT_IMPORT: 'PRODUCT_IMPORT',
  PRODUCT_EXPORT: 'PRODUCT_EXPORT',
  INVENTORY_UPDATE: 'INVENTORY_UPDATE',
  PRICE_UPDATE: 'PRICE_UPDATE',
} as const
export type BulkJobType = (typeof BulkJobType)[keyof typeof BulkJobType]

export const BULK_JOB_TYPE_VALUES = [
  BulkJobType.PRODUCT_IMPORT,
  BulkJobType.PRODUCT_EXPORT,
  BulkJobType.INVENTORY_UPDATE,
  BulkJobType.PRICE_UPDATE,
] as const

export const ChatMessageType = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  PRODUCT: 'PRODUCT',
  SYSTEM: 'SYSTEM',
} as const
export type ChatMessageType = (typeof ChatMessageType)[keyof typeof ChatMessageType]

export const CHAT_MESSAGE_TYPE_VALUES = [
  ChatMessageType.TEXT,
  ChatMessageType.IMAGE,
  ChatMessageType.PRODUCT,
  ChatMessageType.SYSTEM,
] as const

export const InventoryTransferStatus = {
  PENDING: 'PENDING',
  IN_TRANSIT: 'IN_TRANSIT',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const
export type InventoryTransferStatus =
  (typeof InventoryTransferStatus)[keyof typeof InventoryTransferStatus]

export const INVENTORY_TRANSFER_STATUS_VALUES = [
  InventoryTransferStatus.PENDING,
  InventoryTransferStatus.IN_TRANSIT,
  InventoryTransferStatus.COMPLETED,
  InventoryTransferStatus.CANCELLED,
] as const

export const UserEventType = {
  VIEW: 'VIEW',
  CLICK: 'CLICK',
  ADD_TO_CART: 'ADD_TO_CART',
  PURCHASE: 'PURCHASE',
  SEARCH: 'SEARCH',
  WISHLIST: 'WISHLIST',
  SHARE: 'SHARE',
  REVIEW: 'REVIEW',
} as const
export type UserEventType = (typeof UserEventType)[keyof typeof UserEventType]

export const USER_EVENT_TYPE_VALUES = [
  UserEventType.VIEW,
  UserEventType.CLICK,
  UserEventType.ADD_TO_CART,
  UserEventType.PURCHASE,
  UserEventType.SEARCH,
  UserEventType.WISHLIST,
  UserEventType.SHARE,
  UserEventType.REVIEW,
] as const

export const UserEventEntityType = {
  PRODUCT: 'PRODUCT',
  SHOP: 'SHOP',
  CATEGORY: 'CATEGORY',
  SEARCH_RESULT: 'SEARCH_RESULT',
  AD: 'AD',
} as const
export type UserEventEntityType = (typeof UserEventEntityType)[keyof typeof UserEventEntityType]

export const USER_EVENT_ENTITY_TYPE_VALUES = [
  UserEventEntityType.PRODUCT,
  UserEventEntityType.SHOP,
  UserEventEntityType.CATEGORY,
  UserEventEntityType.SEARCH_RESULT,
  UserEventEntityType.AD,
] as const

export const ProductScoreType = {
  POPULARITY: 'POPULARITY',
  RELEVANCE: 'RELEVANCE',
  QUALITY: 'QUALITY',
  TRENDING: 'TRENDING',
  CONVERSION_RATE: 'CONVERSION_RATE',
} as const
export type ProductScoreType = (typeof ProductScoreType)[keyof typeof ProductScoreType]

export const PRODUCT_SCORE_TYPE_VALUES = [
  ProductScoreType.POPULARITY,
  ProductScoreType.RELEVANCE,
  ProductScoreType.QUALITY,
  ProductScoreType.TRENDING,
  ProductScoreType.CONVERSION_RATE,
] as const

export const ProductRelationType = {
  FREQUENTLY_BOUGHT_TOGETHER: 'FREQUENTLY_BOUGHT_TOGETHER',
  SIMILAR: 'SIMILAR',
  UPSELL: 'UPSELL',
  CROSS_SELL: 'CROSS_SELL',
  ACCESSORY: 'ACCESSORY',
} as const
export type ProductRelationType = (typeof ProductRelationType)[keyof typeof ProductRelationType]

export const PRODUCT_RELATION_TYPE_VALUES = [
  ProductRelationType.FREQUENTLY_BOUGHT_TOGETHER,
  ProductRelationType.SIMILAR,
  ProductRelationType.UPSELL,
  ProductRelationType.CROSS_SELL,
  ProductRelationType.ACCESSORY,
] as const

export const LoyaltyRewardType = {
  COUPON: 'COUPON',
  POINTS_MULTIPLIER: 'POINTS_MULTIPLIER',
  FREE_SHIPPING: 'FREE_SHIPPING',
  CASHBACK: 'CASHBACK',
  PHYSICAL_GIFT: 'PHYSICAL_GIFT',
} as const
export type LoyaltyRewardType = (typeof LoyaltyRewardType)[keyof typeof LoyaltyRewardType]

export const LOYALTY_REWARD_TYPE_VALUES = [
  LoyaltyRewardType.COUPON,
  LoyaltyRewardType.POINTS_MULTIPLIER,
  LoyaltyRewardType.FREE_SHIPPING,
  LoyaltyRewardType.CASHBACK,
  LoyaltyRewardType.PHYSICAL_GIFT,
] as const

export const FlashSaleStatus = {
  DRAFT: 'DRAFT',
  SCHEDULED: 'SCHEDULED',
  ACTIVE: 'ACTIVE',
  ENDED: 'ENDED',
  CANCELLED: 'CANCELLED',
} as const
export type FlashSaleStatus = (typeof FlashSaleStatus)[keyof typeof FlashSaleStatus]

export const FLASH_SALE_STATUS_VALUES = [
  FlashSaleStatus.DRAFT,
  FlashSaleStatus.SCHEDULED,
  FlashSaleStatus.ACTIVE,
  FlashSaleStatus.ENDED,
  FlashSaleStatus.CANCELLED,
] as const

export const FlashSaleSlotStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  ACTIVE: 'ACTIVE',
  SOLD_OUT: 'SOLD_OUT',
  ENDED: 'ENDED',
  CANCELLED: 'CANCELLED',
} as const
export type FlashSaleSlotStatus = (typeof FlashSaleSlotStatus)[keyof typeof FlashSaleSlotStatus]

export const FLASH_SALE_SLOT_STATUS_VALUES = [
  FlashSaleSlotStatus.PENDING,
  FlashSaleSlotStatus.APPROVED,
  FlashSaleSlotStatus.REJECTED,
  FlashSaleSlotStatus.ACTIVE,
  FlashSaleSlotStatus.SOLD_OUT,
  FlashSaleSlotStatus.ENDED,
  FlashSaleSlotStatus.CANCELLED,
] as const

export const AdCampaignStatus = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  ENDED: 'ENDED',
  DEPLETED: 'DEPLETED',
} as const
export type AdCampaignStatus = (typeof AdCampaignStatus)[keyof typeof AdCampaignStatus]

export const AD_CAMPAIGN_STATUS_VALUES = [
  AdCampaignStatus.DRAFT,
  AdCampaignStatus.ACTIVE,
  AdCampaignStatus.PAUSED,
  AdCampaignStatus.ENDED,
  AdCampaignStatus.DEPLETED,
] as const

export const AdType = {
  SPONSORED_PRODUCT: 'SPONSORED_PRODUCT',
  SEARCH_AD: 'SEARCH_AD',
  RECOMMENDATION_AD: 'RECOMMENDATION_AD',
  BANNER: 'BANNER',
} as const
export type AdType = (typeof AdType)[keyof typeof AdType]

export const AD_TYPE_VALUES = [
  AdType.SPONSORED_PRODUCT,
  AdType.SEARCH_AD,
  AdType.RECOMMENDATION_AD,
  AdType.BANNER,
] as const

export const AffiliateStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  SUSPENDED: 'SUSPENDED',
} as const
export type AffiliateStatus = (typeof AffiliateStatus)[keyof typeof AffiliateStatus]

export const AFFILIATE_STATUS_VALUES = [
  AffiliateStatus.PENDING,
  AffiliateStatus.APPROVED,
  AffiliateStatus.REJECTED,
  AffiliateStatus.SUSPENDED,
] as const

export const CommissionPayoutStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const
export type CommissionPayoutStatus =
  (typeof CommissionPayoutStatus)[keyof typeof CommissionPayoutStatus]

export const COMMISSION_PAYOUT_STATUS_VALUES = [
  CommissionPayoutStatus.PENDING,
  CommissionPayoutStatus.PROCESSING,
  CommissionPayoutStatus.COMPLETED,
  CommissionPayoutStatus.FAILED,
] as const

export const SubscriptionStatus = {
  ACTIVE: 'ACTIVE',
  PAST_DUE: 'PAST_DUE',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
  TRIALING: 'TRIALING',
} as const
export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus]

export const SUBSCRIPTION_STATUS_VALUES = [
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.PAST_DUE,
  SubscriptionStatus.CANCELLED,
  SubscriptionStatus.EXPIRED,
  SubscriptionStatus.TRIALING,
] as const

export const InvoiceStatus = {
  DRAFT: 'DRAFT',
  OPEN: 'OPEN',
  PAID: 'PAID',
  VOID: 'VOID',
  UNCOLLECTIBLE: 'UNCOLLECTIBLE',
} as const
export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus]

export const INVOICE_STATUS_VALUES = [
  InvoiceStatus.DRAFT,
  InvoiceStatus.OPEN,
  InvoiceStatus.PAID,
  InvoiceStatus.VOID,
  InvoiceStatus.UNCOLLECTIBLE,
] as const

export const LivestreamStatus = {
  SCHEDULED: 'SCHEDULED',
  LIVE: 'LIVE',
  ENDED: 'ENDED',
  CANCELLED: 'CANCELLED',
} as const
export type LivestreamStatus = (typeof LivestreamStatus)[keyof typeof LivestreamStatus]

export const LIVESTREAM_STATUS_VALUES = [
  LivestreamStatus.SCHEDULED,
  LivestreamStatus.LIVE,
  LivestreamStatus.ENDED,
  LivestreamStatus.CANCELLED,
] as const

export const AiTaskStatus = {
  QUEUED: 'QUEUED',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const
export type AiTaskStatus = (typeof AiTaskStatus)[keyof typeof AiTaskStatus]

export const AI_TASK_STATUS_VALUES = [
  AiTaskStatus.QUEUED,
  AiTaskStatus.PROCESSING,
  AiTaskStatus.COMPLETED,
  AiTaskStatus.FAILED,
] as const

export const AiTaskType = {
  DESCRIPTION: 'DESCRIPTION',
  TITLE: 'TITLE',
  KEYWORDS: 'KEYWORDS',
  IMAGE_TAG: 'IMAGE_TAG',
  CATEGORY_SUGGEST: 'CATEGORY_SUGGEST',
  SEO: 'SEO',
  TRANSLATION: 'TRANSLATION',
  SALES_INSIGHT: 'SALES_INSIGHT',
} as const
export type AiTaskType = (typeof AiTaskType)[keyof typeof AiTaskType]

export const AI_TASK_TYPE_VALUES = [
  AiTaskType.DESCRIPTION,
  AiTaskType.TITLE,
  AiTaskType.KEYWORDS,
  AiTaskType.IMAGE_TAG,
  AiTaskType.CATEGORY_SUGGEST,
  AiTaskType.SEO,
  AiTaskType.TRANSLATION,
  AiTaskType.SALES_INSIGHT,
] as const

export const LoyaltyTransactionType = {
  EARN: 'EARN',
  SPEND: 'SPEND',
  EXPIRE: 'EXPIRE',
  ADJUST: 'ADJUST',
  REFUND: 'REFUND',
} as const
export type LoyaltyTransactionType =
  (typeof LoyaltyTransactionType)[keyof typeof LoyaltyTransactionType]

export const LOYALTY_TRANSACTION_TYPE_VALUES = [
  LoyaltyTransactionType.EARN,
  LoyaltyTransactionType.SPEND,
  LoyaltyTransactionType.EXPIRE,
  LoyaltyTransactionType.ADJUST,
  LoyaltyTransactionType.REFUND,
] as const

export const WalletTransactionType = {
  SALE_CREDIT: 'SALE_CREDIT',
  PLATFORM_FEE: 'PLATFORM_FEE',
  WITHDRAWAL: 'WITHDRAWAL',
  REFUND_DEBIT: 'REFUND_DEBIT',
  ADJUSTMENT: 'ADJUSTMENT',
  COMMISSION_PAYOUT: 'COMMISSION_PAYOUT',
  DEPOSIT: 'DEPOSIT',
} as const
export type WalletTransactionType =
  (typeof WalletTransactionType)[keyof typeof WalletTransactionType]

export const WALLET_TRANSACTION_TYPE_VALUES = [
  WalletTransactionType.SALE_CREDIT,
  WalletTransactionType.PLATFORM_FEE,
  WalletTransactionType.WITHDRAWAL,
  WalletTransactionType.REFUND_DEBIT,
  WalletTransactionType.ADJUSTMENT,
  WalletTransactionType.COMMISSION_PAYOUT,
  WalletTransactionType.DEPOSIT,
] as const

export const WalletTransactionStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REVERSED: 'REVERSED',
} as const
export type WalletTransactionStatus =
  (typeof WalletTransactionStatus)[keyof typeof WalletTransactionStatus]

export const WALLET_TRANSACTION_STATUS_VALUES = [
  WalletTransactionStatus.PENDING,
  WalletTransactionStatus.COMPLETED,
  WalletTransactionStatus.FAILED,
  WalletTransactionStatus.REVERSED,
] as const

export const WithdrawalStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED',
  FAILED: 'FAILED',
} as const
export type WithdrawalStatus = (typeof WithdrawalStatus)[keyof typeof WithdrawalStatus]

export const WITHDRAWAL_STATUS_VALUES = [
  WithdrawalStatus.PENDING,
  WithdrawalStatus.APPROVED,
  WithdrawalStatus.PROCESSING,
  WithdrawalStatus.COMPLETED,
  WithdrawalStatus.REJECTED,
  WithdrawalStatus.FAILED,
] as const

export const AutomationTrigger = {
  ORDER_CREATED: 'ORDER_CREATED',
  ORDER_CANCELLED: 'ORDER_CANCELLED',
  LOW_STOCK: 'LOW_STOCK',
  MESSAGE_RECEIVED: 'MESSAGE_RECEIVED',
  REVIEW_RECEIVED: 'REVIEW_RECEIVED',
  SCHEDULE: 'SCHEDULE',
  PRICE_CHANGE: 'PRICE_CHANGE',
  PRODUCT_PUBLISHED: 'PRODUCT_PUBLISHED',
} as const
export type AutomationTrigger = (typeof AutomationTrigger)[keyof typeof AutomationTrigger]

export const AUTOMATION_TRIGGER_VALUES = [
  AutomationTrigger.ORDER_CREATED,
  AutomationTrigger.ORDER_CANCELLED,
  AutomationTrigger.LOW_STOCK,
  AutomationTrigger.MESSAGE_RECEIVED,
  AutomationTrigger.REVIEW_RECEIVED,
  AutomationTrigger.SCHEDULE,
  AutomationTrigger.PRICE_CHANGE,
  AutomationTrigger.PRODUCT_PUBLISHED,
] as const

export const AutomationAction = {
  SEND_MESSAGE: 'SEND_MESSAGE',
  UPDATE_PRICE: 'UPDATE_PRICE',
  UPDATE_STOCK: 'UPDATE_STOCK',
  CANCEL_ORDER: 'CANCEL_ORDER',
  SEND_NOTIFICATION: 'SEND_NOTIFICATION',
  APPLY_COUPON: 'APPLY_COUPON',
  TAG_ORDER: 'TAG_ORDER',
} as const
export type AutomationAction = (typeof AutomationAction)[keyof typeof AutomationAction]

export const AUTOMATION_ACTION_VALUES = [
  AutomationAction.SEND_MESSAGE,
  AutomationAction.UPDATE_PRICE,
  AutomationAction.UPDATE_STOCK,
  AutomationAction.CANCEL_ORDER,
  AutomationAction.SEND_NOTIFICATION,
  AutomationAction.APPLY_COUPON,
  AutomationAction.TAG_ORDER,
] as const

export const AutomationStatus = {
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  DRAFT: 'DRAFT',
} as const
export type AutomationStatus = (typeof AutomationStatus)[keyof typeof AutomationStatus]

export const AUTOMATION_STATUS_VALUES = [
  AutomationStatus.ACTIVE,
  AutomationStatus.PAUSED,
  AutomationStatus.DRAFT,
] as const

export const ExperimentStatus = {
  DRAFT: 'DRAFT',
  RUNNING: 'RUNNING',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
} as const
export type ExperimentStatus = (typeof ExperimentStatus)[keyof typeof ExperimentStatus]

export const EXPERIMENT_STATUS_VALUES = [
  ExperimentStatus.DRAFT,
  ExperimentStatus.RUNNING,
  ExperimentStatus.PAUSED,
  ExperimentStatus.COMPLETED,
] as const

export const ReferralStatus = {
  PENDING: 'PENDING',
  CONVERTED: 'CONVERTED',
  REWARDED: 'REWARDED',
  EXPIRED: 'EXPIRED',
} as const
export type ReferralStatus = (typeof ReferralStatus)[keyof typeof ReferralStatus]

export const REFERRAL_STATUS_VALUES = [
  ReferralStatus.PENDING,
  ReferralStatus.CONVERTED,
  ReferralStatus.REWARDED,
  ReferralStatus.EXPIRED,
] as const

export const PlatformEventStatus = {
  PENDING: 'PENDING',
  DELIVERED: 'DELIVERED',
  FAILED: 'FAILED',
  REPLAYED: 'REPLAYED',
} as const
export type PlatformEventStatus = (typeof PlatformEventStatus)[keyof typeof PlatformEventStatus]

export const PLATFORM_EVENT_STATUS_VALUES = [
  PlatformEventStatus.PENDING,
  PlatformEventStatus.DELIVERED,
  PlatformEventStatus.FAILED,
  PlatformEventStatus.REPLAYED,
] as const

export const WalletOwnerType = {
  SHOP: 'SHOP',
  AFFILIATE: 'AFFILIATE',
  PLATFORM: 'PLATFORM',
} as const
export type WalletOwnerType = (typeof WalletOwnerType)[keyof typeof WalletOwnerType]

export const WALLET_OWNER_TYPE_VALUES = [
  WalletOwnerType.SHOP,
  WalletOwnerType.AFFILIATE,
  WalletOwnerType.PLATFORM,
] as const

export const AdminStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
} as const
export type AdminStatus = (typeof AdminStatus)[keyof typeof AdminStatus]

export const ADMIN_STATUS_VALUES = [
  AdminStatus.ACTIVE,
  AdminStatus.INACTIVE,
  AdminStatus.SUSPENDED,
] as const

export const AdminRoleType = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  MODERATOR: 'MODERATOR',
  SUPPORT: 'SUPPORT',
  VIEWER: 'VIEWER',
} as const
export type AdminRoleType = (typeof AdminRoleType)[keyof typeof AdminRoleType]

export const ADMIN_ROLE_TYPE_VALUES = [
  AdminRoleType.SUPER_ADMIN,
  AdminRoleType.ADMIN,
  AdminRoleType.MODERATOR,
  AdminRoleType.SUPPORT,
  AdminRoleType.VIEWER,
] as const

export const AdminPermission = {
  ADMIN_MANAGE: 'ADMIN_MANAGE',
  ROLE_MANAGE: 'ROLE_MANAGE',
  SELLER_VIEW: 'SELLER_VIEW',
  SELLER_APPROVE: 'SELLER_APPROVE',
  SELLER_SUSPEND: 'SELLER_SUSPEND',
  PRODUCT_VIEW: 'PRODUCT_VIEW',
  PRODUCT_MODERATE: 'PRODUCT_MODERATE',
  ORDER_VIEW: 'ORDER_VIEW',
  ORDER_MANAGE: 'ORDER_MANAGE',
  REFUND_VIEW: 'REFUND_VIEW',
  REFUND_MANAGE: 'REFUND_MANAGE',
  USER_VIEW: 'USER_VIEW',
  USER_MANAGE: 'USER_MANAGE',
  MARKETING_MANAGE: 'MARKETING_MANAGE',
  BANNER_MANAGE: 'BANNER_MANAGE',
  NOTIFICATION_MANAGE: 'NOTIFICATION_MANAGE',
  REVIEW_MODERATE: 'REVIEW_MODERATE',
  CATEGORY_MANAGE: 'CATEGORY_MANAGE',
  AUDIT_VIEW: 'AUDIT_VIEW',
  SETTINGS_MANAGE: 'SETTINGS_MANAGE',
  DASHBOARD_VIEW: 'DASHBOARD_VIEW',
  SUPPORT_MANAGE: 'SUPPORT_MANAGE',
} as const
export type AdminPermission = (typeof AdminPermission)[keyof typeof AdminPermission]

export const ADMIN_PERMISSION_VALUES = [
  AdminPermission.ADMIN_MANAGE,
  AdminPermission.ROLE_MANAGE,
  AdminPermission.SELLER_VIEW,
  AdminPermission.SELLER_APPROVE,
  AdminPermission.SELLER_SUSPEND,
  AdminPermission.PRODUCT_VIEW,
  AdminPermission.PRODUCT_MODERATE,
  AdminPermission.ORDER_VIEW,
  AdminPermission.ORDER_MANAGE,
  AdminPermission.REFUND_VIEW,
  AdminPermission.REFUND_MANAGE,
  AdminPermission.USER_VIEW,
  AdminPermission.USER_MANAGE,
  AdminPermission.MARKETING_MANAGE,
  AdminPermission.BANNER_MANAGE,
  AdminPermission.NOTIFICATION_MANAGE,
  AdminPermission.REVIEW_MODERATE,
  AdminPermission.CATEGORY_MANAGE,
  AdminPermission.AUDIT_VIEW,
  AdminPermission.SETTINGS_MANAGE,
  AdminPermission.DASHBOARD_VIEW,
  AdminPermission.SUPPORT_MANAGE,
] as const

export const SellerStatus = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  BANNED: 'BANNED',
  REJECTED: 'REJECTED',
} as const
export type SellerStatus = (typeof SellerStatus)[keyof typeof SellerStatus]

export const SELLER_STATUS_VALUES = [
  SellerStatus.PENDING,
  SellerStatus.ACTIVE,
  SellerStatus.SUSPENDED,
  SellerStatus.BANNED,
  SellerStatus.REJECTED,
] as const

export const SellerVerificationStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  RESUBMITTED: 'RESUBMITTED',
} as const
export type SellerVerificationStatus =
  (typeof SellerVerificationStatus)[keyof typeof SellerVerificationStatus]

export const SELLER_VERIFICATION_STATUS_VALUES = [
  SellerVerificationStatus.PENDING,
  SellerVerificationStatus.APPROVED,
  SellerVerificationStatus.REJECTED,
  SellerVerificationStatus.RESUBMITTED,
] as const

export const AuditActionType = {
  ADMIN_LOGIN: 'ADMIN_LOGIN',
  ADMIN_LOGOUT: 'ADMIN_LOGOUT',
  ADMIN_CREATED: 'ADMIN_CREATED',
  ADMIN_UPDATED: 'ADMIN_UPDATED',
  ROLE_ASSIGNED: 'ROLE_ASSIGNED',
  ROLE_REMOVED: 'ROLE_REMOVED',
  SELLER_APPROVED: 'SELLER_APPROVED',
  SELLER_REJECTED: 'SELLER_REJECTED',
  SELLER_SUSPENDED: 'SELLER_SUSPENDED',
  PRODUCT_MODERATED: 'PRODUCT_MODERATED',
  PRODUCT_APPROVED: 'PRODUCT_APPROVED',
  PRODUCT_REJECTED: 'PRODUCT_REJECTED',
  PRODUCT_HIDDEN: 'PRODUCT_HIDDEN',
  PRODUCT_UNHIDDEN: 'PRODUCT_UNHIDDEN',
  PRODUCT_BANNED: 'PRODUCT_BANNED',
  PRODUCT_BULK_APPROVED: 'PRODUCT_BULK_APPROVED',
  PRODUCT_BULK_REJECTED: 'PRODUCT_BULK_REJECTED',
  PRODUCT_REPORT_RESOLVED: 'PRODUCT_REPORT_RESOLVED',
  PRODUCT_REPORT_DISMISSED: 'PRODUCT_REPORT_DISMISSED',
  CATEGORY_CREATED: 'CATEGORY_CREATED',
  CATEGORY_UPDATED: 'CATEGORY_UPDATED',
  CATEGORY_DELETED: 'CATEGORY_DELETED',
  CATEGORY_REORDERED: 'CATEGORY_REORDERED',
  ORDER_FORCE_CANCELLED: 'ORDER_FORCE_CANCELLED',
  ORDER_FORCE_COMPLETED: 'ORDER_FORCE_COMPLETED',
  REFUND_APPROVED: 'REFUND_APPROVED',
  REFUND_REJECTED: 'REFUND_REJECTED',
  USER_SUSPENDED: 'USER_SUSPENDED',
  USER_BANNED: 'USER_BANNED',
  USER_ACTIVATED: 'USER_ACTIVATED',
  VOUCHER_CREATED: 'VOUCHER_CREATED',
  VOUCHER_UPDATED: 'VOUCHER_UPDATED',
  BANNER_CREATED: 'BANNER_CREATED',
  BANNER_UPDATED: 'BANNER_UPDATED',
  BANNER_PUBLISHED: 'BANNER_PUBLISHED',
  BANNER_UNPUBLISHED: 'BANNER_UNPUBLISHED',
  REVIEW_HIDDEN: 'REVIEW_HIDDEN',
  REVIEW_APPROVED: 'REVIEW_APPROVED',
  REVIEW_REJECTED: 'REVIEW_REJECTED',
  NOTIFICATION_CREATED: 'NOTIFICATION_CREATED',
  NOTIFICATION_SENT: 'NOTIFICATION_SENT',
  NOTIFICATION_TEMPLATE_CREATED: 'NOTIFICATION_TEMPLATE_CREATED',
  SETTINGS_CHANGED: 'SETTINGS_CHANGED',
} as const
export type AuditActionType = (typeof AuditActionType)[keyof typeof AuditActionType]

export const AUDIT_ACTION_TYPE_VALUES = [
  AuditActionType.ADMIN_LOGIN,
  AuditActionType.ADMIN_LOGOUT,
  AuditActionType.ADMIN_CREATED,
  AuditActionType.ADMIN_UPDATED,
  AuditActionType.ROLE_ASSIGNED,
  AuditActionType.ROLE_REMOVED,
  AuditActionType.SELLER_APPROVED,
  AuditActionType.SELLER_REJECTED,
  AuditActionType.SELLER_SUSPENDED,
  AuditActionType.PRODUCT_MODERATED,
  AuditActionType.PRODUCT_APPROVED,
  AuditActionType.PRODUCT_REJECTED,
  AuditActionType.PRODUCT_HIDDEN,
  AuditActionType.PRODUCT_UNHIDDEN,
  AuditActionType.PRODUCT_BANNED,
  AuditActionType.PRODUCT_BULK_APPROVED,
  AuditActionType.PRODUCT_BULK_REJECTED,
  AuditActionType.PRODUCT_REPORT_RESOLVED,
  AuditActionType.PRODUCT_REPORT_DISMISSED,
  AuditActionType.CATEGORY_CREATED,
  AuditActionType.CATEGORY_UPDATED,
  AuditActionType.CATEGORY_DELETED,
  AuditActionType.CATEGORY_REORDERED,
  AuditActionType.ORDER_FORCE_CANCELLED,
  AuditActionType.ORDER_FORCE_COMPLETED,
  AuditActionType.REFUND_APPROVED,
  AuditActionType.REFUND_REJECTED,
  AuditActionType.USER_SUSPENDED,
  AuditActionType.USER_BANNED,
  AuditActionType.USER_ACTIVATED,
  AuditActionType.VOUCHER_CREATED,
  AuditActionType.VOUCHER_UPDATED,
  AuditActionType.BANNER_CREATED,
  AuditActionType.BANNER_UPDATED,
  AuditActionType.BANNER_PUBLISHED,
  AuditActionType.BANNER_UNPUBLISHED,
  AuditActionType.REVIEW_HIDDEN,
  AuditActionType.REVIEW_APPROVED,
  AuditActionType.REVIEW_REJECTED,
  AuditActionType.NOTIFICATION_CREATED,
  AuditActionType.NOTIFICATION_SENT,
  AuditActionType.NOTIFICATION_TEMPLATE_CREATED,
  AuditActionType.SETTINGS_CHANGED,
] as const

export const ProductReportReason = {
  COUNTERFEIT: 'COUNTERFEIT',
  INAPPROPRIATE: 'INAPPROPRIATE',
  WRONG_CATEGORY: 'WRONG_CATEGORY',
  MISLEADING: 'MISLEADING',
  PROHIBITED: 'PROHIBITED',
  IP_VIOLATION: 'IP_VIOLATION',
  OTHER: 'OTHER',
} as const
export type ProductReportReason = (typeof ProductReportReason)[keyof typeof ProductReportReason]

export const PRODUCT_REPORT_REASON_VALUES = [
  ProductReportReason.COUNTERFEIT,
  ProductReportReason.INAPPROPRIATE,
  ProductReportReason.WRONG_CATEGORY,
  ProductReportReason.MISLEADING,
  ProductReportReason.PROHIBITED,
  ProductReportReason.IP_VIOLATION,
  ProductReportReason.OTHER,
] as const

export const ProductReportStatus = {
  OPEN: 'OPEN',
  REVIEWING: 'REVIEWING',
  RESOLVED: 'RESOLVED',
  DISMISSED: 'DISMISSED',
} as const
export type ProductReportStatus = (typeof ProductReportStatus)[keyof typeof ProductReportStatus]

export const PRODUCT_REPORT_STATUS_VALUES = [
  ProductReportStatus.OPEN,
  ProductReportStatus.REVIEWING,
  ProductReportStatus.RESOLVED,
  ProductReportStatus.DISMISSED,
] as const

export const BannerPosition = {
  HERO: 'HERO',
  HOMEPAGE_TOP: 'HOMEPAGE_TOP',
  HOMEPAGE_MIDDLE: 'HOMEPAGE_MIDDLE',
  CAMPAIGN: 'CAMPAIGN',
  ANNOUNCEMENT: 'ANNOUNCEMENT',
} as const
export type BannerPosition = (typeof BannerPosition)[keyof typeof BannerPosition]

export const BANNER_POSITION_VALUES = [
  BannerPosition.HERO,
  BannerPosition.HOMEPAGE_TOP,
  BannerPosition.HOMEPAGE_MIDDLE,
  BannerPosition.CAMPAIGN,
  BannerPosition.ANNOUNCEMENT,
] as const

export const BannerStatus = {
  DRAFT: 'DRAFT',
  SCHEDULED: 'SCHEDULED',
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  ARCHIVED: 'ARCHIVED',
} as const
export type BannerStatus = (typeof BannerStatus)[keyof typeof BannerStatus]

export const BANNER_STATUS_VALUES = [
  BannerStatus.DRAFT,
  BannerStatus.SCHEDULED,
  BannerStatus.ACTIVE,
  BannerStatus.EXPIRED,
  BannerStatus.ARCHIVED,
] as const

export const AdminNotificationStatus = {
  DRAFT: 'DRAFT',
  SENT: 'SENT',
  FAILED: 'FAILED',
} as const
export type AdminNotificationStatus =
  (typeof AdminNotificationStatus)[keyof typeof AdminNotificationStatus]

export const ADMIN_NOTIFICATION_STATUS_VALUES = [
  AdminNotificationStatus.DRAFT,
  AdminNotificationStatus.SENT,
  AdminNotificationStatus.FAILED,
] as const

export const PlatformVoucherType = {
  PERCENTAGE: 'PERCENTAGE',
  FIXED_AMOUNT: 'FIXED_AMOUNT',
  FREE_SHIPPING: 'FREE_SHIPPING',
} as const
export type PlatformVoucherType = (typeof PlatformVoucherType)[keyof typeof PlatformVoucherType]

export const PLATFORM_VOUCHER_TYPE_VALUES = [
  PlatformVoucherType.PERCENTAGE,
  PlatformVoucherType.FIXED_AMOUNT,
  PlatformVoucherType.FREE_SHIPPING,
] as const

export const PlatformVoucherStatus = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  EXPIRED: 'EXPIRED',
  DEPLETED: 'DEPLETED',
} as const
export type PlatformVoucherStatus =
  (typeof PlatformVoucherStatus)[keyof typeof PlatformVoucherStatus]

export const PLATFORM_VOUCHER_STATUS_VALUES = [
  PlatformVoucherStatus.DRAFT,
  PlatformVoucherStatus.ACTIVE,
  PlatformVoucherStatus.PAUSED,
  PlatformVoucherStatus.EXPIRED,
  PlatformVoucherStatus.DEPLETED,
] as const

export const CommissionRuleScope = {
  GLOBAL: 'GLOBAL',
  CATEGORY: 'CATEGORY',
  VENDOR: 'VENDOR',
} as const
export type CommissionRuleScope = (typeof CommissionRuleScope)[keyof typeof CommissionRuleScope]

export const COMMISSION_RULE_SCOPE_VALUES = [
  CommissionRuleScope.GLOBAL,
  CommissionRuleScope.CATEGORY,
  CommissionRuleScope.VENDOR,
] as const

export const SupportTicketStatus = {
  NEW: 'NEW',
  OPEN: 'OPEN',
  PENDING: 'PENDING',
  SOLVED: 'SOLVED',
} as const
export type SupportTicketStatus = (typeof SupportTicketStatus)[keyof typeof SupportTicketStatus]

export const SUPPORT_TICKET_STATUS_VALUES = [
  SupportTicketStatus.NEW,
  SupportTicketStatus.OPEN,
  SupportTicketStatus.PENDING,
  SupportTicketStatus.SOLVED,
] as const

export const SupportSubmitterRole = {
  BUYER: 'BUYER',
  SELLER: 'SELLER',
} as const
export type SupportSubmitterRole = (typeof SupportSubmitterRole)[keyof typeof SupportSubmitterRole]

export const SUPPORT_SUBMITTER_ROLE_VALUES = [
  SupportSubmitterRole.BUYER,
  SupportSubmitterRole.SELLER,
] as const

export const CheckoutStep = {
  ADDRESS: 'ADDRESS',
  SHIPPING: 'SHIPPING',
  PAYMENT: 'PAYMENT',
  REVIEW: 'REVIEW',
  CONFIRMED: 'CONFIRMED',
  FAILED: 'FAILED',
  EXPIRED: 'EXPIRED',
} as const
export type CheckoutStep = (typeof CheckoutStep)[keyof typeof CheckoutStep]

export const CHECKOUT_STEP_VALUES = [
  CheckoutStep.ADDRESS,
  CheckoutStep.SHIPPING,
  CheckoutStep.PAYMENT,
  CheckoutStep.REVIEW,
  CheckoutStep.CONFIRMED,
  CheckoutStep.FAILED,
  CheckoutStep.EXPIRED,
] as const

export const DistributionEvent = {
  INVENTORY_RESERVED: 'INVENTORY_RESERVED',
  INVENTORY_DEDUCTED: 'INVENTORY_DEDUCTED',
  ORDER_CREATED: 'ORDER_CREATED',
  SELLER_ORDERS_SPLIT: 'SELLER_ORDERS_SPLIT',
  PAYMENT_INITIATED: 'PAYMENT_INITIATED',
  NOTIFICATION_SENT: 'NOTIFICATION_SENT',
  INVENTORY_RELEASED: 'INVENTORY_RELEASED',
  FAILED: 'FAILED',
} as const
export type DistributionEvent = (typeof DistributionEvent)[keyof typeof DistributionEvent]

export const DISTRIBUTION_EVENT_VALUES = [
  DistributionEvent.INVENTORY_RESERVED,
  DistributionEvent.INVENTORY_DEDUCTED,
  DistributionEvent.ORDER_CREATED,
  DistributionEvent.SELLER_ORDERS_SPLIT,
  DistributionEvent.PAYMENT_INITIATED,
  DistributionEvent.NOTIFICATION_SENT,
  DistributionEvent.INVENTORY_RELEASED,
  DistributionEvent.FAILED,
] as const

export const DistributionStatus = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
} as const
export type DistributionStatus = (typeof DistributionStatus)[keyof typeof DistributionStatus]

export const DISTRIBUTION_STATUS_VALUES = [
  DistributionStatus.PENDING,
  DistributionStatus.SUCCESS,
  DistributionStatus.FAILED,
] as const
