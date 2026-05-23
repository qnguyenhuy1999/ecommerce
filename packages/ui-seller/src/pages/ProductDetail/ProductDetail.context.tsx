'use client'

import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react'
import { Form, useForm, useWatch, zodResolver } from '@ecom/core-ui'
import type {
  ProductDetailFormData,
  ProductDetailOptionGroup,
  ProductDetailStatus,
} from './ProductDetail.types'
import { productDetailSchema, type ProductDetailFormValues } from './ProductDetail.schema'
import type {
  ProductEditorAction,
  ProductEditorProps,
  ProductEditorState,
} from './ProductEditor.types'
import { cloneShippingMethods, cloneVisibilityOptions } from './ProductEditor.types'
import {
  buildValidationItems,
  buildVariantRows,
  cloneOptionGroups,
  createVariantDraftMap,
  slugify,
  type VariantDraft,
} from './ProductDetail.utils'

function createInitialState(initialData: ProductDetailFormData): ProductEditorState {
  return {
    basicInfo: {
      name: initialData.name,
      category: initialData.category,
      brand: initialData.brand,
      shortDescription: initialData.shortDescription,
      fullDescription: initialData.fullDescription,
    },
    status: initialData.status,
    visibility: cloneVisibilityOptions(initialData.visibility),
    media: [...initialData.media],
    optionGroups: cloneOptionGroups(initialData.optionGroups),
    shipping: {
      weightKg: initialData.weightKg,
      lengthCm: initialData.lengthCm,
      widthCm: initialData.widthCm,
      heightCm: initialData.heightCm,
      shippingMethods: cloneShippingMethods(initialData.shippingMethods),
    },
    seo: {
      slug: initialData.slug,
      metaTitle: initialData.metaTitle,
      metaDescription: initialData.metaDescription,
    },
    variantDrafts: createVariantDraftMap(initialData.variantSeeds),
    draftValueInputs: {},
    slugTouched: false,
  }
}

function createFormDefaultValues(initialData: ProductDetailFormData): ProductDetailFormValues {
  return {
    name: initialData.name,
    category: initialData.category,
    brand: initialData.brand,
    shortDescription: initialData.shortDescription,
    fullDescription: initialData.fullDescription,
    weightKg: initialData.weightKg,
    lengthCm: initialData.lengthCm,
    widthCm: initialData.widthCm,
    heightCm: initialData.heightCm,
    slug: initialData.slug,
    metaTitle: initialData.metaTitle,
    metaDescription: initialData.metaDescription,
  }
}

function productEditorReducer(
  state: ProductEditorState,
  action: ProductEditorAction,
): ProductEditorState {
  switch (action.type) {
    case 'SET_BASIC_INFO_FIELD':
      return {
        ...state,
        basicInfo: {
          ...state.basicInfo,
          [action.field]: action.value,
        },
      }
    case 'SET_STATUS':
      return { ...state, status: action.value }
    case 'SET_VISIBILITY':
      return {
        ...state,
        visibility: state.visibility.map((item) =>
          item.id === action.id ? { ...item, checked: action.checked } : item,
        ),
      }
    case 'ADD_MEDIA_ITEMS':
      return { ...state, media: [...state.media, ...action.items] }
    case 'REMOVE_MEDIA_ITEM':
      return {
        ...state,
        media: state.media.filter((item) => item.id !== action.id),
      }
    case 'SET_OPTION_GROUP':
      return {
        ...state,
        optionGroups: state.optionGroups.map((group) =>
          group.id === action.groupId ? action.nextGroup : group,
        ),
      }
    case 'REMOVE_OPTION_GROUP': {
      const restDraftInputs = { ...state.draftValueInputs }
      delete restDraftInputs[action.groupId]
      return {
        ...state,
        optionGroups: state.optionGroups.filter((group) => group.id !== action.groupId),
        draftValueInputs: restDraftInputs,
      }
    }
    case 'ADD_OPTION_GROUP': {
      const nextIndex = state.optionGroups.length + 1
      return {
        ...state,
        optionGroups: [
          ...state.optionGroups,
          { id: `group-${nextIndex}`, name: `Option ${nextIndex}`, values: [] },
        ],
      }
    }
    case 'ADD_OPTION_VALUE':
      return {
        ...state,
        optionGroups: state.optionGroups.map((group) => {
          if (group.id !== action.groupId || group.values.includes(action.value)) {
            return group
          }

          return {
            ...group,
            values: [...group.values, action.value],
          }
        }),
        draftValueInputs: {
          ...state.draftValueInputs,
          [action.groupId]: '',
        },
      }
    case 'REMOVE_OPTION_VALUE':
      return {
        ...state,
        optionGroups: state.optionGroups.map((group) =>
          group.id === action.groupId
            ? { ...group, values: group.values.filter((value) => value !== action.value) }
            : group,
        ),
      }
    case 'SET_VARIANT_DRAFT':
      return {
        ...state,
        variantDrafts: {
          ...state.variantDrafts,
          [action.key]: {
            sku: state.variantDrafts[action.key]?.sku ?? '',
            price: state.variantDrafts[action.key]?.price ?? '',
            stock: state.variantDrafts[action.key]?.stock ?? '',
            [action.field]: action.value,
          },
        },
      }
    case 'SET_DRAFT_VALUE_INPUT':
      return {
        ...state,
        draftValueInputs: {
          ...state.draftValueInputs,
          [action.groupId]: action.value,
        },
      }
    case 'SET_SHIPPING_FIELD':
      return {
        ...state,
        shipping: {
          ...state.shipping,
          [action.field]: action.value,
        },
      }
    case 'SET_SHIPPING_METHOD':
      return {
        ...state,
        shipping: {
          ...state.shipping,
          shippingMethods: state.shipping.shippingMethods.map((item) =>
            item.id === action.id ? { ...item, checked: action.checked } : item,
          ),
        },
      }
    case 'SET_SEO_FIELD':
      return {
        ...state,
        seo: {
          ...state.seo,
          [action.field]: action.value,
        },
      }
    case 'SET_SLUG_TOUCHED':
      return { ...state, slugTouched: action.value }
    default:
      return state
  }
}

interface ProductEditorContextValue {
  form: ReturnType<typeof useForm<ProductDetailFormValues>>
  state: ProductEditorState
  categories: ProductEditorProps['categories']
  brands: ProductEditorProps['brands']
  statuses: ProductEditorProps['statuses']
  lastSavedLabel: ProductEditorProps['lastSavedLabel']
  validationItems: ReturnType<typeof buildValidationItems>
  variantRows: ReturnType<typeof buildVariantRows>
  setBasicInfoField: (field: keyof ProductEditorState['basicInfo'], value: string) => void
  setStatus: (value: ProductDetailStatus) => void
  setVisibility: (id: string, checked: boolean) => void
  handleNameChange: (value: string) => void
  addMediaFiles: (files: FileList) => void
  removeMediaItem: (id: string) => void
  setOptionGroup: (groupId: string, nextGroup: ProductDetailOptionGroup) => void
  removeOptionGroup: (groupId: string) => void
  addOptionGroup: () => void
  addOptionValue: (groupId: string) => void
  removeOptionValue: (groupId: string, value: string) => void
  setVariantDraft: (key: string, field: keyof VariantDraft, value: string) => void
  setDraftValueInput: (groupId: string, value: string) => void
  setShippingField: (
    field: Exclude<keyof ProductEditorState['shipping'], 'shippingMethods'>,
    value: string,
  ) => void
  setShippingMethod: (id: string, checked: boolean) => void
  handleSlugChange: (value: string) => void
}

const ProductEditorContext = createContext<ProductEditorContextValue | null>(null)

function useProductEditorContext() {
  const context = useContext(ProductEditorContext)

  if (!context) {
    throw new Error('ProductEditor hooks must be used within ProductEditorProvider.')
  }

  return context
}

export function ProductEditorProvider({
  categories,
  brands,
  statuses,
  lastSavedLabel,
  initialData,
  children,
}: Pick<
  ProductEditorProps,
  'categories' | 'brands' | 'statuses' | 'lastSavedLabel' | 'initialData'
> & { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(productEditorReducer, initialData, createInitialState)
  const form = useForm<ProductDetailFormValues>({
    resolver: zodResolver(productDetailSchema),
    defaultValues: createFormDefaultValues(initialData),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })
  const validationTemplate = useMemo(
    () => initialData.validationItems.map((item) => ({ ...item })),
    [initialData.validationItems],
  )
  const mediaObjectUrlsRef = useRef<Set<string>>(new Set())
  const formValues = useWatch({ control: form.control })

  useEffect(() => {
    return () => {
      for (const url of mediaObjectUrlsRef.current) {
        URL.revokeObjectURL(url)
      }
    }
  }, [])

  const variantRows = useMemo(
    () => buildVariantRows(state.optionGroups, state.variantDrafts),
    [state.optionGroups, state.variantDrafts],
  )

  const validationForm = useMemo<ProductDetailFormData>(
    () => ({
      ...initialData,
      name: formValues.name ?? initialData.name,
      category: formValues.category ?? initialData.category,
      brand: formValues.brand ?? initialData.brand,
      shortDescription: formValues.shortDescription ?? initialData.shortDescription,
      fullDescription: formValues.fullDescription ?? initialData.fullDescription,
      status: state.status,
      media: state.media,
      optionGroups: state.optionGroups,
      weightKg: formValues.weightKg ?? initialData.weightKg,
      lengthCm: formValues.lengthCm ?? initialData.lengthCm,
      widthCm: formValues.widthCm ?? initialData.widthCm,
      heightCm: formValues.heightCm ?? initialData.heightCm,
      shippingMethods: state.shipping.shippingMethods,
      slug: formValues.slug ?? initialData.slug,
      metaTitle: formValues.metaTitle ?? initialData.metaTitle,
      metaDescription: formValues.metaDescription ?? initialData.metaDescription,
      visibility: state.visibility,
      validationItems: validationTemplate,
    }),
    [formValues, initialData, state, validationTemplate],
  )

  const validationItems = useMemo(
    () => buildValidationItems(validationTemplate, validationForm, variantRows),
    [validationForm, validationTemplate, variantRows],
  )

  const value = useMemo<ProductEditorContextValue>(
    () => ({
      form,
      state,
      categories,
      brands,
      statuses,
      lastSavedLabel,
      validationItems,
      variantRows,
      setBasicInfoField: (field, value) =>
        form.setValue(field, value, { shouldDirty: true, shouldTouch: true, shouldValidate: true }),
      setStatus: (value) => dispatch({ type: 'SET_STATUS', value }),
      setVisibility: (id, checked) => dispatch({ type: 'SET_VISIBILITY', id, checked }),
      handleNameChange: (value) => {
        form.setValue('name', value, { shouldDirty: true, shouldTouch: true, shouldValidate: true })

        if (!state.slugTouched) {
          form.setValue('slug', slugify(value), {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          })
        }
      },
      addMediaFiles: (files) => {
        const items = Array.from(files).map((file, index) => {
          const url = URL.createObjectURL(file)
          mediaObjectUrlsRef.current.add(url)

          return {
            id: `${file.name}-${index}-${Date.now()}`,
            url,
            alt: file.name,
          }
        })

        dispatch({ type: 'ADD_MEDIA_ITEMS', items })
      },
      removeMediaItem: (id) => {
        const removed = state.media.find((item) => item.id === id)

        if (removed && mediaObjectUrlsRef.current.has(removed.url)) {
          URL.revokeObjectURL(removed.url)
          mediaObjectUrlsRef.current.delete(removed.url)
        }

        dispatch({ type: 'REMOVE_MEDIA_ITEM', id })
      },
      setOptionGroup: (groupId, nextGroup) =>
        dispatch({ type: 'SET_OPTION_GROUP', groupId, nextGroup }),
      removeOptionGroup: (groupId) => dispatch({ type: 'REMOVE_OPTION_GROUP', groupId }),
      addOptionGroup: () => dispatch({ type: 'ADD_OPTION_GROUP' }),
      addOptionValue: (groupId) => {
        const value = state.draftValueInputs[groupId]?.trim()
        if (!value) {
          return
        }

        dispatch({ type: 'ADD_OPTION_VALUE', groupId, value })
      },
      removeOptionValue: (groupId, value) =>
        dispatch({ type: 'REMOVE_OPTION_VALUE', groupId, value }),
      setVariantDraft: (key, field, value) =>
        dispatch({ type: 'SET_VARIANT_DRAFT', key, field, value }),
      setDraftValueInput: (groupId, value) =>
        dispatch({ type: 'SET_DRAFT_VALUE_INPUT', groupId, value }),
      setShippingField: (field, value) =>
        form.setValue(field, value, { shouldDirty: true, shouldTouch: true, shouldValidate: true }),
      setShippingMethod: (id, checked) => dispatch({ type: 'SET_SHIPPING_METHOD', id, checked }),
      handleSlugChange: (value) => {
        dispatch({ type: 'SET_SLUG_TOUCHED', value: true })
        form.setValue('slug', slugify(value), {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        })
      },
    }),
    [brands, categories, form, lastSavedLabel, state, statuses, validationItems, variantRows],
  )

  return (
    <Form {...form}>
      <ProductEditorContext.Provider value={value}>{children}</ProductEditorContext.Provider>
    </Form>
  )
}

export function useProductEditorBasicInfo() {
  const context = useProductEditorContext()

  return {
    form: context.form,
    categories: context.categories,
    brands: context.brands,
    onNameChange: context.handleNameChange,
    updateForm: context.setBasicInfoField,
  }
}

export function useProductEditorSidebar() {
  const context = useProductEditorContext()

  return {
    status: context.state.status,
    statuses: context.statuses,
    lastSavedLabel: context.lastSavedLabel,
    visibility: context.state.visibility,
    validationItems: context.validationItems,
    onStatusChange: context.setStatus,
    onVisibilityChange: context.setVisibility,
  }
}

export function useProductEditorMedia() {
  const context = useProductEditorContext()

  return {
    media: context.state.media,
    onAdd: context.addMediaFiles,
    onRemove: context.removeMediaItem,
  }
}

export function useProductEditorVariants() {
  const context = useProductEditorContext()

  return {
    optionGroups: context.state.optionGroups,
    variantRows: context.variantRows,
    draftValueInputs: context.state.draftValueInputs,
    setDraftValueInputs: context.setDraftValueInput,
    handleOptionGroupChange: context.setOptionGroup,
    handleRemoveOptionGroup: context.removeOptionGroup,
    handleAddOptionGroup: context.addOptionGroup,
    handleAddOptionValue: context.addOptionValue,
    handleRemoveOptionValue: context.removeOptionValue,
    handleVariantDraftChange: context.setVariantDraft,
  }
}

export function useProductEditorShipping() {
  const context = useProductEditorContext()

  return {
    form: context.form,
    shippingMethods: context.state.shipping.shippingMethods,
    updateDimension: context.setShippingField,
    onShippingMethodChange: context.setShippingMethod,
  }
}

export function useProductEditorSeo() {
  const context = useProductEditorContext()

  return {
    form: context.form,
    onSlugChange: context.handleSlugChange,
    updateForm: (field: keyof ProductEditorState['seo'], value: string) =>
      context.form.setValue(field, value, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      }),
  }
}

export function useProductEditorForm() {
  const context = useProductEditorContext()

  return {
    form: context.form,
  }
}
