import http from "k6/http";
import { sleep, check } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
export const options = {
  vus: 50, // number of virtual users
  duration: "5s", // duration of the test
};

export default function () {
  const res = http.get("http://212.28.189.176:8000/health"); // Use internal service name if running inside Docker
  check(res, {
    "status is 200": (r) => r.status === 200,
  });
  sleep(1);
}

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}

// docker run --rm \
//   --network compress-app-network \
//   -v /home/arafat-pc/softeko/in-house-products/compress-pdf/phase3/backend/scripts:/scripts \
//   grafana/k6 run /scripts/load-test.js
