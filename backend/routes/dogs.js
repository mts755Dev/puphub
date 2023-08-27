"use strict";

/** Routes for companies. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureCorrectUserOrAdmin } = require("../middleware/auth");
const Dog = require("../models/dog");

const dogNewSchema = require("../schemas/dogNew.json");
// const companyUpdateSchema = require("../schemas/companyUpdate.json");
const dogSearchSchema = require("../schemas/dogSearch.json");

const router = new express.Router();


/** POST / { company } =>  { company }
 *
 * company should be { handle, name, description, numEmployees, logoUrl }
 *
 * Returns { handle, name, description, numEmployees, logoUrl }
 *
 * Authorization required: admin or same user
 */

router.post("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, dogNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const dog = await Dog.create(req.body, req.params.username);
    return res.status(201).json({ dog });
  } catch (err) {
    return next(err);
  }
});

/** GET /  =>
 *   { companies: [ { handle, name, description, numEmployees, logoUrl }, ...] }
 *
 * Can filter on provided search filters:
 * - minEmployees
 * - maxEmployees
 * - nameLike (will find case-insensitive, partial matches)
 *
 * Authorization required: none
 */


router.get("/", async function (req, res, next) {
  const q = req.query;
  // arrive as strings from querystring, but we want as ints
  // if (q.minEmployees !== undefined) q.minEmployees = +q.minEmployees;
  // if (q.maxEmployees !== undefined) q.maxEmployees = +q.maxEmployees;

  try {
    const validator = jsonschema.validate(q, dogSearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const dogs = await Dog.findAll(q);
    return res.json({ dogs });
  } catch (err) {
    return next(err);
  }
});

/** GET specific dog /[handle]  =>  { company }
 *
 *  Company is { handle, name, description, numEmployees, logoUrl, jobs }
 *   where jobs is [{ id, title, salary, equity }, ...]
 *
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
  try {
    const dog = await Dog.get(req.params.id);
    return res.json({ dog });
  } catch (err) {
    return next(err);
  }
});

/** GET Users dogs
 *
 *  Company is { handle, name, description, numEmployees, logoUrl, jobs }
 *   where jobs is [{ id, title, salary, equity }, ...]
 *
 * Authorization required: none
 */

router.get("/user/:username", async function (req, res, next) {
  try {
    const dogs = await Dog.getUsersDogs(req.params.username);
    return res.json({ dogs });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[handle] { fld1, fld2, ... } => { company }
 *
 * Patches company data.
 *
 * fields can be: { name, description, numEmployees, logo_url }
 *
 * Returns { handle, name, description, numEmployees, logo_url }
 *
 * Authorization required: admin
 */

// router.patch("/:handle", ensureAdmin, async function (req, res, next) {
//   try {
//     const validator = jsonschema.validate(req.body, companyUpdateSchema);
//     if (!validator.valid) {
//       const errs = validator.errors.map(e => e.stack);
//       throw new BadRequestError(errs);
//     }

//     const company = await Company.update(req.params.handle, req.body);
//     return res.json({ company });
//   } catch (err) {
//     return next(err);
//   }
// });

/** DELETE /[handle]  =>  { deleted: handle }
 *
 * Authorization: admin or current user
 */

router.delete("/:id", async function (req, res, next) {
  try {
    await Dog.remove(req.params.id, res.locals.user.username);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
