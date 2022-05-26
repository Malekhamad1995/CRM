import React from 'react'
import {UnitImagesTabComponent} from './Components/UnitImagesTabComponent'

const PublishedImages = () =>{

    const parentTranslationPath = 'UnitsProfileManagementView';
    const translationPath = '';
    return (
        <div className='published-images-wrapper'>
            <UnitImagesTabComponent
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            />
        </div>
    )

}


export {PublishedImages}
