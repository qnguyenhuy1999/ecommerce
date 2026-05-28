import * as bcrypt from 'bcryptjs'
import { loadDatabaseEnv } from '../env'

loadDatabaseEnv()

const { prisma } = await import('../src/client')

const TEMP_PASSWORD = 'TempPass123!'
const TEMP_PASSWORD_HASH = await bcrypt.hash(TEMP_PASSWORD, 12)

type SellerSeed = {
  email: string
  firstName: string
  lastName: string
  phone: string
  shop: {
    name: string
    slug: string
    description: string
    phone: string
    email: string
    addressLine1: string
    city: string
    state: string
    postalCode: string
    country: string
    status: 'ACTIVE' | 'PENDING'
  }
}

type BuyerSeed = {
  email: string
  firstName: string
  lastName: string
  phone: string
  address: {
    recipientName: string
    phone: string
    addressLine: string
    city: string
    province: string
    postalCode: string
    countryCode: string
    label: string
  }
}

const sellers: SellerSeed[] = [
  {
    email: 'seller.alpha@example.com',
    firstName: 'Alpha',
    lastName: 'Seller',
    phone: '+84901111001',
    shop: {
      name: 'Alpha Home',
      slug: 'alpha-home',
      description: 'Temporary demo seller account for local development.',
      phone: '+84901111001',
      email: 'seller.alpha@example.com',
      addressLine1: '12 Nguyen Hue',
      city: 'Ho Chi Minh City',
      state: 'District 1',
      postalCode: '700000',
      country: 'VN',
      status: 'ACTIVE',
    },
  },
  {
    email: 'seller.beta@example.com',
    firstName: 'Beta',
    lastName: 'Merchant',
    phone: '+84901111002',
    shop: {
      name: 'Beta Fashion',
      slug: 'beta-fashion',
      description: 'Temporary fashion seller for testing seller dashboard flows.',
      phone: '+84901111002',
      email: 'seller.beta@example.com',
      addressLine1: '99 Le Loi',
      city: 'Da Nang',
      state: 'Hai Chau',
      postalCode: '550000',
      country: 'VN',
      status: 'PENDING',
    },
  },
]

const buyers: BuyerSeed[] = [
  {
    email: 'buyer.one@example.com',
    firstName: 'Buyer',
    lastName: 'One',
    phone: '+6581111001',
    address: {
      recipientName: 'Buyer One',
      phone: '+6581111001',
      addressLine: '10 Orchard Road',
      city: 'Singapore',
      province: 'Central Singapore',
      postalCode: '238840',
      countryCode: 'SG',
      label: 'Home',
    },
  },
  {
    email: 'buyer.two@example.com',
    firstName: 'Buyer',
    lastName: 'Two',
    phone: '+6581111002',
    address: {
      recipientName: 'Buyer Two',
      phone: '+6581111002',
      addressLine: '25 Jurong East Street 24',
      city: 'Singapore',
      province: 'West Region',
      postalCode: '609551',
      countryCode: 'SG',
      label: 'Office',
    },
  },
]

async function seedSeller(seller: SellerSeed) {
  const user = await prisma.user.upsert({
    where: { email: seller.email },
    update: {
      passwordHash: TEMP_PASSWORD_HASH,
      firstName: seller.firstName,
      lastName: seller.lastName,
      phone: seller.phone,
      emailVerified: true,
      status: 'ACTIVE',
      isStaff: false,
    },
    create: {
      email: seller.email,
      passwordHash: TEMP_PASSWORD_HASH,
      firstName: seller.firstName,
      lastName: seller.lastName,
      phone: seller.phone,
      emailVerified: true,
      status: 'ACTIVE',
      isStaff: false,
    },
  })

  const profile = await prisma.sellerProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  })

  const shop = await prisma.shop.upsert({
    where: { sellerId: profile.id },
    update: {
      name: seller.shop.name,
      slug: seller.shop.slug,
      description: seller.shop.description,
      phone: seller.shop.phone,
      email: seller.shop.email,
      addressLine1: seller.shop.addressLine1,
      city: seller.shop.city,
      state: seller.shop.state,
      postalCode: seller.shop.postalCode,
      country: seller.shop.country,
      status: seller.shop.status,
    },
    create: {
      sellerId: profile.id,
      name: seller.shop.name,
      slug: seller.shop.slug,
      description: seller.shop.description,
      phone: seller.shop.phone,
      email: seller.shop.email,
      addressLine1: seller.shop.addressLine1,
      city: seller.shop.city,
      state: seller.shop.state,
      postalCode: seller.shop.postalCode,
      country: seller.shop.country,
      status: seller.shop.status,
    },
  })

  await prisma.seller.upsert({
    where: { sellerProfileId: profile.id },
    update: {
      userId: user.id,
      shopId: shop.id,
      phone: seller.phone,
      address: seller.shop.addressLine1,
      status: seller.shop.status === 'ACTIVE' ? 'ACTIVE' : 'PENDING',
      approvedAt: seller.shop.status === 'ACTIVE' ? new Date() : null,
      rejectedAt: null,
      rejectedBy: null,
      rejectReason: null,
      suspendedAt: null,
      suspendedBy: null,
      suspendReason: null,
      deletedAt: null,
    },
    create: {
      userId: user.id,
      sellerProfileId: profile.id,
      shopId: shop.id,
      phone: seller.phone,
      address: seller.shop.addressLine1,
      status: seller.shop.status === 'ACTIVE' ? 'ACTIVE' : 'PENDING',
      ...(seller.shop.status === 'ACTIVE' ? { approvedAt: new Date() } : {}),
    },
  })

  console.log(`Seeded seller: ${seller.email} -> ${seller.shop.name} (${seller.shop.status})`)
}

async function seedBuyer(buyer: BuyerSeed) {
  const user = await prisma.user.upsert({
    where: { email: buyer.email },
    update: {
      passwordHash: TEMP_PASSWORD_HASH,
      firstName: buyer.firstName,
      lastName: buyer.lastName,
      phone: buyer.phone,
      emailVerified: true,
      status: 'ACTIVE',
      isStaff: false,
    },
    create: {
      email: buyer.email,
      passwordHash: TEMP_PASSWORD_HASH,
      firstName: buyer.firstName,
      lastName: buyer.lastName,
      phone: buyer.phone,
      emailVerified: true,
      status: 'ACTIVE',
      isStaff: false,
    },
  })

  await prisma.userAddress.deleteMany({
    where: { userId: user.id },
  })

  await prisma.userAddress.create({
    data: {
      userId: user.id,
      recipientName: buyer.address.recipientName,
      phone: buyer.address.phone,
      addressLine: buyer.address.addressLine,
      city: buyer.address.city,
      province: buyer.address.province,
      postalCode: buyer.address.postalCode,
      countryCode: buyer.address.countryCode,
      label: buyer.address.label,
      isDefault: true,
    },
  })

  console.log(`Seeded buyer: ${buyer.email}`)
}

async function main() {
  for (const seller of sellers) {
    await seedSeller(seller)
  }

  for (const buyer of buyers) {
    await seedBuyer(buyer)
  }

  console.log(`Temporary users seeded. Shared password: ${TEMP_PASSWORD}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
