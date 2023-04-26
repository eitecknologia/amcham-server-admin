import { CalculationType } from "../common/constants";

// Create a helper to validate if range type is valid using CalculationType enum else Throw an error
export const validateRangeType = (range_type: string) => {
  if (!Object.values(CalculationType).includes(range_type as CalculationType)) {
    throw new Error("Range Type is not valid");
  } else {
    return true;
  }
};
