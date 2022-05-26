import React from 'react';
// import moment from 'moment';
import { UserAccountTypeEnum } from '../../../../../Enums';

export const ContactsTableHeaderData = [
  {
    id: 1,
    label: 'name',
    input: 'name',
    isHiddenFilter: true,
    isDefaultFilterColumn: true,
  },
  {
    id: 2,
    label: 'type',
    input: 'userType',
    isHiddenFilter: true,
    isDefaultFilterColumn: true,
  },
  {
    id: 3,
    label: 'class',
    isHiddenFilter: true,
    isDefaultFilterColumn: true,
    component: (item) =>
      (item.accountType && UserAccountTypeEnum[item.accountType].tableImg && (
        <img src={UserAccountTypeEnum[item.accountType].tableImg} alt='account-type' />
      )) || <span />,
  },
  {
    id: 4,
    label: 'creation',
    input: 'creationDate',
    isHiddenFilter: true,
    fieldKey: 'createdOn',
    isDefaultFilterColumn: true,
    isDate: true,
  },
  {
    id: 5,
    label: 'progress',
    input: 'progressWithPercentage',
    fieldKey: 'data_completed',
    textInputType: 'number',
    textInputMax: 100,
    textInputMin: 0,
    isHiddenFilter: true,
    isDefaultFilterColumn: true,
  },
  {
    id: 6,
    label: 'email',
    isHiddenFilter: true,
    isDefaultFilterColumn: true,
    component: (item) =>
      (item.details && item.details.map((el) => el.title === 'email' && el.value)) || <span />,
  },
  {
    id: 8,
    label: 'nationality',
    isHiddenFilter: true,
    isDefaultFilterColumn: true,
    component: (item) =>
      (item.details && item.details.map((el) => el.title === 'nationality' && el.value)) || (
        <span />
      ),
  },
  {
    id: 9,
    label: 'location',
    isHiddenFilter: true,
    isDefaultFilterColumn: true,
    component: (item) =>
      (item.details && item.details.map((el) => el.title === 'location' && el.value)) || <span />,
  },
  // {
  //   id: 10,
  //   label: 'address-line',
  //   component: (item) =>
  //     (item.details &&
  //       item.details
  //         .find((el) => el.ContactAllDetails)
  //         .ContactAllDetails.map((el) => el.title === 'address_line_1' && el.value)) || <span />,
  // },
  // {
  //   id: 11,
  //   label: 'building-name',
  //   component: (item) =>
  //     (item.details &&
  //       item.details
  //         .find((el) => el.ContactAllDetails)
  //         .ContactAllDetails.map((el) => el.title === 'building_name' && el.value)) || <span />,
  // },
  // {
  //   id: 12,
  //   label: 'building-no',
  //   component: (item) =>
  //     (item.details &&
  //       item.details
  //         .find((el) => el.ContactAllDetails)
  //         .ContactAllDetails.map((el) => el.title === 'building_no' && el.value)) || <span />,
  // },
  // // {
  // //   id: 13,
  // //   label: 'residence-address',
  // //   component: (item) => {
  // //     const value = (item.allDetails && item.allDetails['Residence Address']) || [];
  // //     return (
  // //       value.map(
  // //         (el, index) =>
  // //           (el.value &&
  // //             el.value !== 'N/A' &&
  // //             el.value + ((value.length - 1 > index && ', ') || '')) ||
  // //           ''
  // //       ) || <span />
  // //     );
  // //   },
  // // },
  // {
  //   id: 13,
  //   label: 'country',
  //   component: (item) =>
  //     (item.allDetails &&
  //       item.allDetails.Address &&
  //       item.allDetails.Address.map(
  //         (el) => el.title === 'country' && el.value !== 'N/A' && el.value
  //       )) || <span />,
  // },
  // {
  //   id: 14,
  //   label: 'city',
  //   component: (item) =>
  //     (item.allDetails &&
  //       item.allDetails.Address &&
  //       item.allDetails.Address.map(
  //         (el) => el.title === 'city' && el.value !== 'N/A' && el.value
  //       )) || <span />,
  // },
  // {
  //   id: 15,
  //   label: 'district',
  //   component: (item) =>
  //     (item.allDetails &&
  //       item.allDetails.Address &&
  //       item.allDetails.Address.map(
  //         (el) => el.title === 'district' && el.value !== 'N/A' && el.value
  //       )) || <span />,
  // },
  // {
  //   id: 16,
  //   label: 'community',
  //   component: (item) =>
  //     (item.allDetails &&
  //       item.allDetails.Address &&
  //       item.allDetails.Address.map(
  //         (el) => el.title === 'community' && el.value !== 'N/A' && el.value
  //       )) || <span />,
  // },
  // {
  //   id: 17,
  //   label: 'street',
  //   component: (item) =>
  //     (item.allDetails &&
  //       item.allDetails.Address &&
  //       item.allDetails.Address.map(
  //         (el) => el.title === 'street' && el.value !== 'N/A' && el.value
  //       )) || <span />,
  // },
  // {
  //   id: 18,
  //   label: 'floor-no',
  //   component: (item) =>
  //     (item.allDetails &&
  //       item.allDetails.Address &&
  //       item.allDetails.Address.map(
  //         (el) => el.title === 'floor_no' && el.value !== 'N/A' && el.value
  //       )) || <span />,
  // },
  // {
  //   id: 19,
  //   label: 'office-no',
  //   component: (item) =>
  //     (item.allDetails &&
  //       item.allDetails.Address &&
  //       item.allDetails.Address.map(
  //         (el) => el.title === 'office_no' && el.value !== 'N/A' && el.value
  //       )) || <span />,
  // },
  // {
  //   id: 20,
  //   label: 'map',
  //   component: (item) =>
  //     (item.allDetails &&
  //       item.allDetails.Address &&
  //       item.allDetails.Address.map(
  //         (el) => el.title === 'map' && el.value !== 'N/A' && el.value
  //       )) || <span />,
  // },
  // {
  //   id: 21,
  //   label: 'postalzip-code',
  //   component: (item) =>
  //     (item.allDetails &&
  //       item.allDetails.Address &&
  //       item.allDetails.Address.map(
  //         (el) => el.title === 'postalzip_code' && el.value !== 'N/A' && el.value
  //       )) || <span />,
  // },
  // {
  //   id: 22,
  //   label: 'po-box',
  //   component: (item) =>
  //     (item.allDetails &&
  //       item.allDetails.Address &&
  //       item.allDetails.Address.map(
  //         (el) => el.title === 'po_box' && el.value !== 'N/A' && el.value
  //       )) || <span />,
  // },
  // {
  //   id: 23,
  //   label: 'near-by',
  //   component: (item) =>
  //     (item.allDetails &&
  //       item.allDetails.Address &&
  //       item.allDetails.Address.map(
  //         (el) => el.title === 'near_by' && el.value !== 'N/A' && el.value
  //       )) || <span />,
  // },
  // {
  //   id: 24,
  //   label: 'facebook-link',
  //   component: (item) =>
  //     (item.allDetails &&
  //       item.allDetails['Social Media'] &&
  //       item.allDetails['Social Media'].map(
  //         (el) => el.title === 'facebook_link' && el.value !== 'N/A' && el.value
  //       )) || <span />,
  // },
  // {
  //   id: 25,
  //   label: 'twitter-link',
  //   component: (item) =>
  //     (item.allDetails &&
  //       item.allDetails['Social Media'] &&
  //       item.allDetails['Social Media'].map(
  //         (el) => el.title === 'twitter_link' && el.value !== 'N/A' && el.value
  //       )) || <span />,
  // },
  // {
  //   id: 26,
  //   label: 'instagram-link',
  //   component: (item) =>
  //     (item.allDetails &&
  //       item.allDetails['Social Media'] &&
  //       item.allDetails['Social Media'].map(
  //         (el) => el.title === 'instagram_link' && el.value !== 'N/A' && el.value
  //       )) || <span />,
  // },
  // {
  //   id: 27,
  //   label: 'linkedin-link',
  //   component: (item) =>
  //     (item.allDetails &&
  //       item.allDetails['Social Media'] &&
  //       item.allDetails['Social Media'].map(
  //         (el) => el.title === 'linkedin_link' && el.value !== 'N/A' && el.value
  //       )) || <span />,
  // },
  // {
  //   id: 28,
  //   label: 'licence-no',
  //   component: (item) =>
  //     (item.allDetails &&
  //       item.allDetails['Company Documents'] &&
  //       item.allDetails['Company Documents'].map(
  //         (el) => el.title === 'licence_no' && el.value !== 'N/A' && el.value
  //       )) || <span />,
  // },
  // {
  //   id: 29,
  //   label: 'license-issuer',
  //   component: (item) =>
  //     (item.allDetails &&
  //       item.allDetails['Company Documents'] &&
  //       item.allDetails['Company Documents'].map(
  //         (el) => el.title === 'license_issuer' && el.value !== 'N/A' && el.value
  //       )) || <span />,
  // },
  // {
  //   id: 30,
  //   label: 'license-expiry',
  //   component: (item) =>
  //     (item.allDetails &&
  //       item.allDetails['Company Documents'] &&
  //       item.allDetails['Company Documents'].map(
  //         (el) => el.title === 'license_expiry' && el.value !== 'N/A' && el.value
  //       )) || <span />,
  // },
  // {
  //   id: 31,
  //   label: 'title',
  //   component: (item) =>
  //     (item.details &&
  //       item.details
  //         .find((el) => el.ContactAllDetails)
  //         .ContactAllDetails.map((el) => el.title === 'title' && el.value)) || <span />,
  // },
  // {
  //   id: 32,
  //   label: 'gender',
  //   component: (item) =>
  //     (item.details &&
  //       item.details
  //         .find((el) => el.ContactAllDetails)
  //         .ContactAllDetails.map((el) => el.title === 'gender' && el.value)) || <span />,
  // },
  // {
  //   id: 33,
  //   label: 'investor',
  //   component: (item) =>
  //     (item.details &&
  //       item.details
  //         .find((el) => el.ContactAllDetails)
  //         .ContactAllDetails.map((el) => el.title === 'investor' && el.value)) || <span />,
  // },
  // {
  //   id: 34,
  //   label: 'owner-for-one-unit',
  //   component: (item) =>
  //     (item.details &&
  //       item.details
  //         .find((el) => el.ContactAllDetails)
  //         .ContactAllDetails.map((el) => el.title === 'owner_for_one_unit' && el.value)) || (
  //         <span />
  //     ),
  // },
  // {
  //   id: 35,
  //   label: 'owner-in-multiple-areas',
  //   component: (item) =>
  //     (item.details &&
  //       item.details
  //         .find((el) => el.ContactAllDetails)
  //         .ContactAllDetails.map((el) => el.title ===
  // 'owner_in_multiple_areas' && el.value)) || (
  //         <span />
  //     ),
  // },
  // {
  //   id: 36,
  //   label: 'passport-expiry-date',
  //   component: (item) =>
  //     (item.details &&
  //       item.details
  //         .find((el) => el.ContactAllDetails)
  //         .ContactAllDetails.map(
  //           (el) =>
  //             (el.title === 'passport_expiry_date' &&
  //               el.value &&
  //               moment(el.value).format('YYYY-MM-DD')) ||
  //             ''
  //         )) || <span />,
  // },
  // {
  //   id: 37,
  //   label: 'multi-property-owner',
  //   component: (item) =>
  //     (item.details &&
  //       item.details
  //         .find((el) => el.ContactAllDetails)
  //         .ContactAllDetails.map((el) => el.title === 'multi_property_owner' && el.value)) || (
  //         <span />
  //     ),
  // },
  // {
  //   id: 38,
  //   label: 'high-net-worth',
  //   component: (item) =>
  //     (item.details &&
  //       item.details
  //         .find((el) => el.ContactAllDetails)
  //         .ContactAllDetails.map((el) => el.title === 'high_net_worth' && el.value)) || <span />,
  // },
  // {
  //   id: 39,
  //   label: 'workoffice-no',
  //   component: (item) =>
  //     (item.details &&
  //       item.details
  //         .find((el) => el.ContactAllDetails)
  //         .ContactAllDetails.map((el) => el.title === 'workoffice_no' && el.value)) || <span />,
  // },
  // {
  //   id: 40,
  //   label: 'fax',
  //   component: (item) =>
  //     (item.details &&
  //       item.details
  //         .find((el) => el.ContactAllDetails)
  //         .ContactAllDetails.map((el) => el.title === 'fax' && el.value)) || <span />,
  // },
  // {
  //   id: 41,
  //   label: 'nationality-no',
  //   component: (item) =>
  //     (item.details &&
  //       item.details
  //         .find((el) => el.ContactAllDetails)
  //         .ContactAllDetails.map((el) => el.title === 'nationality_no' && el.value)) || <span />,
  // },
  // {
  //   id: 42,
  //   label: 'nationality-category',
  //   component: (item) =>
  //     (item.details &&
  //       item.details
  //         .find((el) => el.ContactAllDetails)
  //         .ContactAllDetails.map((el) => el.title === 'nationality_category' && el.value)) || (
  //         <span />
  //     ),
  // },
  // {
  //   id: 43,
  //   label: 'workcountry',
  //   component: (item) =>
  //     (item.details &&
  //       item.details
  //         .find((el) => el.ContactAllDetails)
  //         .ContactAllDetails.map((el) => el.title === 'workcountry' && el.value)) || <span />,
  // },
  // {
  //   id: 44,
  //   label: 'marital-status',
  //   component: (item) =>
  //     (item.details &&
  //       item.details
  //         .find((el) => el.ContactAllDetails)
  //         .ContactAllDetails.map((el) => el.title === 'marital_status' && el.value)) || <span />,
  // },
  // {
  //   id: 45,
  //   label: 'number-of-kids',
  //   component: (item) =>
  //     (item.details &&
  //       item.details
  //         .find((el) => el.ContactAllDetails)
  //         .ContactAllDetails.map((el) => el.title === 'number_of_kids' && el.value)) || <span />,
  // },
  // {
  //   id: 46,
  //   label: 'tax-registration-no',
  //   component: (item) =>
  //     (item.details &&
  //       item.details
  //         .find((el) => el.ContactAllDetails)
  //         .ContactAllDetails.map((el) => el.title === 'tax_registration_no' && el.value)) || (
  //         <span />
  //     ),
  // },
  // {
  //   id: 47,
  //   label: 'sub-community',
  //   component: (item) =>
  //     (item.details &&
  //       item.details
  //         .find((el) => el.ContactAllDetails)
  //         .ContactAllDetails.map((el) => el.title === 'sub_community' && el.value)) || <span />,
  // },
  // {
  //   id: 48,
  //   label: 'community-source-file',
  //   component: (item) =>
  //     (item.details &&
  //       item.details
  //         .find((el) => el.ContactAllDetails)
  //         .ContactAllDetails.map((el) => el.title === 'community_source_file' && el.value)) || (
  //         <span />
  //     ),
  // },
  // {
  //   id: 49,
  //   label: 'community-source-file',
  //   component: (item) =>
  //     (item.details &&
  //       item.details
  //         .find((el) => el.ContactAllDetails)
  //         .ContactAllDetails.map((el) => el.title === 'community_source_file' && el.value)) || (
  //         <span />
  //     ),
  // },
];
