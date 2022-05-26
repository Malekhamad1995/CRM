import moment from 'moment';
import { ContactTypeEnum, UserAccountTypeEnum } from '../../../../../Enums';

export const ContactsMapper = (item) => {
  const getAccountType = (type) => {
    if (type === 'Normal') return UserAccountTypeEnum.normal.value;
    if (type === 'VIP') return UserAccountTypeEnum.platinum.value;
    if (type === 'VVIP') return UserAccountTypeEnum.gold.value;
    return null;
  };
  const { contact, leadTypes } = item;
  return {
    id: item.contactsId,
    contactClassifications:
      (contact.contact_classifications && contact.contact_classifications) || [],
    contactPreference: contact.contact_preference && contact.contact_preference,
    imagePath:
      +contact.contact_type_id === 1 ?
        (contact && contact.contact_image &&
            contact.contact_image['Image Upload'] &&
            contact.contact_image['Image Upload'][0] &&
            contact.contact_image['Image Upload'][0].uuid) ||
          '' :
        (contact && contact.company_logoimage &&
            contact.company_logoimage['Company Logo'] &&
            contact.company_logoimage['Company Logo'][0] &&
            contact.company_logoimage['Company Logo'][0].uuid) ||
          '',
    leadTypes,
    name:
    contact && contact.contact_type_id === 2 ?
        (contact.company_name && contact.company_name) || '' :
        `${(contact.first_name && contact.first_name) || ''} ${
            (contact.last_name && contact.last_name) || ''
          }` || 'N/A',
    updateDate: item.updateOn,
    contactIds: contact.contactIds,
    type:
      +contact.contact_type_id === 2 ?
        ContactTypeEnum.corporate.value :
        (contact.gender &&
            contact.gender.lookupItemName === 'Male' &&
            ContactTypeEnum.man.value) ||
          ContactTypeEnum.woman.value,
    userType: (contact.contact_type_id === 2 && 'Corporate') || 'Individual',
    userTypeId: contact.contact_type_id,
    accountType:
      contact.contact_type_id === 2 ?
        contact.company_class && getAccountType(contact.company_class.lookupItemName) :
        contact.contact_class && getAccountType(contact.contact_class.lookupItemName),
    progress:
      typeof contact.data_completed === 'string' && contact.data_completed.includes('%') ?
        +contact.data_completed.substr(0, contact.data_completed.length - 1) :
        +contact.data_completed,
    progressWithPercentage:
      typeof contact.data_completed !== 'string' ?
        `${contact.data_completed}%` :
        contact.data_completed,
    creationDate: item.createdOn,
    details: [
      {
        title: 'name',
        value:
          contact.contact_type_id === 2 ?
            (contact.company_name && contact.company_name) || 'N/A' :
            `${(contact.first_name && contact.first_name) || ''} ${
                (contact.last_name && contact.last_name) || ''
              }` || 'N/A',
      },
      {
        title: 'location',
        value:
          ((contact.country &&
            contact.country.lookupItemName &&
            `${contact.country.lookupItemName}`) ||
            '') +
            ((contact.city && contact.city.lookupItemName && `, ${contact.city.lookupItemName}`) ||
              '') +
            ((contact.street && contact.street.value && `, ${contact.street.value} `) || '') ||
          'N/A',
      },
      {
        title: 'email',
        value:
          contact.contact_type_id === 2 ?
            contact.general_email && contact.general_email.email :
            (contact.email_address && contact.email_address.email) || 'N/A',
      },
      {
        title: contact.contact_type_id === 2 ? 'landline-number' : 'mobile',
        value:
          contact.contact_type_id === 2 ?
            contact.landline_number && contact.landline_number.phone :
            (contact.mobile && contact.mobile.phone) || 'N/A',
      },
      {
        iconClasses: 'mdi mdi-earth',
        title: 'nationality',
        value:
          contact.contact_type_id === 2 ?
            contact.company_nationality && contact.company_nationality.lookupItemName :
            (contact.nationality && contact.nationality.lookupItemName) || 'N/A',
      },
      (contact.contact_type_id === 2 && {
        title: 'industry',
        value: (contact.industry && contact.industry.lookupItemName) || 'N/A',
      }) || {
        iconClasses: 'mdi mdi-translate',
        title: 'language',
        value: (contact.language && contact.language.lookupItemName) || 'N/A',
      },
      {
        title: contact.contact_type_id === 2 ? 'website' : 'home-phone',
        value:
          contact.contact_type_id === 2 ?
            contact.company_website && contact.company_website :
            (contact.home_phone && contact.home_phone.phone) || 'N/A',
      },
      {
        title: contact.contact_type_id === 2 ? 'company-type' : 'work-company-name',
        value:
          contact.contact_type_id === 2 ?
            contact.company_type && contact.company_type.lookupItemName :
            (contact.work_company_name && contact.work_company_name.name) || 'N/A',
      },
      {
        title: contact.contact_type_id === 2 ? 'contact-person-mobile' : 'investor',
        value: (contact.investor && contact.investor) || 'N/A',
      },
      {
        title: contact.contact_type_id === 2 ? 'contact-person-email' : 'media-name',
        value: (contact.media_name && contact.media_name.lookupItemName) || 'N/A',
      },
      {
        title: contact.contact_type_id === 2 ? 'contact-person-name' : 'profession',
        value:
          contact.contact_type_id === 2 ?
            contact.contacts_person && contact.contacts_person.map((el) => `${el.name}, `) :
            (contact.profession && contact.profession) || 'N/A',
      },
      {
        ContactAllDetails: [
          {
            title: 'contact_class',
            value: (contact.contact_class && contact.contact_class.lookupItemName) || '',
          },
          {
            title: 'title',
            value: (contact.title && contact.title.lookupItemName) || '',
          },
          {
            title: 'gender',
            value: (contact.gender && contact.gender.lookupItemName) || '',
          },
          {
            title: 'investor',
            value: (contact.investor && contact.investor) || '',
          },
          {
            title: 'owner_for_one_unit',
            value: (contact.owner_for_one_unit && contact.owner_for_one_unit) || '',
          },
          {
            title: 'owner_in_multiple_areas',
            value: (contact.owner_in_multiple_areas && contact.owner_in_multiple_areas) || '',
          },
          {
            title: 'passport_expiry_date',
            value: (contact.passport_expiry_date && contact.passport_expiry_date) || '',
          },
          {
            title: 'createdOn',
            value: (contact.createdOn && contact.createdOn) || '',
          },
          {
            title: 'multi_property_owner',
            value: (contact.multi_property_owner && contact.multi_property_owner) || '',
          },
          {
            title: 'high_net_worth',
            value: (contact.high_net_worth && contact.high_net_worth) || '',
          },
          {
            title: 'floor_no',
            value: (contact.floor_no && contact.floor_no.type) || '',
          },
          {
            title: 'building_name',
            value: (contact.building_name && contact.building_name.value) || '',
          },
          {
            title: 'building_no',
            value: (contact.building_no && contact.building_no.value) || '',
          },
          {
            title: 'near_by',
            value: (contact.near_by && contact.near_by.value) || '',
          },
          {
            title: 'postalzip_code',
            value: (contact.postalzip_code && contact.postalzip_code.value) || '',
          },
          {
            title: 'po_box',
            value: (contact.po_box && contact.po_box.value) || '',
          },
          {
            title: 'address_line_1',
            value: (contact.address_line_1 && contact.address_line_1.value) || '',
          },
          {
            title: 'workoffice_no',
            value: (contact.workoffice_no && contact.workoffice_no.value) || '',
          },
          {
            title: 'fax',
            value: (contact.fax && contact.fax.phone) || '',
          },
          {
            title: 'nationality_no',
            value: (contact.nationality_no && contact.nationality_no) || '',
          },
          {
            title: 'nationality_category',
            value:
              (contact.nationality_category && contact.nationality_category.lookupItemName) || '',
          },
          {
            title: 'workcountry',
            value: (contact.workcountry && contact.workcountry) || '',
          },
          {
            title: 'marital_status',
            value: (contact.marital_status && contact.marital_status.lookupItemName) || '',
          },
          {
            title: 'number_of_kids',
            value: (contact.number_of_kids && contact.number_of_kids) || '',
          },
          {
            title: 'tax_registration_no',
            value: (contact.tax_registration_no && contact.tax_registration_no) || '',
          },
          {
            title: 'sub_community',
            value: (contact.sub_community && contact.sub_community.lookupItemName) || '',
          },
          {
            title: 'community_source_file',
            value: contact.community_source_file || '',
          },
          {
            title: 'community',
            value: (contact.community && contact.community.lookupItemName) || '',
          },
          {
            title: 'country',
            value: (contact.country && contact.country.lookupItemName) || '',
          },
          {
            title: 'data_completed',
            value: contact.data_completed || '',
          },
          {
            title: 'date_of_birth',
            value: contact.date_of_birth || '',
          },
          {
            title: 'district',
            value: (contact.district && contact.district.lookupItemName) || '',
          },
          {
            title: 'facebook_link',
            value: (contact.facebook_link && contact.facebook_link.link) || '',
          },
          {
            title: 'id_card_expiry_date',
            value: contact.id_card_expiry_date || '',
          },
          {
            title: 'id_card_no',
            value: contact.id_card_no || '',
          },
          {
            title: 'instagram_link',
            value: (contact.instagram_link && contact.instagram_link.link) || '',
          },
          {
            title: 'linkedin_link',
            value: (contact.linkedin_link && contact.linkedin_link.link) || '',
          },
          {
            title: 'main_information',
            value: contact.main_information || '',
          },
          {
            title: 'other_contact_mobile_no',
            value: (contact.other_contact_mobile_no && contact.other_contact_mobile_no.phone) || '',
          },
          {
            title: 'passport_issue_date',
            value: contact.passport_issue_date && '',
          },
          {
            title: 'passport_no',
            value: contact.passport_no || '',
          },
          {
            title: 'place_of_work',
            value: contact.place_of_work && '',
          },
          {
            title: 'promo_sms_email',
            value: contact.promo_sms_email && '',
          },
          {
            title: 'property_source_file',
            value: contact.property_source_file || '',
          },
          {
            title: 'qualification',
            value:
              contact.contact_type_id === 2 ?
                contact.qualification && contact.qualification :
                contact.qualification && contact.qualification,
          },
          {
            title: 'representative_contact',
            value:
              contact.contact_type_id === 2 ?
                contact.representative_contact && contact.representative_contact :
                contact.representative_contact && contact.representative_contact,
          },
          {
            title: 'social_media_tap',
            value:
              contact.contact_type_id === 2 ?
                contact.social_media_tap && contact.social_media_tap :
                contact.social_media_tap && contact.social_media_tap,
          },
          {
            title: 'source_by',
            value:
              contact.contact_type_id === 2 ?
                contact.source_by && contact.source_by :
                contact.source_by && contact.source_by,
          },
          {
            title: 'source_file_date',
            value:
              contact.contact_type_id === 2 ?
                contact.source_file_date && contact.source_file_date :
                contact.source_file_date && contact.source_file_date,
          },
          {
            title: 'source_file_name',
            value:
              contact.contact_type_id === 2 ?
                contact.source_file_name && contact.source_file_name :
                contact.source_file_name && contact.source_file_name,
          },
          {
            title: 'source_file_tap',
            value:
              contact.contact_type_id === 2 ?
                contact.source_file_tap && contact.source_file_tap :
                contact.source_file_tap && contact.source_file_tap,
          },
          {
            title: 'source_file_year',
            value:
              contact.contact_type_id === 2 ?
                contact.source_file_year && contact.source_file_year :
                contact.source_file_year && contact.source_file_year,
          },
          {
            title: 'spouse_contact',
            value:
              contact.contact_type_id === 2 ?
                contact.spouse_contact && contact.spouse_contact :
                contact.spouse_contact && contact.spouse_contact,
          },
          {
            title: 'twitter_link',
            value:
              contact.contact_type_id === 2 ?
                contact.twitter_link && contact.twitter_link :
                contact.twitter_link && contact.twitter_link,
          },
          {
            title: 'visa_expiry_date',
            value:
              contact.contact_type_id === 2 ?
                contact.visa_expiry_date && contact.visa_expiry_date :
                contact.visa_expiry_date && contact.visa_expiry_date,
          },
          {
            title: 'visa_issue_date',
            value:
              contact.contact_type_id === 2 ?
                contact.visa_issue_date && contact.visa_issue_date :
                contact.visa_issue_date && contact.visa_issue_date,
          },
          {
            title: 'visa_issuer_country',
            value:
              contact.contact_type_id === 2 ?
                contact.visa_issuer_country && contact.visa_issuer_country :
                contact.visa_issuer_country && contact.visa_issuer_country,
          },
          {
            title: 'visa_no',
            value:
              contact.contact_type_id === 2 ?
                contact.visa_no && contact.visa_no :
                contact.visa_no && contact.visa_no,
          },
          {
            title: 'visa_type',
            value:
              contact.contact_type_id === 2 ?
                contact.visa_type && contact.visa_type :
                contact.visa_type && contact.visa_type,
          },
          {
            title: 'whatsapp_mobile_number',
            value:
              contact.contact_type_id === 2 ?
                contact.whatsapp_mobile_number && contact.whatsapp_mobile_number :
                contact.whatsapp_mobile_number && contact.whatsapp_mobile_number,
          },
          {
            title: 'work_phone',
            value:
              contact.contact_type_id === 2 ?
                contact.work_phone && contact.work_phone :
                contact.work_phone && contact.work_phone,
          },
          {
            title: 'workcity',
            value:
              contact.contact_type_id === 2 ?
                contact.workcity && contact.workcity :
                contact.workcity && contact.workcity,
          },
          {
            title: 'workcommunity',
            value:
              contact.contact_type_id === 2 ?
                contact.workcommunity && contact.workcommunity :
                contact.workcommunity && contact.workcommunity,
          },
          {
            title: 'workdistrict',
            value:
              contact.contact_type_id === 2 ?
                contact.workdistrict && contact.workdistrict :
                contact.workdistrict && contact.workdistrict,
          },
          {
            title: 'workmap',
            value:
              contact.contact_type_id === 2 ?
                contact.workmap && contact.workmap :
                contact.workmap && contact.workmap,
          },
          {
            title: 'workpostalzip_code',
            value:
              contact.contact_type_id === 2 ?
                contact.workpostalzip_code && contact.workpostalzip_code :
                contact.workpostalzip_code && contact.workpostalzip_code,
          },
          {
            title: 'worksubcommunity',
            value:
              contact.contact_type_id === 2 ?
                contact.worksubcommunity && contact.worksubcommunity :
                contact.worksubcommunity && contact.worksubcommunity,
          },
          {
            title: 'contactsId',
            value:
              contact.contact_type_id === 2 ?
                contact.contactsId && contact.contactsId :
                contact.contactsId && contact.contactsId,
          },
        ],
      },
    ],
    allDetails: {
      'Main Information': [
        {
          title: 'title',
          value: (contact.title && contact.title.lookupItemName) || 'N/A',
        },
        {
          title: 'first_name',
          value: (contact.first_name && contact.first_name) || 'N/A',
        },
        {
          title: 'last_name',
          value: (contact.last_name && contact.last_name) || 'N/A',
        },
        {
          title: 'gender',
          value: (contact.gender && contact.gender.lookupItemName) || 'N/A',
        },
        {
          title: 'mobile',
          value: (contact.mobile && contact.mobile.phone) || 'N/A',
        },
        {
          title: 'other_contact_mobile_no',
          value:
            (contact.other_contact_mobile_no && contact.other_contact_mobile_no.phone) || 'N/A',
        },
        {
          title: 'home_phone',
          value: (contact.home_phone && contact.home_phone.phone) || 'N/A',
        },
        {
          title: 'fax',
          value: (contact.fax && contact.fax.phone) || 'N/A',
        },
        {
          title: 'email',
          value: (contact.email_address && contact.email_address.email) || 'N/A',
        },
        {
          title: 'nationality',
          value: (contact.nationality && contact.nationality.lookupItemName) || 'N/A',
        },
        {
          title: 'language',
          value: (contact.language && contact.language.lookupItemName) || 'N/A',
        },
        {
          title: 'contact_class',
          value: (contact.contact_class && contact.contact_class.lookupItemName) || 'N/A',
        },
        {
          title: 'promo_sms_email',
          value: (contact.promo_sms_email && contact.promo_sms_email) || 'N/A',
        },
        {
          title: 'multi_property_owner',
          value: (contact.multi_property_owner && contact.multi_property_owner) || 'N/A',
        },
        {
          title: 'contact_preference',
          value:
            (contact.contact_preference &&
              contact.contact_preference.map((el) => `${el.lookupItemName}, `)) ||
            'N/A',
        },
        {
          title: 'main_information',
          value: (contact.main_information && contact.main_information) || 'N/A',
        },
      ],
      'Residence Address': [
        {
          title: 'country',
          value: (contact.country && contact.country.lookupItemName) || 'N/A',
        },
        {
          title: 'city',
          value: (contact.city && contact.city.lookupItemName) || 'N/A',
        },
        {
          title: 'district',
          value: (contact.district && contact.district.lookupItemName) || 'N/A',
        },
        {
          title: 'community',
          value: (contact.community && contact.community.lookupItemName) || 'N/A',
        },
        {
          title: 'sub_community',
          value: (contact.sub_community && contact.sub_community.lookupItemName) || 'N/A',
        },
        {
          title: 'street',
          value: (contact.street && contact.street.value) || 'N/A',
        },
        {
          title: 'building_name',
          value: (contact.building_name && contact.building_name.value) || 'N/A',
        },
        {
          title: 'building_no',
          value: (contact.building_no && contact.building_no.value) || 'N/A',
        },
        {
          title: 'floor_no',
          value: (contact.floor_no && contact.floor_no.value) || 'N/A',
        },
        {
          title: 'postalzip_code',
          value: (contact.postalzip_code && contact.postalzip_code.value) || 'N/A',
        },
        {
          title: 'po_box',
          value: (contact.po_box && contact.po_box.value) || 'N/A',
        },
        {
          title: 'map',
          value: (contact.map && `${contact.map.latitude}, ${contact.map.longitude}`) || 'N/A',
        },
      ],
      'Company Info': [
        {
          title: 'company_name',
          value: (contact.company_name && contact.company_name) || 'N/A',
        },
        {
          title: 'landline_number',
          value: (contact.landline_number && contact.landline_number.phone) || 'N/A',
        },
        {
          title: 'established_date',
          value:
            (contact.established_date && moment(contact.established_date).format('DD/MM/YYYY')) ||
            'N/A',
        },
        {
          title: 'retail_category',
          value: (contact.retail_category && contact.retail_category.lookupItemName) || 'N/A',
        },
        {
          title: 'company_nationality',
          value:
            (contact.company_nationality && contact.company_nationality.lookupItemName) || 'N/A',
        },
        {
          title: 'no_of_local_branches',
          value: (contact.no_of_local_branches && contact.no_of_local_branches) || 'N/A',
        },
        {
          title: 'no_of_remote_branches',
          value: (contact.no_of_remote_branches && contact.no_of_remote_branches) || 'N/A',
        },
        {
          title: 'no_of_employees',
          value: (contact.no_of_employees && contact.no_of_employees) || 'N/A',
        },
        {
          title: 'business_region',
          value: (contact.business_region && contact.business_region) || 'N/A',
        },
        {
          title: 'company_website',
          value: (contact.company_website && contact.company_website.link) || 'N/A',
        },
        {
          title: 'general_email',
          value: (contact.general_email && contact.general_email.email) || 'N/A',
        },
        {
          title: 'language',
          value: (contact.language && contact.language.lookupItemName) || 'N/A',
        },
        {
          title: 'company_type',
          value: (contact.company_type && contact.company_type.lookupItemName) || 'N/A',
        },
        {
          title: 'promo_smsemail',
          value: (contact.promo_smsemail && contact.promo_smsemail) || 'N/A',
        },
        {
          title: 'company_class',
          value: (contact.company_class && contact.company_class.lookupItemName) || 'N/A',
        },
        {
          title: 'multi_property_owner',
          value: (contact.multi_property_owner && contact.multi_property_owner) || 'N/A',
        },
        {
          title: 'exclusive',
          value: (contact.exclusive && contact.exclusive) || 'N/A',
        },
        {
          title: 'contacts_person',
          value:
            (contact.contacts_person && contact.contacts_person.map((el) => `${el.name}, `)) ||
            'N/A',
        },
        {
          title: 'contact_preference',
          value:
            (contact.contact_preference &&
              contact.contact_preference.map((el) => `${el.lookupItemName}, `)) ||
            'N/A',
        },
        {
          title: 'contact_classifications',
          value:
            (contact.contact_classifications &&
              contact.contact_classifications.map((el) => `${el.lookupItemName}, `)) ||
            'N/A',
        },
        {
          title: 'special_requirements',
          value: (contact.special_requirements && contact.special_requirements) || 'N/A',
        },
      ],
      Address: [
        {
          title: 'country',
          value: (contact.country && contact.country.lookupItemName) || 'N/A',
        },
        {
          title: 'city',
          value: (contact.city && contact.city.lookupItemName) || 'N/A',
        },
        {
          title: 'district',
          value: (contact.district && contact.district.lookupItemName) || 'N/A',
        },
        {
          title: 'community',
          value: (contact.community && contact.community.lookupItemName) || 'N/A',
        },
        {
          title: 'street',
          value: (contact.street && contact.street.value) || 'N/A',
        },
        {
          title: 'building_name',
          value: (contact.building_name && contact.building_name.value) || 'N/A',
        },
        {
          title: 'floor_no',
          value: (contact.floor_no && contact.floor_no.value) || 'N/A',
        },
        {
          title: 'office_no',
          value: (contact.office_no && contact.office_no.value) || 'N/A',
        },
        {
          title: 'map',
          value:
            (contact.map &&
              `Longitude: ${contact.map.longitude}, Latitude: ${contact.map.latitude}`) ||
            'N/A',
        },
        {
          title: 'postalzip_code',
          value: (contact.postalzip_code && contact.postalzip_code.value) || 'N/A',
        },
        {
          title: 'po_box',
          value: (contact.po_box && contact.po_box.value) || 'N/A',
        },
        {
          title: 'address_line_1',
          value: (contact.address_line_1 && contact.address_line_1.value) || 'N/A',
        },
        {
          title: 'near_by',
          value: (contact.near_by && contact.near_by.value) || 'N/A',
        },
      ],
      'Social Media': [
        {
          title: 'facebook_link',
          value: (contact.facebook_link && contact.facebook_link.link) || 'N/A',
        },
        {
          title: 'twitter_link',
          value: (contact.twitter_link && contact.twitter_link.link) || 'N/A',
        },
        {
          title: 'instagram_link',
          value: (contact.instagram_link && contact.instagram_link.link) || 'N/A',
        },
        {
          title: 'linkedin_link',
          value: (contact.linkedin_link && contact.linkedin_link.link) || 'N/A',
        },
      ],
      'Company Documents': [
        {
          title: 'licence_no',
          value: (contact.licence_no && contact.licence_no) || 'N/A',
        },
        {
          title: 'license_issuer',
          value: (contact.license_issuer && contact.license_issuer) || 'N/A',
        },
        {
          title: 'license_expiry',
          value: (contact.license_expiry && contact.license_expiry) || 'N/A',
        },
      ],
      'Upload Image & Documents': [
        {
          title: 'upload_documents',
          value:
            (contact.upload_documents &&
              contact.upload_documents.ID &&
              contact.upload_documents.selected &&
              `ID: ${contact.upload_documents.ID.map(
                (el) => el.fileName
              )}, Selected: ${contact.upload_documents.selected.map((el) => el.fileName)}`) ||
            'N/A',
        },
        {
          title: 'company_logoimage',
          value: (contact.company_logoimage && contact.company_logoimage.fileName) || 'N/A',
        },
      ],
      'Work Address': [
        {
          title: 'work_company_name',
          value: (contact.work_company_name && contact.work_company_name) || 'N/A',
        },
        {
          title: 'workcountry',
          value: (contact.workcountry && contact.workcountry.lookupItemName) || 'N/A',
        },
        {
          title: 'workcity',
          value: (contact.workcity && contact.workcity.lookupItemName) || 'N/A',
        },
        {
          title: 'workdistrict',
          value: (contact.workdistrict && contact.workdistrict.lookupItemName) || 'N/A',
        },
        {
          title: 'workcommunity',
          value: (contact.workcommunity && contact.workcommunity.lookupItemName) || 'N/A',
        },
        {
          title: 'worksubcommunity',
          value: (contact.worksubcommunity && contact.worksubcommunity.lookupItemName) || 'N/A',
        },
        {
          title: 'workstreet',
          value: (contact.workstreet && contact.workstreet.value) || 'N/A',
        },
        {
          title: 'workbuilding_name',
          value: (contact.workbuilding_name && contact.workbuilding_name.value) || 'N/A',
        },
        {
          title: 'workfloor_no',
          value: (contact.workfloor_no && contact.workfloor_no.value) || 'N/A',
        },
        {
          title: 'workbuilding_no',
          value: (contact.workbuilding_no && contact.workbuilding_no.value) || 'N/A',
        },
        {
          title: 'workoffice_no',
          value: (contact.workoffice_no && contact.workoffice_no.value) || 'N/A',
        },
        {
          title: 'work_phone',
          value: (contact.work_phone && contact.work_phone.phone) || 'N/A',
        },
        {
          title: 'workpostalzip_code',
          value: (contact.workpostalzip_code && contact.workpostalzip_code.value) || 'N/A',
        },
        {
          title: 'workmap',
          value:
            (contact.workmap &&
              contact.workmap.value &&
              contact.workmap.value.latitude &&
              contact.workmap.value.longitude &&
              `Latitude: ${contact.workmap.value.latitude}, Longitude: ${contact.workmap.value.longitude}`) ||
            'N/A',
        },
        {
          title: 'workaddress_line_1',
          value: (contact.workaddress_line_1 && contact.workaddress_line_1.value) || 'N/A',
        },
      ],
    },
    ...contact,
  };
};
