import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import client from "prom-client";
import "module-alias/register";
import responseTime from "response-time";

import { registerRoutes } from "./routes";
import { DOMAIN } from "./constants/variables";
// logger
import { createLogger, transports } from "winston";
import LokiTransport from "winston-loki";
const options = {
  transports: [
    new LokiTransport({
      labels: { app: "safefoods" },
      host: "http://192.168.0.104:3100",
    }),
  ],
};
const logger = createLogger(options);
const app = express();
const port = 8000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: DOMAIN,
    credentials: true,
  }),
);

// Prometheus
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

// custom metrics
const reqResTime = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [
    1, 50, 100, 200, 300, 400, 500, 1000, 2000, 3000, 4000, 5000, 10000, 20000,
    30000, 40000, 50000,
  ],
});
const totalRequests = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

app.use((req, res, next) => {
  totalRequests.inc({
    method: req.method,
    route: req.url,
    status_code: res.statusCode,
  });
  next();
});

app.use(
  responseTime((req, res, time) => {
    reqResTime
      .labels({
        method: req.method,
        route: req.url,
        status_code: res.statusCode,
      })
      .observe(time);
  }),
);

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  const metrics = await client.register.metrics();
  res.send(metrics);
});

app.get("/health", (req, res) => {
  // logger.info("Server is running");
  logger.error("Server crashed");
  res.status(200).send("Server is running");
});

app.use(express.raw({ type: "application/octet-stream", limit: "50mb" }));
// Routes
registerRoutes(app);
app.get("/", (req: Request, res: Response) => {
  logger.info("Hello, from safefoods api!");
  res.status(200).send("Hello, from safefoods api!");
});

// Start Server
app.listen(port, () => {
  // console.log(`Server is running at http://localhost:${port}`);
});
