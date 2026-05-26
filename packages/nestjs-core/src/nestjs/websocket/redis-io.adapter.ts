import type { INestApplicationContext } from '@nestjs/common'
import { Logger } from '@nestjs/common'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { createAdapter } from '@socket.io/redis-adapter'
import { getRedisConfig } from '@ecom/config'
import Redis from 'ioredis'
import type { ServerOptions, Server as SocketIOServer } from 'socket.io'

type AdapterConstructor = ReturnType<typeof createAdapter>

export class RedisIoAdapter extends IoAdapter {
  private readonly logger = new Logger(RedisIoAdapter.name)
  private adapterConstructor?: AdapterConstructor
  private pubClient?: Redis
  private subClient?: Redis

  constructor(app: INestApplicationContext) {
    super(app)
  }

  connectToRedis(): void {
    const redis = getRedisConfig()
    const baseOptions: {
      host: string
      port: number
      password?: string
      db?: number
      maxRetriesPerRequest: null
    } = {
      host: redis.host,
      port: redis.port,
      maxRetriesPerRequest: null,
    }

    if (redis.password !== undefined) {
      baseOptions.password = redis.password
    }

    const dbRaw = process.env.REDIS_DB
    if (dbRaw !== undefined && dbRaw.length > 0) {
      const parsed = Number.parseInt(dbRaw, 10)
      if (Number.isFinite(parsed)) {
        baseOptions.db = parsed
      }
    }

    const pubClient = new Redis(baseOptions)
    const subClient = pubClient.duplicate()

    pubClient.on('error', (err: Error) => {
      this.logger.error(`Redis pub client error: ${err.message}`)
    })
    subClient.on('error', (err: Error) => {
      this.logger.error(`Redis sub client error: ${err.message}`)
    })

    this.pubClient = pubClient
    this.subClient = subClient
    this.adapterConstructor = createAdapter(pubClient, subClient)
    this.logger.log('Socket.IO Redis adapter ready')
  }

  override createIOServer(port: number, options?: ServerOptions): SocketIOServer {
    const server = super.createIOServer(port, options) as SocketIOServer
    if (!this.adapterConstructor) {
      throw new Error('RedisIoAdapter.connectToRedis() must be called before createIOServer()')
    }

    server.adapter(this.adapterConstructor)
    return server
  }
}
