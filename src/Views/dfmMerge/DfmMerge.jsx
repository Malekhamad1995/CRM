import React, { useEffect, useState, useCallback } from 'react';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import Fab from '@material-ui/core/Fab';
import { Loop } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { useTranslation } from 'react-i18next';
import {
 CONTACTS, LEADS, PROPERTIES, UNITS
} from '../../config/pagesName';
import {
  contactsDetailsGet,
  mergeContactPut,
  mergeUnitPut,
  unitDetailsGet,
  mergePropertyPut,
  propertyDetailsGet,
} from '../../Services';

import Row from '../../Components/dfmMerge/Row';
import {
 changeLoading, GlobalHistory, showSuccess, showError
} from '../../Helper';
import { extractValue } from '../../Utils/ExtractValue';
import Alert from '../../Components/dfmAddEditAndDelete/Alert';
import { CountCoverage } from '../../Utils/CountCoverage';

function groupBy(objectArray, property) {
  return objectArray.reduce((acc, obj) => {
    const key = obj[property];
    if (!acc[key]) acc[key] = [];

    acc[key].push(obj);
    return acc;
  }, {});
}
const DfmMerge = ({
  match: {
    params: {
 dfmPage, dfmType, firstId, secondId
},
  },
}) => {
  const { t } = useTranslation('DataFiles');
  const [data, setData] = useState(null);
  const [dataToEdit, setDataToEdit] = useState(null);
  const [selectAll, setSelectAll] = useState(0);
  const [itemsBeforeEditing, setItemsBeforeEditing] = useState(0);
  const [emptyMsg, setEmptyMsg] = useState('');
  const fetchData = useCallback(async () => {
    try {
      changeLoading(true);
      let firstItemDetails;
      let secondItemDetails;
      switch (dfmPage) {
        case CONTACTS:
          const [a, b] = await Promise.all([
            contactsDetailsGet({ id: firstId }),
            contactsDetailsGet({ id: secondId }),
          ]);
          firstItemDetails = a.contact;
          secondItemDetails = b.contact;
          setItemsBeforeEditing([[...a], [...b]]);
          setDataToEdit(a);
          break;

        case LEADS:
          const [c, d] = await Promise.all([leadDetailsGet({ id: firstId }), leadDetailsGet({ id: secondId })]);
          firstItemDetails = JSON.parse(c.lead);
          secondItemDetails = JSON.parse(d.lead);
          setItemsBeforeEditing([[...c], [...d]]);
          setDataToEdit(c);
          GlobalHistory.push(`/main/view/${dfmPage}`);
          break;

        case PROPERTIES:
          const [e, f] = await Promise.all([
            propertyDetailsGet({ id: firstId }),
            propertyDetailsGet({ id: secondId }),
          ]);
          firstItemDetails = JSON.parse(e.property);
          secondItemDetails = JSON.parse(f.property);
          setItemsBeforeEditing([[...e], [...f]]);
          setDataToEdit(e);
          break;

        case UNITS:
          const [g, q] = await Promise.all([
            unitDetailsGet({ id: firstId }),
            unitDetailsGet({ id: secondId }),
          ]);
          firstItemDetails = JSON.parse(g.unit);
          secondItemDetails = JSON.parse(q.unit);
          setItemsBeforeEditing([[...g], [...q]]);
          setDataToEdit(g);
          break;

        default:
          break;
      }
      const keys = [
        ...Object.keys(firstItemDetails).map((i) => ({ key: i, value: firstItemDetails[i] })),
        ...Object.keys(secondItemDetails).map((i) => ({ key: i, value: secondItemDetails[i] })),
      ];
      setData(groupBy(keys, 'key'));
    } catch (err) {
      setEmptyMsg(err.message || `${err}`);
    } finally {
      changeLoading(false);
    }
  }, [dfmPage, firstId, secondId]);

  const mergeRows = async () => {
    try {
      changeLoading(true);
      let results;
      switch (dfmPage) {
        case CONTACTS:
          // jsonContentData.data.contact.data_completed = CountCoverage(jsonContentData);
          results = await mergeContactPut({
            id: firstId,
            body: {
              data: {
                contact: {
                  ...JSON.parse(dataToEdit[0].contact),
                  contact_type_id: JSON.parse(dataToEdit[0].contact).contact_type_id,
                  data_completed: CountCoverage(JSON.parse(dataToEdit[0].contact)),
                  obsolete_id: [secondId],
                },
              },
            },
          });
          break;

        case LEADS:
          break;

        case PROPERTIES:
          results = await mergePropertyPut({
            id: firstId,
            body: {
              data: {
                property: {
                  ...JSON.parse(dataToEdit[0].property),
                  property_type_id: JSON.parse(dataToEdit[0].property).property_type_id,
                  data_completed: CountCoverage(JSON.parse(dataToEdit[0].property)),
                  obsolete_id: [secondId],
                },
              },
            },
          });
          break;
        case UNITS:
          results = await mergeUnitPut({
            id: firstId,
            body: {
              data: {
                unit: {
                  ...JSON.parse(dataToEdit[0].unit),
                  unit_type_id: JSON.parse(dataToEdit[0].unit).unit_type_id,
                  data_completed: CountCoverage(JSON.parse(dataToEdit[0].unit)),
                  obsolete_id: [secondId],
                },
              },
            },
          });
          break;

        default:
          break;
      }
      if (results && results.code === 200) GlobalHistory.push(`/main/view/${dfmPage}`);
      showSuccess(t('DfmMerge.NotificationMerge'));
    } catch (err) {
      setEmptyMsg(err.message || `${err}`);
      showError(t('DfmMerge.NotificationErrorMerge'));
    } finally {
      changeLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [firstId, secondId, fetchData]);
  
  return (
    <Grid>
      {emptyMsg !== '' && <Alert msg={emptyMsg} />}
      <Grid xs={12} item>
        <Card>
          <CardContent>
            <Grid container justify='center' alignItems='center' style={{ marginBottom: 20 }}>
              <Grid xs={11} item>
                <Grid
                  container
                  justify='center'
                  alignItems='center'
                  spacing={2}
                  className='dfmMergeRowItem'
                >
                  <Grid xs={3} item className='dfmMergeRowItem' />
                  <Grid xs={3} item className='dfmMergeRowItem'>
                    <b>Contact ID</b>
                  </Grid>
                  <Grid xs={3} item className='dfmMergeRowItem'>
                    <b>Creation Date</b>
                  </Grid>
                  <Grid xs={3} item className='dfmMergeRowItem'>
                    <b>Created By</b>
                  </Grid>
                  <Grid xs={3} item className='dfmMergeRowItem'>
                    <b style={{ color: '#004e87' }}>{`Original ${dfmPage}`}</b>
                  </Grid>
                  <Grid xs={3} item className='dfmMergeRowItem'>
                    {firstId}
                  </Grid>
                  <Grid xs={3} item className='dfmMergeRowItem'>
                    N/A
                  </Grid>
                  <Grid xs={3} item className='dfmMergeRowItem'>
                    N/A
                  </Grid>
                  <Grid xs={3} item className='dfmMergeRowItem'>
                    <b style={{ color: '#004e87' }}>{`Obsolete ${dfmPage}`}</b>
                  </Grid>
                  <Grid xs={3} item className='dfmMergeRowItem'>
                    {secondId}
                  </Grid>
                  <Grid xs={3} item className='dfmMergeRowItem'>
                    N/A
                  </Grid>
                  <Grid xs={3} item className='dfmMergeRowItem'>
                    N/A
                  </Grid>
                </Grid>
              </Grid>
              <Grid xs={1} item>
                <Fab
                  color='primary'
                  onClick={() =>
                    GlobalHistory.push(`/main/merge/${dfmPage}/${dfmType}/${secondId}/${firstId}`)}
                >
                  <Loop />
                </Fab>
              </Grid>
              <Grid item xs={12} style={{ display: 'flex', justifyContent: 'right' }}>
                <Button
                  variant='contained'
                  color='primary'
                  style={{ marginTop: 20 }}
                  onClick={mergeRows}
                >
                  Merge
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card style={{ marginTop: 20 }}>
          <CardContent>
            <Grid
              container
              justify='center'
              alignItems='center'
              style={{ marginBottom: 20, marginTop: 20 }}
            >
              <Grid item xs={2} className='dfmMergeRowItem'>
                <b style={{ color: '#86b62c' }}>Field Name</b>
              </Grid>
              <Grid item xs={2} className='dfmMergeRowItem'>
                <b style={{ color: '#86b62c' }}>Tab Name</b>
              </Grid>
              <Grid item xs={1} />
              <Grid item xs={3} className='dfmMergeRowItem'>
                <Grid
                  container
                  justify='center'
                  alignItems='center'
                  spacing={3}
                  className='dfmMergeRowItem'
                >
                  <Grid item xs={2} className='dfmMergeRowItem'>
                    <Radio
                      checked={selectAll === 0}
                      onChange={() => {
                        setSelectAll(0);
                        setDataToEdit([...itemsBeforeEditing[0]]);
                      }}
                      value='1'
                    />
                  </Grid>
                  <Grid item xs={10} style={{ justifyContent: 'left' }} className='dfmMergeRowItem'>
                    <b>{`Contact ID: ${firstId}`}</b>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={1} />
              <Grid item xs={3} className='dfmMergeRowItem'>
                <Grid
                  container
                  justify='center'
                  alignItems='center'
                  spacing={3}
                  className='dfmMergeRowItem'
                >
                  <Grid item xs={2} className='dfmMergeRowItem'>
                    <Radio
                      checked={selectAll === 1}
                      onChange={() => {
                        setSelectAll(1);
                        setDataToEdit([...itemsBeforeEditing[1]]);
                      }}
                      value='1'
                    />
                  </Grid>
                  <Grid item xs={10} style={{ justifyContent: 'left' }} className='dfmMergeRowItem'>
                    <b>{`ContactID: ${secondId}`}</b>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      {data &&
        Object.keys(data)
          .filter(
            (i) =>
              !(
                i.includes('map') ||
                i.includes('upload_files') ||
                i.includes('data_completed') ||
                i.includes('contact_type_id') ||
                i.includes('property_type_id') ||
                i.includes('lead_type_id')
              )
          )
          .map((key, index) => {
            const body =
              (dataToEdit[0].contact && JSON.parse(dataToEdit[0].contact)) ||
              (dataToEdit[0].lead && JSON.parse(dataToEdit[0].lead)) ||
              (dataToEdit[0].property && JSON.parse(dataToEdit[0].property)) ||
              (dataToEdit[0].unit && JSON.parse(dataToEdit[0].unit));
            return (
              <Row
                keyOfValue={key}
                key={index}
                firstValue={extractValue(data[key][0] && data[key][0].value)}
                secondValue={extractValue(data[key][1] && data[key][1].value)}
                firstValueBeforeExtacting={data[key][0] && data[key][0].value}
                secondValueBeforeExtacting={data[key][1] && data[key][1].value}
                selectedValue={extractValue(body[key])}
                onChange={(key, value) => {
                  const editedData = dataToEdit;
                  body[key] = value;
                  editedData[0]['contact' || 'lead' || 'property' || 'unit'] = JSON.stringify(body);
                  setDataToEdit([...editedData]);
                }}
              />
            );
          })}
      <Grid item xs={12} className='dfmMergeRowItem'>
        <Button variant='contained' color='primary' style={{ marginTop: 20 }} onClick={mergeRows}>
          Merge
        </Button>
      </Grid>
    </Grid>
  );
};
export default DfmMerge;
