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
        msg: "No se encontraron rangos",
      });
    }

    return response.status(200).json({
      ok: true,
      msg: `${range_type} Range List`,
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

    console.log(previousRange);

    if (previousRange) {
      if (previousRange.to_range > from_range) {
        return response.status(400).json({
          ok: false,
          msg: "El rango desde no puede ser menor al rango hasta anterior",
        });
      } else if (Number(from_range) > Number(to_range)) {
        return response.status(400).json({
          ok: false,
          msg: "Hasta no puede ser menor a desde en el rango",
        });
      } else if (base < 0) {
        return response.status(400).json({
          ok: false,
          msg: "La base no puede ser menor a 0",
        });
      } else if (excess_percentage < 0) {
        return response.status(400).json({
          ok: false,
          msg: "El porcentaje de exceso no puede ser menor a 0",
        });
      } else {
      }
    }

    // Check if from range is greater than to range
    if (Number(from_range) > Number(to_range)) {
      return response.status(400).json({
        ok: false,
        msg: "Hasta no puede ser menor a desde en el rango",
      });
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
      msg: "Range Created",
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
        msg: "Range Not Found",
      });
    }

    if (from_range > to_range) {
      return response.status(400).json({
        ok: false,
        msg: "Hasta no puede ser menor a desde en el rango",
      });
    } else if (base < 0) {
      return response.status(400).json({
        ok: false,
        msg: "La base no puede ser menor a 0",
      });
    } else if (excess_percentage < 0) {
      return response.status(400).json({
        ok: false,
        msg: "El porcentaje de exceso no puede ser menor a 0",
      });
    } else {
    }

    if (previousRange && from_range) {
      if (from_range < previousRange.from_range + 5) {
        return response.status(400).json({
          ok: false,
          msg: "El rango desde no puede ser menor al rango desde anterior minimo 5 entre rangos",
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
          msg: "El rango hasta no puede ser mayor al rango hasta siguiente minimo 5 entre rangos",
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
      msg: "Range Updated",
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
        msg: "Range Not Found",
      });
    }

    // Delete range when can_delete is true
    if (!currentRange.can_delete) {
      return response.status(400).json({
        ok: false,
        msg: "No se puede eliminar el rango",
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
