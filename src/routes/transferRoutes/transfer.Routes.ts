import { Router } from "express";
import { CreateTransfersMiddleware } from "../../middlewares/transfers/transfers.middleware";
import { TransferController } from "../../controllers/transfer/transfer.controller";
import { ValidUuidParamsMiddleware } from "../../middlewares/common/Valid-uui-paramans.middlaware";

export class TransfersRouts {
  public static execute(): Router {
    const router = Router();

    router.post(
      "/",
      [CreateTransfersMiddleware.validate],
      TransferController.create
    );
    router.get(
      "/",
      [ValidUuidParamsMiddleware.validate],
      TransferController.listAl
    );

    return router;
  }
}
