import { log } from "console";
import { NextFunction, Request, Response } from "express";
import moment from "moment";

export class CreateTransfersMiddleware {
  public static validate(req: Request, res: Response, next: NextFunction) {
    const { externalId, amount, expectedOn, type } = req.body;

    if (!type || (type !== "Entrada" && type !== "Saida")) {
      return res.status(400).json({
        ok: false,
        message: "Tipo da transação inválida!",
      });
    }
    const dateFormated = moment(expectedOn, "DD/MM/YYYY");

    if (
      expectedOn &&
      new Date(dateFormated.format("YYYY-MM-DD")) < new Date()
    ) {
      return res.status(400).json({
        ok: false,
        message: "Data de vencimento é menor que a data atual",
      });
    }

    if (!amount || amount <= 0 || typeof amount !== "number") {
      return res.status(400).json({
        ok: false,
        message: "Valor da transferência é obrigatório",
      });
    }

    if (!externalId) {
      return res.status(400).json({
        ok: false,
        message: "Id externo é obrigatório!",
      });
    }

    return next();
  }
}
