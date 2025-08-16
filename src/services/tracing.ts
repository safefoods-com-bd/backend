import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";

export const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: "http://192.168.0.108:4318/v1/traces",
  }),
  instrumentations: [getNodeAutoInstrumentations()],
  serviceName: "safefoods-api",
});
