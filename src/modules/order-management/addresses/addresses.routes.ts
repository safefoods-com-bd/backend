import { RequestHandler, Router } from "express";
import { createAddressV100 } from "./controllers/create-address.controller";
import { getUserAddressesV100 } from "./controllers/get-user-addresses.controller";
import { updateAddressV100 } from "./controllers/update-address.controller";
import {
  deleteAddressV100,
  deleteAddressesBatchV100,
} from "./controllers/delete-address.controller";

const router = Router();

// Get all addresses for a specific user with pagination
router.get("/user/:userId", getUserAddressesV100 as RequestHandler);

// Create a new address
router.post("/", createAddressV100 as RequestHandler);

// Update an existing address
router.patch("/:id", updateAddressV100 as RequestHandler);

// Delete a single address
router.delete("/:id", deleteAddressV100 as RequestHandler);

router.delete("/batch", deleteAddressesBatchV100 as RequestHandler);

export default router;
