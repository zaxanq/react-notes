import React, {useEffect, useState} from 'react';

const UIContext = React.createContext(null);

const UiProvider = ({ children }) => {
    const [visibleDialog, setVisibleDialog] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarContent, setSnackbarContent] = useState({ type: '', text: '' });

    const { Provider } = UIContext;

    useEffect(() => {
        if (snackbarVisible) setTimeout(() => setSnackbarVisible(false), 10000);
    }, [snackbarVisible]);

    return (
        <Provider value={{
            visibleDialog, setVisibleDialog,
            snackbarVisible, setSnackbarVisible,
            snackbarContent, setSnackbarContent
        }}>
            { children }
        </Provider>
    );
};

export { UiProvider };
export default UIContext;
