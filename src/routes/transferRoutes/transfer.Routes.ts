import { Router } from "express";
import { CreateTransfersMiddleware } from "../../middlewares/transfers/transfers.middleware";
import { TransferController } from "../../controllers/transfer/transfer.controller";

export class TransfersRouts {
  public static execute(): Router {
    const router = Router();

    router.post("/", [CreateTransfersMiddleware.validate], TransferController.create)

    return router
  }
}
