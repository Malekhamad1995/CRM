import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { PermissionsComponent } from '../../PermissionsComponent/PermissionsComponent';
import { getIsAllowedPermission } from '../../../Helper';

export const TabsComponent = ({
  iconInput,
  data,
  currentTab,
  onTabChanged,
  wrapperClasses,
  tabsAriaLabel,
  labelInput,
  translationPath,
  parentTranslationPath,
  varient,
  orientation,
  iconOnly,
  themeClasses,
  scrollButtons,
  hiddenTabIndexes,
  maxIndex,
  minIndex,
  dynamicComponentProps,
  componentInput,
  withDynamicComponents,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  const loginResponse = useSelector((state) => state.login.loginResponse);
  return (
    <>
      <Tabs
        value={currentTab}
        onChange={onTabChanged}
        variant={varient}
        orientation={orientation}
        scrollButtons={scrollButtons}
        indicatorColor='primary'
        textColor='primary'
        className={`tabs-wrapper ${wrapperClasses} ${themeClasses} ${
          iconOnly ? 'icon-only' : ''
        }`}
        aria-label={tabsAriaLabel}
      >
        {data &&
          data
            .filter(
              (item, index) =>
                hiddenTabIndexes.findIndex((element) => element === index) ===
                  -1 &&
                getIsAllowedPermission(
                  item.permissionsList,
                  loginResponse,
                  item.permissionsId,
                  true
                )
            )
            .map((item, index) => (
              <Tab
                key={`tabRef${index + 1}`}
                disabled={
                  item.disabled ||
                  index > (maxIndex || data.length - 1) ||
                  index < (minIndex || 0)
                }
                label={
                  labelInput &&
                  !iconOnly && (
                    <span>{t(`${translationPath}${item[labelInput]}`)}</span>
                  )
                }
                icon={(
                  <span
                    className={(iconInput && item[iconInput]) || undefined}
                  />
                )}
              />
            ))}
      </Tabs>

      {(dynamicComponentProps || withDynamicComponents) &&
        data &&
        data
          .filter(
            (item, index) =>
              hiddenTabIndexes.findIndex((element) => element === index) === -1 &&
              getIsAllowedPermission(item.permissionsList, loginResponse, item.permissionsId, true)
          )
          .map((item, index) => {
            const Component = item[componentInput];
            return (
              currentTab === index &&
              ((Component && (
                <PermissionsComponent
                  permissionsList={item.permissionsList}
                  permissionsId={item.permissionsId}
                  allowEmptyRoles
                >
                  <Component
                    key={`dynamicComponentRef${index + 1}`}
                    {...(dynamicComponentProps || {})}
                    {...(item.props || {})}
                  />
                </PermissionsComponent>
              )) ||
                null)
            );
          })}

    </>
  );
};

TabsComponent.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired,
  onTabChanged: PropTypes.func.isRequired,
  hiddenTabIndexes: PropTypes.arrayOf(PropTypes.number),
  currentTab: PropTypes.number,
  iconInput: PropTypes.string,
  labelInput: PropTypes.string,
  wrapperClasses: PropTypes.string,
  tabsAriaLabel: PropTypes.string,
  translationPath: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  varient: PropTypes.string,
  orientation: PropTypes.string,
  themeClasses: PropTypes.oneOf([
    'theme-solid',
    'theme-default',
    'theme-curved',
  ]),
  scrollButtons: PropTypes.oneOf(['auto', 'desktop', 'off', 'on']),
  iconOnly: PropTypes.bool,
  maxIndex: PropTypes.number,
  minIndex: PropTypes.number,
  dynamicComponentProps: PropTypes.instanceOf(Object),
  componentInput: PropTypes.string,
  withDynamicComponents: PropTypes.bool,
};
TabsComponent.defaultProps = {
  hiddenTabIndexes: [],
  currentTab: 0,
  iconInput: undefined,
  labelInput: undefined,
  scrollButtons: undefined,
  wrapperClasses: '',
  translationPath: '',
  parentTranslationPath: '',
  tabsAriaLabel: 'tabs',
  varient: 'scrollable',
  themeClasses: 'theme-default',
  orientation: undefined, // 'vertical',undefined (for horizontal)
  iconOnly: false,
  maxIndex: undefined,
  minIndex: undefined,
  dynamicComponentProps: undefined,
  componentInput: 'component',
  withDynamicComponents: undefined,
};
