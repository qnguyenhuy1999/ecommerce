'use client'

import { Badge } from '@ecom/core-ui/atoms/Badge'
import { Button } from '@ecom/core-ui/atoms/Button'
import { Progress } from '@ecom/core-ui/atoms/Progress'
import { Typography } from '@ecom/core-ui/atoms/Typography'
import { Card, CardContent, CardHeader, CardTitle } from '@ecom/core-ui/molecules/Card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ecom/core-ui/molecules/Tabs'
import { cn } from '@ecom/shared/utils/cn'
import { Building2, CircleAlert, CircleCheck, CircleX, Landmark, ShieldAlert } from 'lucide-react'
import { getStatusTone, PLACEHOLDER_CONTENT } from './SellerKycDetail.constants'
import { useSellerKycDetailController } from './SellerKycDetail.controller'
import type {
  SellerKycDetailDocument,
  SellerKycDetailProps,
  SellerKycDetailRecord,
} from './SellerKycDetail.types'

function DetailCard({
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Card className={cn('gap-0 shadow-none', className)}>
      <CardHeader className="border-border border-b px-5 py-4 sm:px-6">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-0">{children}</CardContent>
    </Card>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border flex items-start justify-between gap-4 border-b border-dashed px-6 py-4 last:border-b-0">
      <Typography variant="caption" className="text-muted-foreground tracking-[0.18em] uppercase">
        {label}
      </Typography>
      <Typography variant="body-sm" className="text-right font-semibold">
        {value}
      </Typography>
    </div>
  )
}

function DocumentActions({
  item,
  document,
  approveDocumentLabel,
  rejectDocumentLabel,
  requestNewLabel,
  onApproveDocument,
  onRejectDocument,
  onRequestNewDocument,
}: {
  item: SellerKycDetailRecord
  document: SellerKycDetailDocument
  approveDocumentLabel: string
  rejectDocumentLabel: string
  requestNewLabel: string
  onApproveDocument?: SellerKycDetailProps['onApproveDocument']
  onRejectDocument?: SellerKycDetailProps['onRejectDocument']
  onRequestNewDocument?: SellerKycDetailProps['onRequestNewDocument']
}) {
  const payload = { item, document }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        variant="outline"
        className="text-success"
        onClick={() => void onApproveDocument?.(payload)}
      >
        <CircleCheck className="size-4" />
        {approveDocumentLabel}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="text-destructive"
        onClick={() => void onRejectDocument?.(payload)}
      >
        <CircleX className="size-4" />
        {rejectDocumentLabel}
      </Button>
      <Button type="button" variant="outline" onClick={() => void onRequestNewDocument?.(payload)}>
        {requestNewLabel}
      </Button>
    </div>
  )
}

function DocumentRow({
  item,
  document,
  approveDocumentLabel,
  rejectDocumentLabel,
  requestNewLabel,
  onApproveDocument,
  onRejectDocument,
  onRequestNewDocument,
}: {
  item: SellerKycDetailRecord
  document: SellerKycDetailDocument
  approveDocumentLabel: string
  rejectDocumentLabel: string
  requestNewLabel: string
  onApproveDocument?: SellerKycDetailProps['onApproveDocument']
  onRejectDocument?: SellerKycDetailProps['onRejectDocument']
  onRequestNewDocument?: SellerKycDetailProps['onRequestNewDocument']
}) {
  return (
    <div className="border-border bg-background flex flex-col gap-4 rounded-xl border p-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex min-w-0 flex-1 gap-4">
        <img
          src={document.previewSrc}
          alt={document.previewAlt}
          className="border-border bg-muted h-24 w-36 shrink-0 rounded-xl border object-cover"
        />
        <div className="min-w-0 space-y-3">
          <div className="space-y-1">
            <Typography variant="h4" as="h3" className="text-lg">
              {document.title}
            </Typography>
            <Typography variant="muted">
              {document.uploadedAtLabel} · type:{' '}
              <span className="font-mono">{document.typeLabel}</span>
            </Typography>
          </div>
          <DocumentActions
            item={item}
            document={document}
            approveDocumentLabel={approveDocumentLabel}
            rejectDocumentLabel={rejectDocumentLabel}
            requestNewLabel={requestNewLabel}
            onApproveDocument={onApproveDocument}
            onRejectDocument={onRejectDocument}
            onRequestNewDocument={onRequestNewDocument}
          />
        </div>
      </div>
      <Badge tone={getStatusTone(document.status)} size="lg">
        {document.status === 'APPROVED'
          ? 'Approved'
          : document.status === 'REJECTED'
            ? 'Rejected'
            : 'Pending'}
      </Badge>
    </div>
  )
}

function KycReviewPanel({
  item,
  approveDocumentLabel,
  rejectDocumentLabel,
  requestNewLabel,
  rejectSellerLabel,
  approveSellerLabel,
  onApproveDocument,
  onRejectDocument,
  onRequestNewDocument,
  onRejectSeller,
  onApproveSeller,
}: {
  item: SellerKycDetailRecord
  approveDocumentLabel: string
  rejectDocumentLabel: string
  requestNewLabel: string
  rejectSellerLabel: string
  approveSellerLabel: string
  onApproveDocument?: SellerKycDetailProps['onApproveDocument']
  onRejectDocument?: SellerKycDetailProps['onRejectDocument']
  onRequestNewDocument?: SellerKycDetailProps['onRequestNewDocument']
  onRejectSeller?: SellerKycDetailProps['onRejectSeller']
  onApproveSeller?: SellerKycDetailProps['onApproveSeller']
}) {
  const riskScoreValue = Math.max(0, Math.min(item.riskScore, 100))

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-1">
          <DetailCard title="Applicant">
            {item.applicant.map((field) => (
              <DetailRow key={field.label} label={field.label} value={field.value} />
            ))}
          </DetailCard>

          <DetailCard title="Bank account">
            <div className="mt-4 flex items-start gap-3 px-6">
              <Landmark className="text-muted-foreground mt-1 size-5 shrink-0" />
              <div className="space-y-1">
                <Typography variant="body-sm" className="font-semibold">
                  {item.bankName}
                </Typography>
                <Typography variant="muted">{item.bankAccountLabel}</Typography>
              </div>
            </div>
          </DetailCard>

          <DetailCard title="Risk assessment">
            <div className="mt-4 space-y-5 px-6">
              <div className="flex items-end justify-between gap-3">
                <div className="space-y-1">
                  <Typography variant="body-sm" className="font-semibold">
                    Score
                  </Typography>
                </div>
                <Typography variant="h3" as="p" className="text-destructive">
                  {item.riskScore}
                </Typography>
              </div>

              <div className="space-y-3">
                <Progress
                  value={riskScoreValue}
                  className="[&>[data-slot=progress-indicator]]:bg-destructive h-2"
                />
                <div className="flex items-start gap-3">
                  <ShieldAlert className="text-destructive mt-0.5 size-5 shrink-0" />
                  <Typography variant="muted">{item.riskSummary}</Typography>
                </div>
              </div>
            </div>
          </DetailCard>
        </div>

        <div className="space-y-6 xl:col-span-2">
          <DetailCard title="Document checklist">
            <div className="border-border border-b px-6 py-4">
              <Typography variant="muted">{item.documentsApprovedLabel}</Typography>
            </div>
            <div className="mt-4 space-y-4 px-4">
              {item.documents.map((document) => (
                <DocumentRow
                  key={document.id}
                  item={item}
                  document={document}
                  approveDocumentLabel={approveDocumentLabel}
                  rejectDocumentLabel={rejectDocumentLabel}
                  requestNewLabel={requestNewLabel}
                  onApproveDocument={onApproveDocument}
                  onRejectDocument={onRejectDocument}
                  onRequestNewDocument={onRequestNewDocument}
                />
              ))}
            </div>
          </DetailCard>

          <Card className="shadow-none">
            <CardContent className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                <CircleAlert className="text-warning mt-0.5 size-5 shrink-0" />
                <Typography variant="body-sm" className="font-medium">
                  {item.approvalHint}
                </Typography>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => void onRejectSeller?.(item)}>
                  {rejectSellerLabel}
                </Button>
                <Button type="button" onClick={() => void onApproveSeller?.(item)}>
                  {approveSellerLabel}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DetailCard title="Audit trail">
        <div className="space-y-0 px-6">
          {item.auditTrail.map((entry) => (
            <div
              key={entry.id}
              className="border-border mt-2 flex items-start justify-between gap-4 border-b last:border-b-0"
            >
              <div className="flex items-start gap-3">
                <span className="bg-primary mt-2 size-2 shrink-0 rounded-full" />
                <Typography variant="body-sm">
                  <span className="font-semibold">{entry.actor}</span> {entry.action}{' '}
                  {entry.target ? <span className="font-semibold">{entry.target}</span> : null}
                </Typography>
              </div>
              <Typography variant="muted" className="shrink-0">
                {entry.dateLabel}
              </Typography>
            </div>
          ))}
        </div>
      </DetailCard>
    </div>
  )
}

function PlaceholderPanel({
  title,
  message,
  icon: Icon,
}: {
  title: string
  message: string
  icon: typeof Building2
}) {
  return (
    <Card className="shadow-none">
      <CardContent className="flex flex-col items-start gap-4">
        <span className="bg-muted text-muted-foreground inline-flex rounded-full p-3">
          <Icon className="size-5" />
        </span>
        <div className="space-y-1">
          <Typography variant="h4">{title}</Typography>
          <Typography variant="muted">{message}</Typography>
        </div>
      </CardContent>
    </Card>
  )
}

export function SellerKycDetailClient({
  item,
  approveDocumentLabel,
  rejectDocumentLabel,
  requestNewLabel,
  rejectSellerLabel,
  approveSellerLabel,
  onApproveDocument,
  onRejectDocument,
  onRequestNewDocument,
  onRejectSeller,
  onApproveSeller,
}: Required<Pick<SellerKycDetailProps, 'item'>> &
  Required<
    Pick<
      SellerKycDetailProps,
      | 'approveDocumentLabel'
      | 'rejectDocumentLabel'
      | 'requestNewLabel'
      | 'rejectSellerLabel'
      | 'approveSellerLabel'
    >
  > &
  Pick<
    SellerKycDetailProps,
    | 'onApproveDocument'
    | 'onRejectDocument'
    | 'onRequestNewDocument'
    | 'onRejectSeller'
    | 'onApproveSeller'
  >) {
  const controller = useSellerKycDetailController(item)

  return (
    <div className="space-y-6">
      <Tabs
        value={controller.state.activeSection}
        onValueChange={controller.handlers.handleSectionChange}
      >
        <TabsList>
          {item.tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="KYC_REVIEW">
          <KycReviewPanel
            item={item}
            approveDocumentLabel={approveDocumentLabel}
            rejectDocumentLabel={rejectDocumentLabel}
            requestNewLabel={requestNewLabel}
            rejectSellerLabel={rejectSellerLabel}
            approveSellerLabel={approveSellerLabel}
            onApproveDocument={onApproveDocument}
            onRejectDocument={onRejectDocument}
            onRequestNewDocument={onRequestNewDocument}
            onRejectSeller={onRejectSeller}
            onApproveSeller={onApproveSeller}
          />
        </TabsContent>

        <TabsContent value="VIOLATIONS">
          <PlaceholderPanel
            title={PLACEHOLDER_CONTENT.VIOLATIONS.title}
            message={PLACEHOLDER_CONTENT.VIOLATIONS.message}
            icon={CircleAlert}
          />
        </TabsContent>

        <TabsContent value="PROFILE">
          <PlaceholderPanel
            title={PLACEHOLDER_CONTENT.PROFILE.title}
            message={PLACEHOLDER_CONTENT.PROFILE.message}
            icon={Building2}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
