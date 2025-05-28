import { createTheme, Toast, ToastToggle } from 'flowbite-react';
import { createContext, useContext, useState, useCallback } from 'react';
import { HiCheck } from 'react-icons/hi';

const NotificationContext = createContext();

const toastThemeWithAbsolutePositioning = createTheme({
    toast: {
        root: {
            base: 'absolute top-2 right-2 flex w-full max-w-xs items-center rounded-lg bg-white p-4 text-gray-500 shadow dark:bg-gray-800 dark:text-gray-400',
            closed: 'opacity-0 ease-out',
        },
        toggle: {
            base: '-m-1.5 ml-auto inline-flex h-8 w-8 rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white',
            icon: 'h-5 w-5 shrink-0',
        },
    },
});

export function NotificationProvider({ children }) {
    const [message, setMessage] = useState(null);

    const showNotification = useCallback((text, timeout = 2000) => {
        setMessage(text);
        setTimeout(() => setMessage(null), timeout);
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification }}>

            {children}

            {message && (
                <Toast theme={toastThemeWithAbsolutePositioning.toast}>
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                        <HiCheck className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm font-normal">{message}</div>
                    <ToastToggle />
                </Toast>
            )}

        </NotificationContext.Provider>
    );
}

export function useNotification() {
    return useContext(NotificationContext);
}
