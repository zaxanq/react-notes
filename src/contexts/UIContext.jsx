import React, { useEffect, useState } from 'react';

const UIContext = React.createContext(null);

const UiProvider = ({ children }) => {
    const { Provider } = UIContext;

    const [sidebarOpened, setSidebarOpened] = useState(false);
    const [visibleDialog, setVisibleDialog] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarContent, setSnackbarContent] = useState({ type: '', text: '' });
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [confirmDialogContent, setConfirmDialogContent] = useState(null);
    const [confirmDialogResult, setConfirmDialogResult] = useState(null);
    const [confirmDialogData, setConfirmDialogData] = useState(null);

    const showConfirmDialog = (content) => {
        setConfirmDialogVisible(true);
        setConfirmDialogContent(content);
    };

    const clearConfirmDialog = () => {
        closeConfirmDialog();
        setConfirmDialogResult(null);
        setConfirmDialogData(null);
    };

    const closeConfirmDialog = () => {
        setConfirmDialogVisible(false);
        setConfirmDialogContent(null);
    };

    const clearSnackbar = () => {
        setSnackbarVisible(false);
        setSnackbarContent({ type: '', text: ''});
    };

    const showSnackbar = (text, type) => {
        setSnackbarVisible(true);
        setSnackbarContent({ type, text });
    };

    useEffect(() => { // hide snackbar automatically after a delay
        if (snackbarVisible) setTimeout(() => clearSnackbar(), 8000);
    }, [snackbarVisible]);

    return (
        <Provider value={{
            confirmDialog: {
                visible: confirmDialogVisible,
                content: confirmDialogContent,
                result: confirmDialogResult,
                setResult: setConfirmDialogResult,
                data: confirmDialogData,
                setData: setConfirmDialogData,
                show: showConfirmDialog,
                close: closeConfirmDialog,
                clear: clearConfirmDialog,
            },
            sidebar: {
                opened: sidebarOpened,
                setOpened: setSidebarOpened,
            },
            snackbar: {
                visible: snackbarVisible,
                content: snackbarContent,
                clear: clearSnackbar,
                show: showSnackbar,
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
