import Joi from 'joi';

export const validationObject = (t, translationPath) => ({
  bedroom: Joi.number()
    .required()
    .messages({
      'number.base': t(`${translationPath}bedroom-is-required`),
      'number.empty': t(`${translationPath}bedroom-is-required`),
    }),
  unitFor: Joi.number()
    .required()
    .messages({
      'number.base': t(`${translationPath}unit-for-is-required`),
      'number.empty': t(`${translationPath}unit-for-is-required`),
    }),
  property: Joi.number()
    .required()
    .messages({
      'number.base': t(`${translationPath}property-is-required`),
      'number.empty': t(`${translationPath}property-is-required`),
    }),
  areaSize: Joi.number()
    .required()
    .messages({
      'number.base': t(`${translationPath}area-size-is-required`),
      'number.empty': t(`${translationPath}area-size-is-required`),
    }),
  unitType: Joi.number()
    .required()
    .messages({
      'number.base': t(`${translationPath}unit-type-is-required`),
      'number.empty': t(`${translationPath}unit-type-is-required`),
    }),
  unitModel: Joi.string()
    .required()
    .messages({
      'string.empty': t(`${translationPath}unit-model-is-required`),
    }),
  community: Joi.number()
    .required()
    .messages({
      'number.base': t(`${translationPath}community-is-required`),
      'number.empty': t(`${translationPath}community-is-required`),
    }),
  moveInDate: Joi.number()
    .required()
    .messages({
      'number.base': t(`${translationPath}move-in-date-is-required`),
      'number.empty': t(`${translationPath}move-in-date-is-required`),
    }),
  movingMonth: Joi.number()
    .required()
    .messages({
      'number.base': t(`${translationPath}moving-month-is-required`),
      'number.empty': t(`${translationPath}moving-month-is-required`),
    }),
  expectedRoi: Joi.number()
    .required()
    .messages({
      'number.base': t(`${translationPath}expected-roi-is-required`),
      'number.empty': t(`${translationPath}expected-roi-is-required`),
    }),
  unitLocation: Joi.number()
    .required()
    .messages({
      'number.base': t(`${translationPath}unit-location-is-required`),
      'number.empty': t(`${translationPath}unit-location-is-required`),
    }),
  projectStatus: Joi.number()
    .required()
    .messages({
      'number.base': t(`${translationPath}project-status-is-required`),
      'number.empty': t(`${translationPath}project-status-is-required`),
    }),
  paymentMethod: Joi.number()
    .required()
    .messages({
      'number.base': t(`${translationPath}payment-method-is-required`),
      'number.empty': t(`${translationPath}payment-method-is-required`),
    }),
  askingMinPrice: Joi.number()
    .required()
    .messages({
      'number.base': t(`${translationPath}asking-min-price-is-required`),
      'number.empty': t(`${translationPath}asking-min-price-is-required`),
    }),
  askingMaxPrice: Joi.number()
    .required()
    .messages({
      'number.base': t(`${translationPath}asking-max-price-is-required`),
      'number.empty': t(`${translationPath}asking-max-price-is-required`),
    }),
  unitPrimaryViews: Joi.number()
    .required()
    .messages({
      'number.base': t(`${translationPath}primary-view-is-required`),
      'number.empty': t(`${translationPath}primary-view-is-required`),
    }),
  extraRequirements: Joi.string()
    .required()
    .messages({
      'string.empty': t(`${translationPath}extra-requirements-is-required`),
    }),
  unitSecondaryViews: Joi.number()
    .required()
    .messages({
      'number.base': t(`${translationPath}secondary-view-is-required`),
      'number.empty': t(`${translationPath}secondary-view-is-required`),
    }),
  relatedLeadNumberId: Joi.number()
    .required()
    .messages({
      'number.base': t(`${translationPath}lead-is-required`),
      'number.empty': t(`${translationPath}lead-is-required`),
    }),
  locationRequirements: Joi.number()
    .required()
    .messages({
      'number.base': t(`${translationPath}location-is-required`),
      'number.empty': t(`${translationPath}location-is-required`),
    }),
});
