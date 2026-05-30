'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@ecom/core-ui/atoms/Avatar'
import { Button } from '@ecom/core-ui/atoms/Button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ecom/core-ui/atoms/Form'
import { Input } from '@ecom/core-ui/atoms/Input'
import { Textarea } from '@ecom/core-ui/atoms/Textarea'
import { Typography } from '@ecom/core-ui/atoms/Typography'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ecom/core-ui/molecules/Select'
import { ConsolePageLayout } from '@ecom/core-ui/layouts/ConsolePageLayout'
import type { UseFormReturn } from '@ecom/core-ui/vendors/react-hook-form'
import { slugify } from '@ecom/shared/utils/slugify'
import { ImagePlus, Star } from 'lucide-react'
import { SectionCard } from '../../atoms/SectionCard'
import { shopProfileCountryOptions, shopProfileResponseTargetOptions } from './ShopProfile.fixtures'
import type { ShopProfileFormData, ShopProfileProps } from './ShopProfile.types'
import { useShopProfileController } from './ShopProfile.controller'

function getInitials(value: string) {
  return value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function LivePreview({ form }: { form: ShopProfileFormData }) {
  return (
    <SectionCard title="Live preview" className="rounded-[24px]">
      <article className="bg-card border-border overflow-hidden rounded-2xl border shadow-xs">
        <div className="aspect-[2.4/1] overflow-hidden">
          <img
            alt={`${form.shopName} banner`}
            className="size-full object-cover"
            src={form.bannerUrl}
          />
        </div>
        <div className="space-y-4 p-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-14 rounded-full border bg-white">
              <AvatarImage alt={form.shopName} src={form.logoUrl} />
              <AvatarFallback>{getInitials(form.shopName)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="truncate text-lg font-semibold">{form.shopName || 'Shop name'}</div>
              <div className="text-muted-foreground flex items-center gap-1 text-sm">
                <Star className="size-3.5 fill-current" />
                <span>{form.ratingLabel}</span>
                <span>&middot;</span>
                <span>{form.followersLabel}</span>
              </div>
            </div>
          </div>
          <Typography variant="muted">{form.tagline || 'Add a short shop tagline.'}</Typography>
        </div>
      </article>
    </SectionCard>
  )
}

function IdentitySection({
  form,
  shopName,
  logoUrl,
  previewUrl,
  onReplaceLogo,
}: {
  form: UseFormReturn<ShopProfileFormData>
  shopName: string
  logoUrl: string
  previewUrl: string
  onReplaceLogo?: () => void
}) {
  return (
    <SectionCard title="Identity" className="rounded-[24px]">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar className="size-18 rounded-full">
            <AvatarImage alt={shopName} src={logoUrl} />
            <AvatarFallback>{getInitials(shopName)}</AvatarFallback>
          </Avatar>
          <Button type="button" variant="outline" onClick={onReplaceLogo}>
            <ImagePlus />
            Replace logo
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="shopName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shop name *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(event) => field.onChange(slugify(event.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  {`${previewUrl.replace(/\/$/, '')}/${field.value || 'your-shop'}`}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tagline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tagline</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About</FormLabel>
              <FormControl>
                <Textarea {...field} rows={5} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </SectionCard>
  )
}

function BannerSection({
  bannerUrl,
  onReplaceBanner,
}: {
  bannerUrl: string
  onReplaceBanner?: () => void
}) {
  return (
    <SectionCard title="Banner" className="rounded-[24px]">
      <div className="space-y-4">
        <div className="bg-muted aspect-[2.9/1] overflow-hidden rounded-2xl">
          <img alt="Shop banner" className="size-full object-cover" src={bannerUrl} />
        </div>
        <Button type="button" variant="outline" onClick={onReplaceBanner}>
          <ImagePlus />
          Replace banner
        </Button>
      </div>
    </SectionCard>
  )
}

function ContactOperationsSection({
  form,
  countryOptions,
  responseTargetOptions,
}: {
  form: UseFormReturn<ShopProfileFormData>
  countryOptions: string[]
  responseTargetOptions: string[]
}) {
  return (
    <SectionCard title="Contact & operations" className="rounded-[24px]">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="supportEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Support email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="supportPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Support phone</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countryOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="responseTarget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Response target</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select response target" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {responseTargetOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </SectionCard>
  )
}

type ShopProfileClientProps = Required<
  Pick<ShopProfileProps, 'title' | 'description' | 'breadcrumb' | 'submitLabel' | 'initialData'>
> &
  Pick<
    ShopProfileProps,
    'countryOptions' | 'responseTargetOptions' | 'onSubmit' | 'onReplaceLogo' | 'onReplaceBanner'
  >

export function ShopProfileClient({
  title,
  description,
  breadcrumb,
  submitLabel,
  initialData,
  countryOptions = shopProfileCountryOptions,
  responseTargetOptions = shopProfileResponseTargetOptions,
  onSubmit,
  onReplaceLogo,
  onReplaceBanner,
}: ShopProfileClientProps) {
  const controllerProps = {
    initialData,
    ...(onSubmit ? { onSubmit } : {}),
    ...(onReplaceLogo ? { onReplaceLogo } : {}),
    ...(onReplaceBanner ? { onReplaceBanner } : {}),
  }
  const { state, handlers } = useShopProfileController(controllerProps)

  const { form } = state
  const { form: formApi, handleSubmit } = handlers

  return (
    <Form {...formApi}>
      <ConsolePageLayout
        title={title}
        description={description}
        breadcrumb={breadcrumb}
        actions={
          <Button
            type="button"
            onClick={() => void handleSubmit()}
            loading={formApi.formState.isSubmitting}
          >
            {submitLabel}
          </Button>
        }
        aside={<LivePreview form={form} />}
        mainClassName="space-y-6"
      >
        <IdentitySection
          form={formApi}
          shopName={form.shopName}
          logoUrl={form.logoUrl}
          previewUrl={form.previewUrl}
          {...(handlers.onReplaceLogo !== undefined
            ? { onReplaceLogo: handlers.onReplaceLogo }
            : {})}
        />
        <BannerSection
          bannerUrl={form.bannerUrl}
          {...(handlers.onReplaceBanner !== undefined
            ? { onReplaceBanner: handlers.onReplaceBanner }
            : {})}
        />
        <ContactOperationsSection
          form={formApi}
          countryOptions={countryOptions}
          responseTargetOptions={responseTargetOptions}
        />
      </ConsolePageLayout>
    </Form>
  )
}
