import React, {
 useState, useEffect, useRef, useCallback
} from 'react';
import { PropTypes } from 'prop-types';
import Button from '@material-ui/core/Button';
import { CardsComponent } from '../CardsComponent/CardsComponent';
import { ActionsEnum } from '../../Enums';
import {
  bxSliderRerenderCallback,
  getBxSliderRerender,
  bxSliderRerenderClear,
} from '../../Helper';
import { useEventListener } from '../../Hooks';

const ContactCardItemComponent = (item, itemIndex, parentTranslationPath,
   translationPath, contactsOptions) => (
     <CardsComponent
       data={item}
       parentTranslationPath={parentTranslationPath}
       translationPath={translationPath}
       contactsOptions={contactsOptions}
     />
);
const BXSliderComponent = ({
  totalItems,
  data,
  currentIndexOptions,
  itemsNumberOnXXXL,
  itemsNumberOnXXL,
  itemsNumberOnXL,
  itemsNumberOnLG,
  itemsNumberOnMD,
  itemsNumberOnSM,
  itemsNumber,
  numberOfMovements,
  disableArrows,
  disableNavigatorOnEnd,
  disableNavigatorOnStart,
  disableOnLessThanMax,
  maxWidth,
  parentTranslationPath,
  translationPath,
  contactsOptions,
}) => {
  const [bxslideOptions, setBxslideOptions] = useState({
    maxShowItems: 0,
    currentIndex: 0,
    disableArrowIncrement: true,
    disableArrowDecrement: true,
  });
  const bxsliderWrapperRef = useRef(() => null);
  const [bxRerender, setBXRerender] = useState(false);
  bxSliderRerenderCallback(setBXRerender);
  const timer = useRef(null);
  const moverChecher = useCallback(() => {
    if (bxslideOptions.maxShowItems + bxslideOptions.currentIndex > totalItems) {
      setBxslideOptions((item) => {
        const currentIndex = bxslideOptions.maxShowItems +
          bxslideOptions.currentIndex -
          (bxslideOptions.maxShowItems + numberOfMovements);
        return { ...item, currentIndex };
      });
      if (currentIndexOptions && currentIndexOptions.onCurrentIndexChange)
        currentIndexOptions.onCurrentIndexChange(bxslideOptions.currentIndex);
    }
    if (bxslideOptions.currentIndex < 0) {
      setBxslideOptions((item) => {
        const currentIndex = 0;
        return { ...item, currentIndex };
      });
      if (currentIndexOptions && currentIndexOptions.onCurrentIndexChange)
        currentIndexOptions.onCurrentIndexChange(bxslideOptions.currentIndex);
    }
    if (
      (totalItems <= bxslideOptions.maxShowItems && disableOnLessThanMax) ||
      (disableNavigatorOnEnd
        && bxslideOptions.currentIndex + bxslideOptions.maxShowItems >= totalItems)
    ) {
      setBxslideOptions((item) => {
        const disableArrowIncrement = true;
        return { ...item, disableArrowIncrement };
      });
    } else {
      setBxslideOptions((item) => {
        const disableArrowIncrement = false;
        return { ...item, disableArrowIncrement };
      });
    }

    if (
      (totalItems <= bxslideOptions.maxShowItems && disableOnLessThanMax) ||
      (disableNavigatorOnStart
        && bxslideOptions.currentIndex + bxslideOptions.maxShowItems <= bxslideOptions.maxShowItems)
    ) {
      setBxslideOptions((item) => {
        const disableArrowDecrement = true;
        return { ...item, disableArrowDecrement };
      });
    } else {
      setBxslideOptions((item) => {
        const disableArrowDecrement = false;
        return { ...item, disableArrowDecrement };
      });
    }
  }, [
    bxslideOptions.currentIndex,
    bxslideOptions.maxShowItems,
    currentIndexOptions,
    disableNavigatorOnEnd,
    disableNavigatorOnStart,
    disableOnLessThanMax,
    numberOfMovements,
    totalItems,
  ]);
  const onResize = useCallback(() => {
    if (bxsliderWrapperRef.current) {
      if (bxsliderWrapperRef.current.clientWidth >= 1920) {
        setBxslideOptions((item) => {
          const maxShowItems = itemsNumberOnXXXL;
          return { ...item, maxShowItems };
        });
      } else if (
        bxsliderWrapperRef.current.clientWidth < 1920
        && bxsliderWrapperRef.current.clientWidth >= 1440
      ) {
        setBxslideOptions((item) => {
          const maxShowItems = itemsNumberOnXXL;
          return { ...item, maxShowItems };
        });
      } else if (
        bxsliderWrapperRef.current.clientWidth < 1440
        && bxsliderWrapperRef.current.clientWidth >= 1200
      ) {
        setBxslideOptions((item) => {
          const maxShowItems = itemsNumberOnXL;
          return { ...item, maxShowItems };
        });
      } else if (
        bxsliderWrapperRef.current.clientWidth < 1200
        && bxsliderWrapperRef.current.clientWidth >= 992
      ) {
        setBxslideOptions((item) => {
          const maxShowItems = itemsNumberOnLG;
          return { ...item, maxShowItems };
        });
      } else if (
        bxsliderWrapperRef.current.clientWidth < 992
        && bxsliderWrapperRef.current.clientWidth >= 768
      ) {
        setBxslideOptions((item) => {
          const maxShowItems = itemsNumberOnMD;
          return { ...item, maxShowItems };
        });
      } else if (
        bxsliderWrapperRef.current.clientWidth < 768
        && bxsliderWrapperRef.current.clientWidth >= 576
      ) {
        setBxslideOptions((item) => {
          const maxShowItems = itemsNumberOnSM;
          return { ...item, maxShowItems };
        });
      } else if (bxsliderWrapperRef.current.clientWidth < 576) {
        setBxslideOptions((item) => {
          const maxShowItems = itemsNumber;
          return { ...item, maxShowItems };
        });
      }
    }
    moverChecher();
  }, [
    itemsNumber,
    itemsNumberOnSM,
    itemsNumberOnMD,
    itemsNumberOnLG,
    itemsNumberOnXL,
    itemsNumberOnXXL,
    itemsNumberOnXXXL,
    moverChecher,
  ]);
  const sliderMove = useCallback(
    (situation) => {
      if (situation === 'Increment') {
        if (
          totalItems >=
          numberOfMovements + bxslideOptions.currentIndex + bxslideOptions.maxShowItems
        ) {
          setBxslideOptions((item) => {
            const currentIndex = item.currentIndex + numberOfMovements;
            return { ...item, currentIndex };
          });
        } else if (bxslideOptions.currentIndex < totalItems) {
          setBxslideOptions((item) => {
            const currentIndex = totalItems;
            return { ...item, currentIndex };
          });
        }
        if (currentIndexOptions && currentIndexOptions.onCurrentIndexChange)
          currentIndexOptions.onCurrentIndexChange(bxslideOptions.currentIndex);
      } else if (situation === 'Decrement' && bxslideOptions.currentIndex > 0) {
        setBxslideOptions((item) => {
          const currentIndex = item.currentIndex - numberOfMovements;
          return { ...item, currentIndex };
        });
        if (bxslideOptions.currentIndex < 0) {
          setBxslideOptions((item) => {
            const currentIndex = 0;
            return { ...item, currentIndex };
          });
        }
        if (currentIndexOptions && currentIndexOptions.onCurrentIndexChange)
          currentIndexOptions.onCurrentIndexChange(bxslideOptions.currentIndex);
      }
      onResize();
    },
    [
      bxslideOptions.currentIndex,
      bxslideOptions.maxShowItems,
      totalItems,
      onResize,
      currentIndexOptions,
      numberOfMovements,
    ]
  );
  const updateSize = useCallback(() => {
    // onResize();
    // setCurrentWidth(bxsliderWrapperRef.current.clientWidth);
    if (timer.current !== null) clearInterval(timer.current);
    let x = 0;
    timer.current = setInterval(() => {
      if (bxsliderWrapperRef.current && x !== bxsliderWrapperRef.current.clientWidth) {
        x = bxsliderWrapperRef.current.clientWidth;
        onResize();
      } else clearInterval(timer.current);
    }, 100);
  }, [onResize]);
  useEventListener('resize', onResize);
  useEffect(() => {
    if (bxsliderWrapperRef.current)
      onResize();
  }, [onResize]);
  useEffect(() => {
    document.querySelector('.open-button').addEventListener('click', () => {
      updateSize();
    });

    updateSize();
    setBXRerender(getBxSliderRerender());
  }, [bxRerender, setBXRerender, updateSize]);
  useEffect(
    () => () => {
      if (timer.current !== null) clearInterval(timer.current);
      bxSliderRerenderClear();
    },
    []
  );
  // useWindowSize();
  return (
    <div ref={bxsliderWrapperRef} className='bxslider-wrapper'>
      <div className='bxslide-arrow-decrement-wrapper'>
        <Button
          className='btns-icon theme-solid'
          disabled={disableArrows || bxslideOptions.disableArrowDecrement}
          onClick={() => sliderMove('Decrement')}
        >
          <span className='mdi mdi-menu-left' />
        </Button>
      </div>
      <div className='bxslider-items-wrapper'>
        {data
          .slice(
            (currentIndexOptions && currentIndexOptions.currentIndex) ||
              bxslideOptions.currentIndex,
            ((currentIndexOptions && currentIndexOptions.currentIndex) ||
              bxslideOptions.currentIndex) + bxslideOptions.maxShowItems
          )
          .map((item, index) => (
            <div
              className='bxslider-item'
              key={`bxslider-item${index + 1}`}
              style={{ maxWidth, width: `${100 / bxslideOptions.maxShowItems}%` }}
            >
              {ContactCardItemComponent(
                item,
                index + (currentIndexOptions && currentIndexOptions.currentIndex) ||
                  bxslideOptions.currentIndex,
                parentTranslationPath,
                translationPath,
                contactsOptions
              ) || null}
            </div>
          ))}
      </div>
      <div className='bxslide-arrow-increment-wrapper'>
        <Button
          className='btns-icon theme-solid'
          disabled={disableArrows || bxslideOptions.disableArrowIncrement}
          onClick={() => sliderMove('Increment')}
        >
          <span className='mdi mdi-menu-right' />
        </Button>
      </div>
    </div>
  );
};
BXSliderComponent.propTypes = {
  totalItems: PropTypes.number.isRequired,
  data: PropTypes.instanceOf(Array).isRequired,
  currentIndexOptions: PropTypes.shape({
    currentIndex: PropTypes.number,
    onCurrentIndexChange: PropTypes.func,
  }),
  itemsNumberOnXXXL: PropTypes.number,
  itemsNumberOnXXL: PropTypes.number,
  itemsNumberOnXL: PropTypes.number,
  itemsNumberOnLG: PropTypes.number,
  itemsNumberOnMD: PropTypes.number,
  itemsNumberOnSM: PropTypes.number,
  itemsNumber: PropTypes.number,
  numberOfMovements: PropTypes.number,
  disableArrows: PropTypes.bool,
  disableNavigatorOnEnd: PropTypes.bool,
  disableNavigatorOnStart: PropTypes.bool,
  disableOnLessThanMax: PropTypes.bool,
  maxWidth: PropTypes.number,
  translationPath: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  contactsOptions: PropTypes.shape({
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        enum: PropTypes.oneOf(Object.values(ActionsEnum).map((item) => item.key)),
        isDisabled: PropTypes.bool,
      })
    ),
    onActionClicked: PropTypes.func,
    imageInput: PropTypes.string,
    nameInput: PropTypes.string,
  }),
};
BXSliderComponent.defaultProps = {
  currentIndexOptions: {},
  itemsNumberOnXXXL: 6,
  itemsNumberOnXXL: 4,
  itemsNumberOnXL: 3,
  itemsNumberOnLG: 3,
  itemsNumberOnMD: 2,
  itemsNumberOnSM: 1,
  itemsNumber: 1,
  numberOfMovements: 1,
  disableArrows: false,
  disableNavigatorOnEnd: true,
  disableNavigatorOnStart: true,
  disableOnLessThanMax: true,
  maxWidth: 250,
  translationPath: '',
  parentTranslationPath: '',
  contactsOptions: {
    actions: ['1', '2', '3'],
    onActionClicked: () => {},
    imageInput: null,
    nameInput: null,
  },
};
export { BXSliderComponent };
