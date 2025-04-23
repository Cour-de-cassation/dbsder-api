import { missingValue, notSupported, unexpectedError } from "./error";
import axios, { AxiosError } from "axios";

if (process.env.ZONING_API_URL == null)
  throw missingValue("process.env.ZONING_API_URL", new Error());
const { ZONING_API_URL } = process.env;

export type ZoningParameters = {
  arret_id: number;
  source: "tj" | "ca" | "cc" | "tcom";
  text: string;
};

export type ZoningReponse = { [k: string]: unknown }

export async function fetchZoning(parameters: ZoningParameters): Promise<ZoningReponse> {
  try {
    const result = await axios<{ data: ZoningReponse }>({
      data: parameters,
      headers: { "Content-Type": "application/json" },
      method: "post",
      url: `${ZONING_API_URL}/zonage`,
    });
    return result.data;
  } catch (err) {
    if (!(err instanceof AxiosError)) throw unexpectedError(new Error())
    if (err instanceof AxiosError && err.response && err.response.status && err.response.status < 400 && err.response.status >= 500)
        throw unexpectedError(new Error("Zoning service is currently unavailable"))

    throw notSupported("zoning parameters", parameters, err)
  }
}
