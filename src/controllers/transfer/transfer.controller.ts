import { Request, Response } from "express";
import { prismaConnection } from "../../database/prisma.connection";
import { sendToLiquidationPlatform } from "../../services/liquidation.Service";
import moment from "moment";

export class TransferController {
  public static async create(req: Request, res: Response) {
    try {
      const { externalId, amount, expectedOn, type } = req.body;

      const dateFormated = moment(expectedOn, "DD/MM/YYYY");

      const data = await prismaConnection.transfer.create({
        data: {
          externalId,
          amount: parseFloat(Number(amount).toFixed(2)),
          expectedOn: expectedOn
            ? new Date(dateFormated.format("YYYY-MM-DD"))
            : null,
          type,
          status: "Pending",
        },
      });

      const response = await sendToLiquidationPlatform(data);

      await prismaConnection.transfer.update({
        where: { id: data.id },
        data: { status: response.ok ? "Completed" : "Failed" },
      });

      if (!response.ok) {
        return res.status(400).json({
          ok: false,
          message: "Falha ao processar a transferência",
          data,
        });
      }

      return res.status(201).json({
        ok: true,
        message: `Transferência concluida com sucesso`,
        data,
      });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        message: `Ocorreu um erro inesperado. Erro: ${(err as Error).name} - ${
          (err as Error).message
        }`,
      });
    }
  }
}
