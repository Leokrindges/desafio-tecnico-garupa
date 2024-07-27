import { Request, Response } from "express";
import { prismaConnection } from "../../database/prisma.connection";
import { sendToLiquidationPlatform } from "../../services/liquidation.Service";
import moment from "moment";

export class TransferController {
  public static async create(req: Request, res: Response) {
    try {
      const { externalId, amount, expectedOn, type } = req.body;

      const dateFormated = moment(expectedOn, "DD/MM/YYYY");

      const newTransfer = await prismaConnection.transfer.create({
        data: {
          externalId,
          amount: amount,
          expectedOn: expectedOn
            ? new Date(dateFormated.format("YYYY-MM-DD"))
            : null,
          type,
          status: "Pending",
        },
      });

      const response = await sendToLiquidationPlatform(newTransfer);

      const data = await prismaConnection.transfer.update({
        where: { id: newTransfer.id },
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

  public static async listAl(req: Request, res: Response) {
    try {
      let { limit, page } = req.query;

      let limitdDefault = 10;
      let pageDefault = 1;

      if (limit) {
        limitdDefault = Number(limit);
      }

      if (page) {
        pageDefault = Number(page);
      }

      const data = await prismaConnection.transfer.findMany({
        skip: limitdDefault * (pageDefault - 1),
        take: limitdDefault,
        orderBy: { createdAt: "desc" },
      });

      const count = await prismaConnection.transfer.count({});

      return res.status(200).json({
        ok: true,
        message: "Transferências listadas com sucesso.",
        data,
        pagination: {
          limit: limitdDefault,
          page: pageDefault,
          count: count,
          totalPages: Math.ceil(count / limitdDefault),
        },
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

  public static async listbyId(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const data = await prismaConnection.transfer.findMany({
        where: { id: id },
      });

      if (!data.length) {
        return res.status(404).json({
          ok: false,
          message: "Transferência não encontrada.",
        });
      }

      const count = await prismaConnection.transfer.count({});

      return res.status(200).json({
        ok: true,
        message: "Transferência listada com sucesso.",
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
