import Redis from "ioredis";

class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis(process.env.REDIS_URL || "redis://redis:6379");

    this.client.on("error", (err) => {
      // TODO: Implement proper error logging mechanism
      throw new Error(`Redis Client Error: ${err.message}`);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async set(key: string, value: any, expirationInSeconds?: number) {
    const stringValue = JSON.stringify(value);
    if (expirationInSeconds) {
      await this.client.set(key, stringValue, "EX", expirationInSeconds);
    } else {
      await this.client.set(key, stringValue);
    }
  }

  async get(key: string) {
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  async del(key: string) {
    await this.client.del(key);
  }

  async invalidateUserPermissions(userId: string) {
    await this.del(`user:permissions:${userId}`);
  }

  async increment(key: string): Promise<number> {
    return await this.client.incr(key);
  }

  async expire(key: string, expirationInSeconds: number) {
    await this.client.expire(key, expirationInSeconds);
  }
  async ttl(key: string) {
    return await this.client.ttl(key);
  }
}

export default new RedisService();
