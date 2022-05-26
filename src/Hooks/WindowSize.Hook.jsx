import { useScreen } from './Screen.Hook';

export function useWindowSize() {
    const screen = useScreen();
    return {
        width: screen.width || 0,
        height: screen.height || 0,
    };
}
