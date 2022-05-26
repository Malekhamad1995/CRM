import Joi from 'joi';

export const MyLeadFieldsValidations = (state, translationPath, t) => {
  const schema = Joi.object({
    leadClassId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}lead-class-is-required`),
        'number.empty': t(`${translationPath}lead-class-is-required`),
      }),
    salutationId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}salutation-is-required`),
        'number.empty': t(`${translationPath}salutation-is-required`),
      }),
    firstName: Joi.string()
      .required()
      .messages({
        'string.empty': t(`${translationPath}first-name-is-required`),
      }),
    lastName: Joi.string()
      .required()
      .messages({
        'string.empty': t(`${translationPath}last-name-is-required`),
      }),
    // mobileNumbers: Joi.array()
    //   .min(1)
    //   .required()
    //   .messages({
    //     'array.min': t(`${translationPath}mobile-number-is-required`),
    //   }),
    // emailAddresses: Joi.array()
    //   .min(1)
    //   .required()
    //   .messages({
    //     'array.min': t(`${translationPath}email-is-required`),
    //   }),
    languageId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}language-is-required`),
        'number.empty': t(`${translationPath}language-is-required`),
      }),
    nationalityId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}nationality-is-required`),
        'number.empty': t(`${translationPath}nationality-is-required`),
      }),
      MethodOfContact: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}MethodOfContact-is-required`),
        'number.empty': t(`${translationPath}MethodOfContact-is-required`),
      }),
      mediaDetailId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}mediaDetail-is-required`),
        'number.empty': t(`${translationPath}mediaDetail-is-required`),
      }),
    unitTypeId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}unit-type-is-required`),
        'number.empty': t(`${translationPath}unit-type-is-required`),
      }),
    priceFrom: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}price-is-required`),
        'number.empty': t(`${translationPath}price-is-required`),
      }),
    areaFrom: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}area-is-required`),
        'number.empty': t(`${translationPath}area-is-required`),
      }),
    leadStatusId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}lead-status-is-required`),
        'number.empty': t(`${translationPath}lead-status-is-required`),
      }),
    leadRatingId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}lead-rating-is-required`),
        'number.empty': t(`${translationPath}lead-rating-is-required`),
      }),


    referredTo:
      (state.isForAutoRotation !== true &&
        Joi.string()
          .required()
          .messages({
            'number.base': t(`${translationPath}referredTo-is-required`),
            'number.empty': t(`${translationPath}referredTo-is-required`),
          })) ||
      Joi.any(),
    closedReasonId:
      (state.leadStatusId && state.leadStatusId === 458 &&
        Joi.number()
          .required()
          .messages({
            'number.base': t(`${translationPath}closeLeadResoun-is-required`),
            'number.empty': t(`${translationPath}closeLeadResoun-is-required`),
          })) ||
      Joi.any(),
    propertyId:
      ((state.leadClassId && (state.leadClassId === 1 || state.leadClassId === 2)) &&
        Joi.number()
          .required()
          .messages({
            'number.base': t(`${translationPath}propertyId-is-required`),
            'number.empty': t(`${translationPath}propertyId-is-required`),
          })) ||
      Joi.any()
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);
  return schema;
};
