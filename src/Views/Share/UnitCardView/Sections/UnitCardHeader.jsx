import React from 'react';
import PropTypes from 'prop-types';
import { useTitle } from "../../../../Hooks";

UnitCardHeader.propTypes = {
  unit: PropTypes.object
};
function UnitCardHeader({ unit }) {
  useTitle(unit && unit.marketingTitle || unit && `${unit.propertyname} ${unit.category} - ${unit.bedrooms} bedrooms` || 'Not Found');
  if (!unit) return <></>;
  return (
    <div className='UnitCardHeader-wrapper-wrapper' > 
      <tr className="contral-wraper">
        <td colSpan='2'>
          <br />
        </td>
        <td align='right' className='c2'>
          <span className='px-2'>
            <a href='javascript:window.print()'>
              {' '}
              <i alt='' className='vertical-middle mdi  mdi-printer' />
              {' '}
              Print
              {' '}
            </a>
            {' '}
          </span>
          <a download='download'>
            {' '}
            <i alt='' className='vertical-middle mdi mdi-download' />
            {' '}
            Download
            {' '}
          </a>
        </td>
      </tr>
      <tr>
        <td>
        <img width="40" height="35" style={{ cursor: 'pointer' }} alt='Image2' src={'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAgCAYAAACRpmGNAAAABHNCSVQICAgIfAhkiAAAA5BJREFUWEfNmM9r1EAUx99LdrXWVlswst2dbC8tIupBEbxUqujd9qSC+FvoUUXwx8WDB1GE+gdYBE96kIKnVgQFBU9qPVvRJpMU6cEtBmVNNk/GTdppTLq7TSPd27JvZj7z5jvf92aRsd6XiLQNAHugiQ8RESLOE9EXRJowTfNGE8NWFILhqGKxeFRV84/D70TkAfj3iJRvlmXcLxaLA4i5vYhwEgB2IWJOxIo43/dO2Lb9ZEUEywxagBMxjJXdcFEAqJjmTHfc2K6unt6OjvwLROwLAMn3veOrDbgETtd7vwNAVwCUCBcC63rZluTQML7VzKaCi0qhVnOP2Lb9rFWIpPhUcGJSXe+lcHLf90cty7y8JuCE9jo7131dhKNHlmWcEt97ekqXVFXZ0QiUCD3LMkbi4lJljjH9AaJyLpxYPlbG9AlEZR8RbUbEJetIIBXf913LMrdmAFf+iYgbGl2gyMX5az+O4/ZVKrMzy2U2VebExKVS+SIi7XQc71bSYiJGUXB00UPhFeczBxsdeUtw3d3Fcnt77i4iHAKATQBYBaAqAH4GoEnOjZtiQRG3cWPuHeeGFm4gUzihLwA8G+qHiH4hYpWIOiTjFiwVIlovfgtNPNPMMaaPIypDQTWY9n3vjG3bb6TSN6Ao+VsANCiJf8GUM4OTjZaIpjk3+pO0IuqvouSeB5ckezjGyp/CGlqrufvljMVBCkBVzb+Wa3NmmWNs0S5McybJr5ZwBhvakrnm5PJUq7nHmuk8GGO3EdWR/wHXUqciUhiUtanM4Rgrv0fE3YsGStOO4x5u5O7yOWemOUngC+uJVh0Axjg3LjRy+cxNOFrg5cJdq7kjjXTYYubyAOCKNRLbdJEdzg0lBBEiB1CuxnUYRPTBcdzhNLW1VNJPK4rysG70MOV51eHEB44IivpaXej5t3EvtfpR+3c459ejR90oc5qmdbS1tf+QxxHRUxRPQwDxNIRCNCtE8d1DsJgo8uF7Q9ZjbBWRLSk6r6Zphba29tnIptymTDVJ9MFRX4kUftGv/QMo93QxcPGZa+a2LRcTPBPHZbup68Yf49w8H46VJRF3IhHNffS86lCqzMnQ/95omjVNoxi3MU3T+ufm5j4lbDr+tqbNYv2vDTgQzJP6HbtqmYsx27UFFxT8a3GaW8mprGrmwvZKmDLnxp6VAMljVg2uUCgMqmp+u+P8npyf//YlLZgY/we1mXJmzxqfUwAAAABJRU5ErkJggg=='} />
        
        </td>
        <td className='c4'>
          Share with a friend
          <br />
          <a
            href={`http://www.facebook.com/sharer.php?u=${window.location.href}`}
            target='_blank'
          >
            <i className='share-icons mdi mdi-facebook' />
          </a>
          <a
            href={`http://www.linkedin.com/shareArticle?mini=true&amp;url=${window.location.href}`}
            target='_blank'
          >
            <i className='share-icons mdi mdi-linkedin' />
          </a>
          <a
            href={`https://twitter.com/share?url=${window.location.href}&amp;text=${unit && unit.marketingTitle || unit && `${unit.propertyname} ${unit.category} - ${unit.bedrooms} bedrooms`}`}
            target='_blank'
          >
            <i className='share-icons mdi mdi-twitter' />
          </a>
          <a
            href={`whatsapp://send?text=${unit && unit.marketingTitle || unit && `${unit.propertyname} ${unit.category} - ${unit.bedrooms} bedrooms\n${window.location.href}`}`}
            data-action='share/whatsapp/share'
          >
            <i className='share-icons mdi mdi-whatsapp' />

          </a>
        </td>
        <td align='right'>

          <div>
            <i className='mdi mdi-phone' />
            {unit.salesmanphonenumber}
          </div>


          <div>
            <i className='mdi mdi-email' />
            {unit.salesmanemail}

          </div>

        </td>
      </tr>
      <tr>
        <td className='c5' colSpan='4'>&nbsp;</td>
      </tr>
      <tr>
        <td style={{ height: '24px' }} colSpan='4'>
          <table width='644' height='24' border='0' cellSpacing='0' cellPadding='0'>
            <tbody>
              <tr>
                <td
                  className='c6'
                  rowSpan='3'
                >
                  {' '}
                  {unit?.propertyname}
                  {' '}
                  {unit?.category}
                  &nbsp;For Sales /
                  {' '}
                  {unit.community}
                  <br />
                  <span style={{ color: '#30b9da' }}>
                    {unit.marketingTitle}
                    {' '}
                  </span>
                </td>
              </tr>
              <tr>
                <td
                  align='right'
                  className='c7'
                >
                  Selling
                  Price
                </td>
              </tr>
              <tr>
                <td align='right' className='c8'>{unit.sellprice}</td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
      {/* <tr>
        <td colSpan='4'>&nbsp;</td>
      </tr> */}
    </div>
  );
};
export default UnitCardHeader;
