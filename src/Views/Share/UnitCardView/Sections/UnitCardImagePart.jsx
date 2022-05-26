/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import PropTypes from 'prop-types';

UnitCardImagePart.propTypes = {
  unit: PropTypes.object
};
const theWith = '329px';

function UnitCardImagePart({ unit }) {
  if (!unit) return <></>;
  if (unit.imageurls === null) return <></>;
  return (
    <div className='w-100 d-inline-flex'>
      <>

        <div>
          <a
            href={unit && unit.imageurls ? unit && unit.imageurls[0] : ''}
            target='_blank'
          >
            <img
              width={theWith}
              className='images '
              // height='282'
              style={{ cursor: 'pointer', border: 'solid 1px black;' }}
              alt='image 1'
              src={unit && unit.imageurls && unit.imageurls !== null ? unit && unit.imageurls && unit.imageurls[0] : ''}
            />
          </a>
        </div>
        {((unit && unit.imageurls[1] !== undefined) && (
          < >
            <div className='c12'>
              <a
                href={unit && unit.imageurls ? unit && unit.imageurls[1] : ''}
                target='_blank'
              >
                <img width={theWith} className='images ' style={{ cursor: 'pointer', border: 'solid 1px black;' }} alt='Image2' src={unit && unit.imageurls[1] !== undefined ? unit.imageurls[1] : ''} />
              </a>
            </div>
          </>
        )) || ''}
        {((unit && unit.imageurls[2] !== undefined) && (
          <>
            < >
              <div className=''>
                <a
                  href={unit && unit.imageurls ? unit && unit.imageurls[2] : ''}
                  target='_blank'
                >
                  <img
                    width={theWith}
                    className='images '
                    style={{ cursor: 'pointer', border: 'solid 1px black;' }}
                    alt='Image3'
                    src={unit && unit.imageurls ? unit && unit.imageurls[2] : ''}

                  />
                </a>
              </div>
            </>
          </>
        )) || ''}
      </>
    </div>
  );
}

export default UnitCardImagePart;
