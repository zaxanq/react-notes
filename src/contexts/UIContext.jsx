import React, {useEffect, useState} from 'react';

const UIContext = React.createContext(null);

const UiProvider = ({ children }) => {
    const [visibleDialog, setVisibleDialog] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarContent, setSnackbarContent] = useState({ type: '', text: '' });

    const clearSnackbar = () => {
        setSnackbarVisible(false);
        setSnackbarContent({ type: '', text: ''});
    };

    const { Provider } = UIContext;

    useEffect(() => {
        if (snackbarVisible) setTimeout(() => clearSnackbar(), 8000);
    }, [snackbarVisible]);

    return (
        <Provider value={{
            snackbar: {
                visible: snackbarVisible,
                setVisible: setSnackbarVisible,
                content: snackbarContent,
                setContent: setSnackbarContent,
                clear: clearSnackbar,
            },
            dialog: {
                visible: visibleDialog,
                setVisible: setVisibleDialog,
            }
        }}>
            { children }
        </Provider>
    );
};

export { UiProvider };
export default UIContext;
