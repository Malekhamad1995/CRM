import { useRef, useEffect } from 'react';

function useEventListener(eventName, handler, element = window, passiveDto) {
  const savedHandler = useRef();
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;
    const eventListener = (event) => {
      if (savedHandler.current) savedHandler.current(event);
    };
    element.addEventListener(eventName, eventListener, passiveDto);
    // eslint-disable-next-line consistent-return
    return () => element.removeEventListener(eventName, eventListener);
  }, [eventName, element, passiveDto]);
}
export { useEventListener };
