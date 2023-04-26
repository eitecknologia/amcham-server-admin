/* Get All academies Function */
import { Request, Response } from "express";
import { HistoryCalcs } from "../models";
import { infoPaginate, validatePaginateParams } from "../helpers/pagination";

/* Get All History Calculations Function */
export const getAllHistoryCalcs = async (request: Request, response: Response) => {
    try {

        const { calculation_type } = request.body;
        /* Pagination Params */
        const { page, size } = request.query;
        const { offset, limit, pageSend, sizeSend } = await validatePaginateParams(page, size);

        const { count: total, rows: calculations } = await HistoryCalcs.findAndCountAll({
            attributes: ["history_calcs_id", "name","email","company_name","phone_number","calculation_type","consulted_amount","result","date"],
            where: { calculation_type: calculation_type },
            order: [['date', 'DESC']],
            offset: (offset - sizeSend),
            limit
        })

        /* Calculate the total of pages */
        const totalPages = (Math.ceil(total / limit));
        const info = await infoPaginate(totalPages, total, pageSend, sizeSend);

        return response.status(200).json({
            ok: true,
            msg: "Historial de cálculos obtenido correctamente",
            info,
            academies: calculations
        })

    } catch (error) {
        return response.status(500).json({
            ok: false,
            msg: "Internal Server Error",
            error
        })
    }
}
