const { validationResult } = require('../middleware/utils')
const validator = require('validator')
const { check } = require('express-validator')

/**
 * Validates update profile request
 */
exports.updateProfile = [
  // check('phone')
  // .exists()
  // .withMessage('MISSING')
  // .not()
  // .isEmpty()
  // .withMessage('IS_EMPTY')
  // .trim(),
  check('city')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
  check('country')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
  check('firstname')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
  check('lastname')
    .optional()
    .trim(),
  check('address')
    .optional()
    .trim(),
  check('postalCode')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
  check('aboutMe')
    .optional()
    .trim(),
  check('urlTwitter')
    .optional()
    .custom(v => (v === '' ? true : validator.isURL(v)))
    .withMessage('NOT_A_VALID_URL'),
  check('urlGitHub')
    .optional()
    .custom(v => (v === '' ? true : validator.isURL(v)))
    .withMessage('NOT_A_VALID_URL'),
  check('id')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates change password request
 */
exports.changePassword = [
  check('oldPassword')
    .optional()
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isLength({
      min: 5
    })
    .withMessage('PASSWORD_TOO_SHORT_MIN_5'),
  check('newPassword')
    .optional()
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isLength({
      min: 5
    })
    .withMessage('PASSWORD_TOO_SHORT_MIN_5'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates verify request
 */
exports.verify = [
  check('id')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]
