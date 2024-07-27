import { NextFunction, Request, Response } from "express";

export class CreateTransfersMiddleware {
  public static validate(req: Request, res: Response, next: NextFunction) {
    const { externalID, amount, expectedOn, type } = req.body;

    if (!type || type !== "Entrada" || type !== "Saida") {
      return res.status(400).json({
        ok: false,
        message: "Tipo da transação inválida!",
      });
    }

    if (expectedOn && new Date(expectedOn) < new Date()) {
      return res.status(400).json({
        ok: false,
        message: "Data de vencimento menor que a data atual",
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        ok: false,
        message: "Valor da transferência é obrigatório",
      });
    }

    if (!externalID || typeof externalID !== "string") {
      return res.status(400).json({
        ok: false,
        message: "Id externo é obrigatório!",
      });
    }

    return next();
  }
}
