import { RequestHandler, Router } from "express";
import { listAllCategoryLevelsV100 } from "./controllers/listCategoryLevel.controller";
import { createCategoryLevelV100 } from "./controllers/createCategoryLevel.controller";

const router = Router();

router.get("/", listAllCategoryLevelsV100 as RequestHandler);

router.post("/", createCategoryLevelV100 as RequestHandler);

export default router;
