import axios, { Axios, AxiosResponse } from "axios";

type TransferType = "Entrada" | "Saida";

type TransferStatus = "Processing" | "Completed" | "Failed" | "Pending";

interface TransferData {
  externalId: string;
  amount: number;
  expectedOn?: Date | null;
  type: TransferType;
  status: TransferStatus;
}

export const sendToLiquidationPlatform = async (transfer: TransferData) => {
  try {
    let response: AxiosResponse<any> | undefined;

    if (transfer.type === "Entrada") {
      response = await axios.post(
        "http://localhost:8081/liquidate/inbound",
        transfer
      );
    }

    if (transfer.type === "Saida") {
      response = await axios.post(
        "http://localhost:8081/liquidate/outbound",
        transfer
      );
    }

    if (response) {
      return response.data;
    } else {
      return {
        ok: false,
        message: "Não foi possivel realizar a operação!",
      };
    }
  } catch (err) {
    return {
      ok: false,
      message: `Ocorreu um erro inesperado. Erro: ${(err as Error).name} - ${
        (err as Error).message
      }`,
    };
  }
};
