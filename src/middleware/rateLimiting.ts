import redisClient from "@/services/redisClient";
import { Request, Response, NextFunction } from "express";

interface RateLimitOptions {
  time: number;
  maxRequests: number;
}

export function rateLimitingOnIndividualIp({
  time,
  maxRequests,
}: RateLimitOptions) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const ip = Array.isArray(req.headers["x-forwarded-for"])
      ? req.headers["x-forwarded-for"][0]
      : req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        "127.0.0.1";
    // console.log("ip---------", ip);
    const requests = await redisClient.increment(ip);
    let ttl;
    if (requests === 1) {
      await redisClient.expire(ip, time);
      ttl = time;
    } else {
      ttl = await redisClient.ttl(ip);
    }

    if (requests > maxRequests) {
      res
        .status(429)
        .send(`Max Requests Limit exceeded. Try again in ${ttl} seconds`);
    } else {
      next();
    }
  };
}

export function rateLimitingOnIndividualUserAndIp({
  time,
  maxRequests,
}: RateLimitOptions) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const userId = parseInt(req.params.id);
    const ip = Array.isArray(req.headers["x-forwarded-for"])
      ? req.headers["x-forwarded-for"][0]
      : req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        "127.0.0.1";
    // console.log("ip---------", ip);
    const ipAndUserId = `${ip}:${userId}`;
    const requests = await redisClient.increment(ipAndUserId);
    // console.log("requests---------", requests);
    let ttl;
    if (requests === 1) {
      await redisClient.expire(ipAndUserId, time);
      ttl = time;
    } else {
      ttl = await redisClient.ttl(ipAndUserId);
    }

    if (requests > maxRequests) {
      res.status(429).send(`Rate limit exceeded. Try again in ${ttl} seconds`);
    } else {
      next();
    }
  };
}
