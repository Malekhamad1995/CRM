import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tables } from "../../../Components";
import { TableActions } from "../../../Enums";



export const TeamplateListView = ({
    data,
    translationPath,
    parentTranslationPath,
    filter,
    onPageIndexChanged,
    onPageSizeChanged,
    onFooterActionsClicked }) => {


    const { t } = useTranslation(parentTranslationPath);
    const [TeamplateListDataHeader] = useState([
        {
            id: 1,
            label: t(`${translationPath}template-id`),
            input: 'templateId',
            displayPath: 'templateId',
            isDate: false,
            isHiddenFilter: false
        },
        {
            id: 2,
            label: t(`${translationPath}template-name`),
            input: "templateName",
            isDate: false,
            isHiddenFilter: false
        },
        {
            id: 3,
            label: t(`${translationPath}template-text`),
            input: 'templateText',
            isDate: false,
            isHiddenFilter: false
        },
        {
            id: 4,
            label: t(`${translationPath}template-type`),
            input: "templateTypeName",
            isDate: false,
            isHiddenFilter: false
        },
        {
            id: 5,
            label: t(`${translationPath}template-file-name`),
            input: 'templateFileName',
            isDate: false,
            isHiddenFilter: false
        }
    ])


    return (
        <div className='w-100 px-3'>
            <Tables
                headerData={TeamplateListDataHeader}
                data={data && data.result}
                activePage={filter.pageIndex}
                itemsPerPage={filter.pageSize}
                actionsOptions={{
                    onActionClicked:
                        (actionEnum, item, focusedRow, event) => {
                            onFooterActionsClicked(actionEnum, item)(event)
                        }
                }}
                onPageIndexChanged={onPageIndexChanged}
                onPageSizeChanged={onPageSizeChanged}
                defaultActions={[
                    {
                        enum: TableActions.view.key,
                    },
                    {
                        enum: TableActions.edit.key,
                    },
                    {
                        enum: TableActions.delete.key
                    }
                ]}
                totalItems={data.totalCount}
            />
        </div>
    )
}