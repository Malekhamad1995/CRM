import React, { useEffect, useState } from 'react';
import { Button, Grid } from '@material-ui/core';
import DfmList from './DfmList';
import DataRow from './DataRow';
import Alert from '../../dfmAddEditAndDelete/Alert';
import { Spinner } from '../../../SpinnerComponent/Spinner';
import ConvertJson from '../../../../views/Home/FormBuilder/Utilities/FormRender/ConvertJson';
import { getFormdata } from '../../../../helper';
import { ConvertJsonToForm } from '../../../../views/Home/FormBuilder/Utilities/ConvertJsonToForm';

const Index = ({
  formAction,
  dataAction,
  updateAction,
  data,
  className,
  formName,
  idFormat,
  tabId,
  type,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [tabsNames, setTabsNames] = useState([]);
  const [items, setItems] = useState(null);
  const [emptyMsg, setEmptyMsg] = useState(null);
  const [itemsValue, setItemsValue] = useState({});
  const [itemArr, setItemArr] = useState([]);
  const [loading, setloading] = useState(true);
  const [mode, setMode] = useState('read');
  const [itemsError, setItemsError] = useState({});

  let extracted;

  const setData = (i, newValue) => {
    itemsValue[`${i}`] = newValue;
    setItemsValue({ ...itemsValue });
  };
  const setError = (i, newError) => {
    itemsError[`${i}`] = newError;
    setItemsError({ ...itemsError });
  };
  const fetchDetails = async () => {
    try {
      let formTemp = {};
      let formData = {};
      if (formAction && dataAction) {
        const [from, results] = await Promise.all([formAction(), dataAction()]);
        formTemp = from;
        formData = results;
      } else {
        const from = await formAction();
        formTemp = from;
        formData = [{ ...data }];
      }
      if (formTemp && Array.isArray(formTemp) && formData && Array.isArray(formData)) {
        extracted = formData[0].contact ||
          formData[0].lead ||
          formData[0].property ||
          formData[0].unit ||
          formData[0].data;
        const dataToView = typeof extracted === 'string' || extracted instanceof String ?
            JSON.parse(extracted) :
            extracted;
        const newDataWithEdit = ConvertJsonToForm(
          JSON.parse(formTemp[0].form_content),
          setTabsNames,
          setItemArr,
          dataToView,
          setData
        ).map((step) =>
          step.map((item, index) => {
            // eslint-disable-next-line no-restricted-syntax
            for (const key in dataToView) {
              if (
                dataToView.hasOwnProperty(key)
                && item.field.id.replace('-', '_').replace('-', '_').toUpperCase() ===
                  key.toUpperCase()
              ) {
                item.data.valueToEdit = dataToView[key];
                break;
              }
            }
            return item;
          }));

        setItems(
          newDataWithEdit.map((i) => {
            i.isEditing = false;
            return i;
          })
        );
      }
    } catch (e) {
      setEmptyMsg(`${e.message ? e.message : e}`);
    }
    setloading(false);
  };

  useEffect(() => {
    setloading(true);
    fetchDetails();
  }, [dataAction]);

  const updateItemFunction = async () => {
    const jsonContentData = JSON.parse(getFormdata(formName, idFormat, itemsValue, itemArr, type));

    jsonContentData.data[formName].data_completed = CountCoverage(jsonContentData);

    const result = await updateAction({ ...jsonContentData });
    setloading(false);
    setloading(true);
    await fetchDetails();
    setMode('read');
    setloading(false);
    return result;
    // await updateAction(data);
  };
  const [viewType, setViewType] = useState(true);
  const getRealIndex = (itemName) => {
    const result = itemArr.indexOf(itemName);
    return result;
  };

  return (
    <div className='DfmDetailsDrawerContainer'>
      <Spinner isActive={loading} />
      {emptyMsg !== '' && <Alert msg={emptyMsg} />}
      <div className=' position-relative'>
        <div
          className={
            viewType ?
              'listDrawer mx-2P float-left border-1s-ddd position-relative' :
              'iconDrawer mx-2P float-left  border-1s-ddd position-relative'
          }
        >
          <DfmList
            tabsNames={tabsNames}
            selected={selectedTab}
            setSelectedTab={setSelectedTab}
            changeView={(e) => {
              setViewType(e);
            }}
          />
        </div>
        <div className={viewType ? 'listBody float-left' : 'iconBody float-left'}>
          <Grid container>
            <Grid item xs={12} className='m-10P'>
              <div className='d-inline-block w-100 text-align-end saveEditButton'>
                <Button
                  variant='outlined'
                  color='secondary'
                  className='addButton '
                  onClick={() => {
                    if (mode === 'read') setMode('edit');
                    else {
                      setloading(true);
                      updateItemFunction();
                    }
                  }}
                >
                  {mode === 'read' ? 'Edit' : 'Save'}
                </Button>

                {mode !== 'read' && (
                  <Button
                    variant='outlined'
                    color='secondary'
                    className='addButton'
                    onClick={() => {
                      setMode('read');
                    }}
                  >
                    cancel
                  </Button>
                )}
              </div>
            </Grid>
            {mode === 'read' && (
              <Grid container spacing={3}>
                {
                  // eslint-disable-next-line max-len
                  Array.isArray(items)
                    && Array.isArray(items[selectedTab])
                    && items[selectedTab].map((item, index) => (
                      <DataRow
                        item={item}
                        index={index}
                        updateItemFunction={() => {
                          setloading(true);
                          updateItemFunction();
                        }}
                        setData={setData}
                        itemList={itemArr}
                        itemValue={
                          itemsValue[
                            itemArr.indexOf(itemArr.find((f) => f.field.id === item.field.id))
                          ]
                        }
                        itemIndex={itemArr.indexOf(
                          itemArr.find((f) => f.field.id === item.field.id)
                        )}
                        itemsValue={itemsValue}
                        update={() => {
                          setloading(true);
                          fetchDetails();
                        }}
                        setisEditing={(status) => {
                          if (!status) {
                            const a = [...items];
                            a[selectedTab][index].isEditing = status;
                            setItems([...a]);
                          } else {
                            setItems([
                              ...items.map((i, ind) =>
                                i.map((k, j) => {
                                  const temp = { ...k };
                                  temp.isEditing = j === index && selectedTab === ind;
                                  return temp;
                                })),
                            ]);
                          }
                        }}
                      />
                    ))
                }
              </Grid>
            )}

            {mode === 'edit' && (
              <Grid container spacing={5}>
                {Array.isArray(items)
                  && Array.isArray(items[selectedTab])
                  && items[selectedTab].map((items, index) => (
                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4} key={getRealIndex(items)}>
                      <ConvertJson
                        item={items}
                        setData={setData}
                        setError={setError}
                        itemValue={itemsValue[getRealIndex(items)]}
                        index={getRealIndex(items)}
                        itemList={itemArr}
                        selectedValues={itemsValue}
                      />
                    </Grid>
                  ))}
              </Grid>
            )}
          </Grid>
        </div>
      </div>
    </div>
  );
};
export default Index;
