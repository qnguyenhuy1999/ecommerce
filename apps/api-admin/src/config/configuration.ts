import { buildBaseConfiguration } from '@ecom/nest-config'

import { env } from './env.validation'

export default () => ({
  ...buildBaseConfiguration(env),
})
