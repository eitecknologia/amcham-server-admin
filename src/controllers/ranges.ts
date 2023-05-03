import { Request, Response } from "express";
import { Range, RangeAttributes } from "../models";
import { Op } from "sequelize";

// Get all ranges function
export const getRanges = async (request: Request, response: Response) => {
  try {
    const { range_type }: Partial<RangeAttributes> = request.query;

    // Get all ranges if exists any
    const ranges = await Range.findAll({
      where: {
        range_type,
      },
      order: [["from_range", "ASC"]],
    });

    // Validate if exists any range
    if (!ranges) {
      return response.status(404).json({
        ok: false,
        msg: "No se encontraron rangos para este tipo de rango",
      });
    }

    return response.status(200).json({
      ok: true,
      msg: `Lista de rangos tipo ${range_type}`,
      ranges: ranges,
    });
  } catch (error) {
    return response.status(500).json({
      ok: false,
      msg: "Internal Server Error",
      error,
    });
  }
};

// Create Range function
export const createRange = async (request: Request, response: Response) => {
  try {
    const {
      range_type,
      from_range,
      to_range,
      base,
      excess_percentage,
    }: RangeAttributes = request.body;

    // Get previous range base on the range_type and the can_delete field
    const previousRange = await Range.findOne({
      where: {
        range_type,
        can_delete: true,
      },
    });

    // Check if from range is greater than to range
    if (Number(from_range) > Number(to_range)) {
      return response.status(400).json({
        ok: false,
        msg: `"HASTA no puede ser menor a "DESDE" en el rango`,
      });
    }

    if (previousRange) {
      if (previousRange.to_range > from_range) {
        return response.status(400).json({
          ok: false,
          msg: `El valor "DESDE" no puede ser menor al valor "HASTA" del rango anterior`,
        });
      } else if (base < 0) {
        return response.status(400).json({
          ok: false,
          msg: "La BASE no puede ser menor a 0",
        });
      } else if (excess_percentage < 0) {
        return response.status(400).json({
          ok: false,
          msg: "El PORCENTAJE DE EXCESO no puede ser menor a 0",
        });
      } else {
      }
    }

    // Create Range
    const range = await Range.create({
      range_type,
      from_range,
      to_range,
      base,
      excess_percentage,
      can_delete: true,
    });

    // Change can_delete to false in the previous range
    if (previousRange) {
      previousRange.can_delete = false;
      previousRange.to_range = from_range - 0.1;
      await previousRange.save();
    }

    return response.status(201).json({
      ok: true,
      msg: "Rango creado exitosamente",
      range: range,
    });
  } catch (error) {
    return response.status(500).json({
      ok: false,
      msg: "Internal Server Error",
      error,
    });
  }
};

export const updateRange = async (request: Request, response: Response) => {
  try {
    const { range_id }: Partial<RangeAttributes> = request.params;
    const { from_range, to_range, base, excess_percentage }: RangeAttributes =
      request.body;

    let previousRange: RangeAttributes | null = null;
    let nextRange: RangeAttributes | null = null;

    // Find range_type in the current range
    const currentRange = await Range.findOne({
      where: {
        range_id,
      },
    });

    if (currentRange) {
      // Find the previous range
      previousRange = await Range.findOne({
        where: {
          range_type: currentRange.range_type,
          to_range: { [Op.lt]: currentRange.from_range },
        },
        order: [["to_range", "DESC"]],
      });

      // Find the next range
      nextRange = await Range.findOne({
        where: {
          range_type: currentRange.range_type,
          from_range: { [Op.gt]: currentRange.to_range },
        },
        order: [["from_range", "ASC"]],
      });
    } else {
      return response.status(404).json({
        ok: false,
        msg: "Rango no encontrado",
      });
    }

    if (from_range > to_range) {
      return response.status(400).json({
        ok: false,
        msg: `"HASTA no puede ser menor a "DESDE" en el rango`,
      });
    } else if (base < 0) {
      return response.status(400).json({
        ok: false,
        msg: "La BASE no puede ser menor a 0",
      });
    } else if (excess_percentage < 0) {
      return response.status(400).json({
        ok: false,
        msg: "El PORCENTAJE DE EXCESO no puede ser menor a 0",
      });
    }

    if (previousRange && from_range) {
      if (from_range < previousRange.from_range + 5) {
        return response.status(400).json({
          ok: false,
          msg: `El valor "DESDE" no puede ser menor al valor "DESDE" del rango anterior, el valor mínimo entre rangos es 5.`,
        });
      } else {
        previousRange.to_range = from_range - 0.1;
        await previousRange.save();
      }
    }

    if (nextRange && to_range) {
      if (to_range > nextRange.to_range - 5) {
        return response.status(400).json({
          ok: false,
          msg: `El valor "HASTA" no puede ser mayor al valor "HASTA" del siguiente rango, el valor mínimo entre rangos es 5.`,
        });
      } else {
        nextRange.from_range = Number(to_range) + 0.1;
        await nextRange.save();
      }
    }

    // Update Range
    const updates: Partial<RangeAttributes> = {};

    if (from_range) updates.from_range = from_range;
    if (to_range) updates.to_range = to_range;
    if (base) updates.base = base;
    if (excess_percentage) updates.excess_percentage = excess_percentage;

    await currentRange.update(updates);

    return response.status(200).json({
      ok: true,
      msg: "Rango actualizado exitosamente",
      range: currentRange,
    });
  } catch (error) {
    return response.status(500).json({
      ok: false,
      msg: "Internal Server Error",
      error,
    });
  }
};

export const deleteRange = async (request: Request, response: Response) => {
  try {
    const { range_id }: Partial<RangeAttributes> = request.params;

    const currentRange = await Range.findByPk(range_id);

    let previousRange: RangeAttributes | null = null;

    if (currentRange) {
      previousRange = await Range.findOne({
        where: {
          range_type: currentRange.range_type,
          to_range: { [Op.lt]: currentRange.from_range },
        },
        order: [["to_range", "DESC"]],
      });
    } else {
      return response.status(404).json({
        ok: false,
        msg: "Rango no encontrado",
      });
    }

    // Delete range when can_delete is true
    if (!currentRange.can_delete) {
      return response.status(400).json({
        ok: false,
        msg: "No se puede eliminar el rango, elimine el último rango primero.",
      });
    }

    await currentRange.destroy();

    // Update can_delete to true in the previous range
    if (previousRange) {
      previousRange.can_delete = true;
      await previousRange.save();
    }

    return response.status(200).json({
      ok: true,
      msg: "Range Deleted",
      range: currentRange,
    });
  } catch (error) {
    return response.status(500).json({
      ok: false,
      msg: "Internal Server Error",
      error,
    });
  }
};
