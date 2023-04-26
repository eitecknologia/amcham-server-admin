import { Router } from "express";
import { check } from "express-validator";
import { validateJwt } from "../middleware/jwt-validate";
import {
  getRanges,
  createRange,
  updateRange,
  deleteRange,
} from "../controllers/ranges";
import { fieldsValidate } from "../middleware/fields-validate";
import { validateRangeType } from "../helpers/ranges-type";

const rangesRouter: Router = Router();

/* Service - Get All Ranges */
rangesRouter.get(
  "/get_all_ranges",
  [
    validateJwt,
    check("range_type", "El tipo de rango es obligatorio").trim().notEmpty(),
    check("range_type").custom(validateRangeType),
    fieldsValidate,
  ],
  getRanges
);

/* Service - Create Range */
rangesRouter.post(
    "/create_range",
    [
        validateJwt,
        check("range_type", "El tipo de rango es obligatorio").trim().notEmpty(),
        check("range_type").custom(validateRangeType),
        check("from_range", "El rango desde es obligatorio").trim().notEmpty(),
        check("to_range", "El rango hasta es obligatorio").trim().notEmpty(),
        check("base", "La base es obligatoria").trim().notEmpty(),
        check("excess_percentage", "El porcentaje de exceso es obligatorio").trim().notEmpty(),
        fieldsValidate,
    ],
    createRange
);

/* Service - Update Range */
rangesRouter.put(
    "/update_range/:range_id",
    [
        validateJwt,
        check("from_range", "El rango desde es obligatorio").optional().trim().notEmpty(),
        check("to_range", "El rango hasta es obligatorio").optional().trim().notEmpty(),
        check("base", "La base es obligatoria").optional().trim().notEmpty(),
        check("excess_percentage", "El porcentaje de exceso es obligatorio").optional().trim().notEmpty(),
        fieldsValidate,
    ],
    updateRange
);

/* Service - Delete Range */
rangesRouter.delete(
    "/delete_range/:range_id",
    [
        validateJwt,
        check("range_id", "El id del rango es obligatorio").trim().notEmpty(),
        fieldsValidate,
    ],
    deleteRange
);

export default rangesRouter;