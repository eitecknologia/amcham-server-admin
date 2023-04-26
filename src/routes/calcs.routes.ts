import { Router, Request, Response } from "express";
import { check } from "express-validator";
import { getAllHistoryCalcs } from "../controllers/history-calcs";
import { fieldsValidate } from "../middleware/fields-validate";
import { validateJwt } from "../middleware/jwt-validate";

const calcsRouter: Router = Router();

/* Service - Get All History Calculations */
calcsRouter.post('/get_all_history_calcs', [
    validateJwt,
    check('calculation_type', 'El tipo de cálculo es obligatorio').trim().notEmpty(),
    fieldsValidate
], getAllHistoryCalcs);

export default calcsRouter;
