import React, { useState, useEffect } from 'react';
import { InputAdornment } from '@material-ui/core';
import { Inputs } from '../../../../Components';
import './PriceAndPercentage.Style.scss';
import { set } from 'core-js/core/dict';
import { parse, setDate } from 'date-fns';
import { setTimeout } from 'core-js';
import { number } from 'joi';
import { floatHandler } from '../../../../Helper';
import { LeadTypeIdEnum } from '../../../../Enums';

export default function PriceAndPercentage({
  type,
  onChange,
  currency,
  value,
  labelValue,
  ORAdornment,
  allItemsValues,
  area,
  onValueChanged,
  itemList,
  values,
  sqrSalePrice,
  setData,
  hideRentPerSqFt , 
  depositSum

}) {

  const [builtupAreaSqft, setBuiltupAreaSqfte] = useState((allItemsValues && allItemsValues.builtup_area_sqft) ? (allItemsValues.builtup_area_sqft && allItemsValues.builtup_area_sqft !== '' && +allItemsValues.builtup_area_sqft) : (area || 0));
  const sqrSalePrice2 = sqrSalePrice !== undefined && sqrSalePrice !== '' && sqrSalePrice !== null ? (sqrSalePrice) : 0;
  const [salePrice, setSalePrice] = useState(value && value.salePrice ? value.salePrice : 0);
  const [agencyFee, setAgencyFee] = useState(value && value.agencyFee ? value.agencyFee : 0);
  const [persantageFee, setPersantageFee] = useState(
    value && value.persantageFee ? value.persantageFee : 0
  );
  const [rentPerSq, setRentPerSq] = useState(value && value.rentPerSq ? value.rentPerSq : 0);
  const [rentPerYear, setRentPerYear] = useState(
    value && value.rentPerYear ? value.rentPerYear : 0
  );
  const [rentPerMonth, setRentPerMonth] = useState(
    value && value.rentPerMonth ? value.rentPerMonth : 0
  );
  const [rentPerYearDisply, setRentPerYearDisply] = useState(0);
  const [isFirst, setFirst] = useState(false);

  const [commission, setcommission] = useState(value && value.commission ? value.commission : 0);
  const [commissionPer, setCommissionPer] = useState(
    value && value.commissionPer ? value.commissionPer : 0.0
  );
  const [deposit, setDeposit] = useState(value && value.deposit ? value.deposit : 0);
  const [depositPer, setDepositPer] = useState(value && value.depositPer ? value.depositPer : 0);

  // useEffect(() => {
  //   if (!isFirst){
  //     setFirst(true);

  //   }
  //   else {
  //     if(sqrSalePrice2)
  //     {
  //       const salePriceValue = Number(builtupAreaSqft) * +sqrSalePrice2;
  //       setSalePrice(salePriceValue);
  //       if (agencyFee > salePriceValue) {
  //         setAgencyFee(salePriceValue);
  //         setPersantageFee(100);
  //         onChange({
  //           salePrice: (salePriceValue),
  //           agencyFee: salePriceValue || 0,
  //           persantageFee: salePriceValue ? 100 : 0,
  
  //         });
  //       } else {
  //         const persantageFeeValue = salePriceValue ? (agencyFee / salePriceValue) * 100 : 0;
  //         setPersantageFee(persantageFeeValue);
  //         onChange({
  //           salePrice: (salePriceValue),
  //           agencyFee: salePriceValue ? agencyFee : 0,
  //           persantageFee: persantageFeeValue,
  
  //         });
  //       }

  //     }

     
  //   }
  // }, [sqrSalePrice2]);




  /// setData('pricesqm', '0');


  useEffect(() => {
    if(values){
      const sellerHasPaid =   values && values.seller_has_paid  ? values.seller_has_paid: 0 ;
       const sub = salePrice -  sellerHasPaid ; 
       setData('amount_due_to_developer' , sub) ; 
       setData('amount_due-to-developer' , sub) ; 
    }
    if(builtupAreaSqft){
      const pricesqm =  salePrice/builtupAreaSqft ;  
      if(setData){
        setData('pricesqm', pricesqm || '0');
       
      }
      else if (onValueChanged){
        onValueChanged(pricesqm , 0, 'pricesqm');
        if(!pricesqm)
          onValueChanged(0, undefined, 'pricesqm');
          else {
            onValueChanged(pricesqm , 0 ,  'pricesqm');

          }
          

      } 
          
    }
      
  }, [salePrice]);


  useEffect(() => {
    setDeposit(depositSum);
    onChange({
      rentPerSq ,
      rentPerYear ,
      rentPerMonth,
      commission,
      commissionPer,
      deposit:depositSum,
      depositPer 
    });

    onChange({
      salePrice,
      agencyFee ,
      persantageFee,

    });
  
}, [depositSum]);


  return (
    <>
      {type === 'Rent Type' && (
        <>
          {
            !hideRentPerSqFt && (
              <div className='form-item'>
                <Inputs
                  idRef='priceRef4'
                  startAdornment={(
                    <InputAdornment position='start' className='px-2'>
                      {currency}
                    </InputAdornment>
                  )}
                  labelValue='Rent per Sq.ft'
                  value={rentPerSq}
                  onInputChanged={(e) => {
                    const rentPerSqValue = e.target.value;
                    const rentPerYearValue = builtupAreaSqft ? builtupAreaSqft * e.target.value : 0;
                    const rentPerMonthValue = builtupAreaSqft ? floatHandler((rentPerYearValue / 12), 3) : 0;
                    const commissionPerValue = commission && rentPerYearValue ? (commission / rentPerMonthValue) * 100 : 0;
                    const depositValuePer = deposit && rentPerYearValue ? (deposit / rentPerMonthValue) * 100 :
                      setRentPerSq(rentPerSqValue);
                    setRentPerYear(rentPerYearValue);
                    setRentPerMonth(rentPerMonthValue);
                    if (commission)
                      setCommissionPer(commissionPerValue);

                    // if (deposit)
                    //   setDepositPer(depositValuePer);
                    onChange({
                      rentPerSq: rentPerSqValue,
                      rentPerYear: rentPerYearValue,
                      rentPerMonth: rentPerMonthValue,
                      commission,
                      commissionPer: (commissionPerValue),
                      deposit,
                     // depositPer: (depositValuePer),
                    });
                  }}
                />
              </div>
            )
          }

          <div className='form-item'>
            <Inputs
              idRef='priceRef5'
              startAdornment={(
                <InputAdornment position='start' className='px-2'>
                  {currency}
                </InputAdornment>
              )}
              labelValue='Rent per Year'
              withNumberFormat
              type='number'
              min={0}
              value={rentPerYear}
              onInputChanged={(e) => {
                const rentPerYearValue = e.target.value;
                if (!rentPerYearValue) {
                  setRentPerYear(0);
                  setcommission(0);
                  setCommissionPer(0);
                  //setDeposit(0);
                 // setDepositPer(0);
                  setRentPerMonth(0);
                  onChange({
                    rentPerSq,
                    rentPerYear: 0,
                    rentPerMonth: 0,
                    commission: 0,
                    commissionPer: 0,
                  //  deposit: 0,
                   // depositPer: 0,
                  });
                  return;
                }
                setRentPerYear(rentPerYearValue);
                const rentPerSqValue = builtupAreaSqft ? (rentPerYearValue) / builtupAreaSqft : 0;
                setRentPerSq(rentPerSqValue);
                const rentPerMonthValue = rentPerYearValue / 12;
                setRentPerMonth(rentPerYearValue ? rentPerMonthValue : 0);
                let depositPerValue = 0;
                let commissionPerValue = 0;
                if (commission > rentPerYearValue) {
                  setcommission(rentPerYearValue);
                  setCommissionPer(100);
                } else {
                  commissionPerValue = commission && rentPerYearValue ? (commission / (rentPerYearValue)) * 100 : 0;
                  if (commissionPerValue > 100)
                    commissionPerValue = 100;
                  setCommissionPer(commissionPerValue || 0);
                }

                // if (deposit > rentPerYearValue) {
                //   setDeposit(rentPerYearValue);
                //  // setDepositPer(100);
                // } else {
                //   depositPerValue = deposit && rentPerYearValue ? (deposit / rentPerYearValue) * 100 : 0;
                //   if (depositPerValue > 100)
                //     depositPerValue = 100;
                //  // setDepositPer(depositPerValue || 0);
                // }
                onChange({
                  rentPerSq: rentPerSqValue,
                  rentPerYear: rentPerYearValue,
                  rentPerMonth: rentPerMonthValue,
                  commission: commission > rentPerYearValue ? rentPerYearValue : commission,
                  commissionPer: commissionPerValue || 0,
                  deposit 
                  //depositPer: depositPerValue || 0,
                });
              }}

            />
          </div>
          <div className='form-item'>
            <Inputs
              idRef='priceRef6'
              startAdornment={(
                <InputAdornment position='start' className='px-2'>
                  {currency}
                </InputAdornment>
              )}
              labelValue='Rent per Month'
              withNumberFormat
              type='number'
              value={rentPerMonth}
              onKeyUp={(e) => {
                const monthValue = e && e.target && e.target.value ? (e.target.value) : 0;
                const fixed = (monthValue && monthValue.replace(/,/g, ''));
                const editMonth = parseFloat(fixed);
                if (editMonth === 0) {
                  setRentPerYear(0);
                  setRentPerMonth(0);
                  setcommission(0);
                  setCommissionPer(0);
                  //setDeposit(0);
                  //setDepositPer(0);
                  onChange({
                    rentPerSq,
                    rentPerYear: 0,
                    rentPerMonth: 0,
                    commission: 0,
                    commissionPer: 0,
                   // deposit: 0,
                   // depositPer: 0,
                  });
                  return;
                }
                const rentPerYearValue = editMonth * 12;
                setRentPerSq(builtupAreaSqft ? (rentPerYearValue / builtupAreaSqft) : 0);
                setRentPerYear(rentPerYearValue);
                setRentPerMonth((editMonth));
                let commissionPerValue = 0;
                if (commission > rentPerYearValue) {
                  setcommission(rentPerYearValue);
                  setCommissionPer(100);
                } else {
                  commissionPerValue = commission && rentPerYearValue ? (commission / (rentPerYearValue)) * 100 : 0;
                  if (commissionPerValue > 100)
                    commissionPerValue = 100;
                  setCommissionPer(commissionPerValue || 0);
                }
                // let depositPerValue = 0;
                // if (deposit > rentPerYearValue) {
                //   setDeposit(rentPerYearValue);
                //   setDepositPer(100);
                // } else {
                //   depositPerValue = deposit && rentPerYearValue ? ((deposit / rentPerYearValue) * 100) : 0;
                //   if (depositPerValue > 100)
                //     depositPerValue = 100;
                //   setDepositPer(depositPerValue || 0);
                // }

                onChange({
                  rentPerSq: builtupAreaSqft ? rentPerYearValue / builtupAreaSqft : 0,
                  rentPerYear: rentPerYearValue,
                  rentPerMonth: (editMonth),
                  commission: commission > rentPerYearValue ? rentPerYearValue : commission,
                  commissionPer: commissionPerValue || 0,
                  //deposit: deposit > rentPerYearValue ? rentPerYearValue : deposit,
                  //depositPer: depositPerValue || 0,
                });
              }}
            />
          </div>
          <div className='form-item fa-end px-0'>
            <div className='form-subitem'>
              <Inputs
                idRef='priceRef7'
                startAdornment={(
                  <InputAdornment position='start' className='px-2'>
                    {currency}
                  </InputAdornment>
                )}
                endAdornment={(
                  <InputAdornment position='end' className='px-2'>
                    {ORAdornment && ORAdornment ? '' : 'OR'}
                  </InputAdornment>
                )}
                withNumberFormat
                type='number'
                min={0}
                labelValue='Commission'
                value={commission}
                onKeyUp={(e) => {
                  if (rentPerYear === 0) {
                    setcommission(0);
                    setCommissionPer(0);
                    onChange({
                      rentPerSq,
                      rentPerYear,
                      rentPerMonth,
                      commission: 0,
                      commissionPer: 0,
                      deposit,
                     // depositPer,
                    });
                    return;
                  }

                  const commissionNumber = e && e.target && e.target.value ? (e.target.value) : 0;
                  const fixed = (commissionNumber && commissionNumber.replace(/,/g, ''));
                  const editValue = parseFloat(fixed);
                  if (editValue > rentPerYear) {
                    setcommission(rentPerYear);
                    setCommissionPer(100);
                    onChange({
                      rentPerSq,
                      rentPerYear,
                      rentPerMonth,
                      commission: rentPerYear,
                      commissionPer: 100,
                      deposit,
                   //  depositPer,
                    });
                  } else {
                    setcommission(rentPerYear ? editValue : 0);
                    const perNumber = rentPerYear ? (editValue / rentPerYear) * 100 : 0;
                    setCommissionPer(perNumber || 0);
                    onChange({
                      rentPerSq,
                      rentPerYear,
                      rentPerMonth,
                      commission: editValue,
                      commissionPer: perNumber || 0,
                      deposit,
                    //  depositPer,
                    });
                  }
                }}

              />
            </div>
            <div className='form-subitem'>
              <Inputs
                idRef='priceRef8'
                endAdornment={(
                  <InputAdornment position='end' className='px-2'>
                    %
                  </InputAdornment>
                )}
                labelValue={labelValue || ''}
                value={commissionPer}
                type='number'
                withNumberPersantageFormat
                onKeyUp={(e) => {
                  if (rentPerYear === 0) {
                    setCommissionPer(0);
                    setcommission(0);
                    onChange({
                      rentPerSq,
                      rentPerYear,
                      rentPerMonth,
                      commission: 0,
                      commissionPer: 0,
                      deposit,
                     // depositPer,
                    });
                    return;
                  }
                  const commissionPerNumber = e && e.target && e.target.value ? e.target.value : 0;
                  const fixed = (commissionPerNumber && commissionPerNumber.replace(/,/g, ''));
                  let editCommissionPerNumber = parseFloat(fixed);

                  if (editCommissionPerNumber > 100) editCommissionPerNumber = 100;
                  const commissionNumber = (editCommissionPerNumber / 100) * rentPerYear;
                  setcommission(rentPerYear ? commissionNumber : 0);
                  setCommissionPer(rentPerYear ? editCommissionPerNumber : 0);
                  onChange({
                    rentPerSq,
                    rentPerYear,
                    rentPerMonth,
                    commission: commissionNumber || 0,
                    commissionPer: editCommissionPerNumber,
                    deposit,
                    //depositPer,
                  });
                }}
              />
            </div>
          </div>
          <div className='form-item fa-end px-0'>
            <div className='form-subitem'>
              <Inputs
                idRef='priceRef9'
                startAdornment={(
                  <InputAdornment position='start' className='px-2'>
                    {currency}
                  </InputAdornment>
                )}
                type='number'
                isDisabled
                withNumberFormat
                labelValue='Deposit'
                value={deposit}
                onKeyUp={(e) => {
                  // if (rentPerYear === 0) {
                  //   setDeposit(0);
                  //   setDepositPer(0);
                  //   onChange({
                  //     rentPerSq,
                  //     rentPerYear,
                  //     rentPerMonth,
                  //     commission,
                  //     commissionPer,
                  //     deposit: 0,
                  //   //  depositPer: 0,
                  //   });
                  //   return;
                  // }
                  const depositNumber = e && e.target && e.target.value ? (e.target.value) : 0;
                  const fixed = (depositNumber && depositNumber.replace(/,/g, ''));
                  let editDeposit = fixed ? parseFloat(fixed) : 0 ;
                  setDeposit(0);
                  onChange({
                        rentPerSq,
                        rentPerYear,
                        rentPerMonth,
                        commission,
                        commissionPer,
                        deposit: editDeposit,
                       // depositPer , 
                      });


                  // if (editDeposit >= rentPerYear) {
                  //   editDeposit = rentPerYear;
                  //   setDeposit(editDeposit);
                  //   setDepositPer(100);
                  //   onChange({
                  //     rentPerSq,
                  //     rentPerYear,
                  //     rentPerMonth,
                  //     commission,
                  //     commissionPer,
                  //     deposit: editDeposit,
                  //    // depositPer: 100,
                  //   });
                  // } else {
                  //   setDeposit(editDeposit);
                  //   const perNumber = (editDeposit / rentPerYear) * 100;
                  // //  setDepositPer(perNumber || 0);
                  //   onChange({
                  //     rentPerSq,
                  //     rentPerYear,
                  //     rentPerMonth,
                  //     commission,
                  //     commissionPer,
                  //     deposit: editDeposit,
                  //    // depositPer: perNumber || 0
                  //   });
                  // }
                }}
              />
            </div>
            {/* <div className='form-subitem'>
              <Inputs
                idRef='priceRef10'
                endAdornment={(
                  <InputAdornment position='end' className='px-2'>
                    %
                  </InputAdornment>
                )}
                labelValue={labelValue || ''}
                value={depositPer}
                min={0}
                max={100}
                withNumberPersantageFormat
                type='number'
                onKeyUp={(e) => {
                  if (rentPerYear === 0) {
                    setDepositPer(0);
                    setDeposit(0);
                    onChange({
                      rentPerSq,
                      rentPerYear,
                      rentPerMonth,
                      commission,
                      commissionPer,
                      deposit: 0,
                      depositPer: 0,
                    });
                    return;
                  }
                  // eslint-disable-next-line prefer-const
                  const depositPerValue = e && e.target && e.target.value ? (e.target.value) : 0;
                  const fixed = (depositPerValue && depositPerValue.replace(/,/g, ''));
                  let editDepositPer = parseFloat(fixed);
                  if (editDepositPer > 100)
                    editDepositPer = 100;
                  const depositNumber = (editDepositPer / 100) * rentPerYear;
                  setDeposit(rentPerYear ? depositNumber : 0);
                  setDepositPer(rentPerYear ? editDepositPer : 0);
                  onChange({
                    rentPerSq,
                    rentPerYear,
                    rentPerMonth,
                    commission,
                    commissionPer,
                    deposit: depositNumber || 0,
                    depositPer: editDepositPer,
                  });
                }}
              />
            </div> */}
          </div>
        </>
      )}

      {type === 'Sale Type' && (
        <>
          <div className='form-item'>
            <Inputs
              isAttachedInput
              idRef='priceRef7'
              startAdornment={(
                <InputAdornment position='start' className='px-2'>
                  {currency}
                </InputAdornment>
              )}
              type='number'
              min={0}
              withNumberFormat
              labelValue='Selling Price'
              value={salePrice}
              onKeyUp={(e) => {
                const salePriceValue = e && e.target && e.target.value ? (e.target.value) : 0;
                const fixed = (salePriceValue && salePriceValue.replace(/,/g, ''));
                const editSalePriceValue = fixed ? parseFloat(fixed) : 0;
                setSalePrice(editSalePriceValue);
                const prcSqr = builtupAreaSqft ? editSalePriceValue / builtupAreaSqft : 0;

                if (editSalePriceValue === 0) {
                  setAgencyFee(0);
                  setPersantageFee(0);
                  onChange({
                    salePrice: 0,
                    agencyFee: 0,
                    persantageFee: 0,

                  });
                  // const priceSqmIndex1 = itemList ? itemList.indexOf(itemList.find((f) => f.field.id === 'pricesqm')) : false;
                  // if (onValueChanged)
                  //   onValueChanged(prcSqr || '0', 0, 'pricesqm');
                  // else if (setData) {
                  //   if (priceSqmIndex1 && priceSqmIndex1 !== -1)
                  //     setData('pricesqm', '0');
                  // }
                return;
                }
                // const priceSqmIndex = itemList ? itemList.indexOf(itemList.find((f) => f.field.id === 'pricesqm')) : false;
                // if (onValueChanged){
                //   onValueChanged(prcSqr || '', 0, 'pricesqm');
                // }
                // else if (setData) {
                //   if (priceSqmIndex !== -1)
                //     setData('pricesqm', prcSqr || '');
                   
                // }
                if (agencyFee > editSalePriceValue) {
                  setAgencyFee(editSalePriceValue);
                  setPersantageFee(editSalePriceValue ? 100 : 0);

                  onChange({
                    salePrice: editSalePriceValue,
                    agencyFee: editSalePriceValue,
                    persantageFee: editSalePriceValue ? 100 : 0

                  });
                } else {
                  let persantageFeeValue = agencyFee && editSalePriceValue ? (agencyFee / editSalePriceValue) * 100 : 0;
                  if (persantageFeeValue > 100)
                    persantageFeeValue = 100;
                  setPersantageFee(editSalePriceValue ? persantageFeeValue : 0);

                  onChange({
                    salePrice: (editSalePriceValue),
                    agencyFee: editSalePriceValue ? agencyFee : 0,
                    persantageFee: agencyFee && editSalePriceValue ? persantageFeeValue : 0,

                  });
                }
              }}
            />
          </div>
          <div className='form-item fa-end px-0'>
            <div className='form-subitem'>
              <Inputs
                idRef='priceRef8'
                startAdornment={(
                  <InputAdornment position='start' className='px-2'>
                    {currency}
                  </InputAdornment>
                )}
                endAdornment={(
                  <InputAdornment position='end' className='px-2'>
                    {ORAdornment && ORAdornment ? '' : 'OR'}
                  </InputAdornment>
                )}
                labelValue='Agency Fee'
                value={agencyFee}
                type='number'
                min={0}
                withNumberFormat
                onKeyUp={(e) => {
                  const agencyValue = e && e.target && e.target.value ? (e.target.value) : 0;
                  const fixed = (agencyValue && agencyValue.replace(/,/g, ''));
                  let editAgencyFeeValue =  fixed ?  parseFloat(fixed) : 0;
                  if (!salePrice) {
                        setAgencyFee(0);
                        setPersantageFee(0);
                        onChange({
                          salePrice,
                          agencyFee: 0,
                          persantageFee: 0,
                        });
                        return;
                      }
                    if (editAgencyFeeValue >= salePrice) {
                    setAgencyFee(salePrice);
                    setPersantageFee(salePrice ? (salePrice / salePrice) * 100 : 0);
                    onChange({
                      salePrice,
                      agencyFee: salePrice || 0,
                      persantageFee: salePrice ? (salePrice / salePrice) * 100 : 0,
                    });
                  } else {
                    const persantageFeeValue = salePrice ? ((editAgencyFeeValue / salePrice) * 100) : 0;
                    setAgencyFee(salePrice ? editAgencyFeeValue : 0);
                    setPersantageFee(salePrice ? persantageFeeValue : 0);
                    onChange({
                      salePrice,
                      agencyFee: salePrice ? editAgencyFeeValue : 0,
                      persantageFee: salePrice ? persantageFeeValue : 0,
                    });
                  }

                }}
              />
            </div>
            <div className='form-subitem'>
              <Inputs
                idRef='priceRef9'
                withNumberPersantageFormat
                endAdornment={(
                  <InputAdornment position='end' className='px-2'>
                    %
                  </InputAdornment>
                )}
                labelValue={labelValue || ''}
                value={persantageFee}
                type='number'
                max={100}
                onKeyUp={(e) => {
                  const persantageFeeValue = e && e.target && e.target.value ? (e.target.value) : 0;
                  const fixed = (persantageFeeValue && persantageFeeValue.replace(/,/g, ''));
                  let editPersantageFeeValue = parseFloat(fixed);

                  if (editPersantageFeeValue === 0) {
                    setAgencyFee(0);
                    setPersantageFee(0);
                    onChange({
                      salePrice,
                      agencyFee: 0,
                      persantageFee: 0,
                    });
                  } else {
                    if (editPersantageFeeValue > 100) editPersantageFeeValue = 100;

                    const agencyFeeValue = salePrice ? (editPersantageFeeValue / 100) * salePrice : 0;

                    setAgencyFee(agencyFeeValue || 0);
                    setPersantageFee(editPersantageFeeValue || 0);
                    onChange({
                      salePrice,
                      agencyFee: agencyFeeValue || 0,
                      persantageFee: editPersantageFeeValue || 0,
                    });
                  }
                }}

              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
