
export function MaritalStatusRule(item, value, itemList) {
    if (!item.data.specialKey === 'marital_status') return;

    const effectedOn = itemList.find((f) => f.field.id === item.data.hasEffectOn);
    if (value === 'Single' && effectedOn) effectedOn.data.isReadonly = true;
    else if (effectedOn) effectedOn.data.isReadonly = false;
}
