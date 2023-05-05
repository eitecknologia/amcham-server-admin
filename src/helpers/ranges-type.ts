import { CalculationType } from "../common/constants";

// Create a helper to validate if range type exists
export const validateRangeType = (range_type: string) => {
  if (!Object.values(CalculationType).includes(range_type as CalculationType)) {
    throw new Error("Tipo de rango inválido");
  } else {
    return true;
  }
};
