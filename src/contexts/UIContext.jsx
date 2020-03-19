import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '.';

const UIContext = React.createContext(null);

const UiProvider = ({ children }) => {
    const { Provider } = UIContext;
    const { update } = useContext(DataContext);

    const [sidebarOpened, setSidebarOpened] = useState(false);

    const [dialogVisible, setDialogVisible] = useState(false);

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarContent, setSnackbarContent] = useState({ type: '', text: '' });
    const [snackbarTimeout, setSnackbarTimeout] = useState(null);

    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [confirmDialogContent, setConfirmDialogContent] = useState(null);
    const [confirmDialogResult, setConfirmDialogResult] = useState(null);
    const [confirmDialogData, setConfirmDialogData] = useState(null);

    const [visibleSingleNote, setVisibleSingleNote] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);

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
        /*
            ClearTimeout is important to assure that if we show 2 snackbars during the timeout, they will be visible
            for established period of time. In other words, if we set hide timeout to 12 seconds:
            If a snackbar is shown, and then hidden after 2 seconds, and then shown again after 6 seconds,
            without useState and clearTimeout the second snackbar would hide after 4 seconds.
            TODO: Find out why it works and if it should be improved.
        */
        document.querySelector('.snackbar').classList.add('change');
        setTimeout(() => document.querySelector('.snackbar').classList.add('hide'), 0);
        setTimeout(() => {
            setSnackbarVisible(false);
            setSnackbarContent({ type: '', text: ''});
            setSnackbarTimeout(clearTimeout(snackbarTimeout));
        }, 300);
    };

    const showSnackbar = (text, type) => {
        setSnackbarVisible(true);
        setSnackbarContent({ type, text });
    };

    const clearSelectedNote = () => {
        setSelectedNote(null);
        setVisibleSingleNote(false);
    };

    const singleNoteRestoreNote = () => {
        selectedNote.deleted = false;
        setSelectedNote(null);

        return update.note(selectedNote);
    };

    useEffect(() => { // hide snackbar automatically after a delay
        if (snackbarVisible) setSnackbarTimeout(setTimeout(() => clearSnackbar(), 11700));
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
                visible: dialogVisible,
                setVisible: setDialogVisible,
            },
            singleNote: {
                visible: visibleSingleNote,
                setVisible: setVisibleSingleNote,
                selected: selectedNote,
                setSelected: setSelectedNote,
                clear: clearSelectedNote,
                restoreNote: singleNoteRestoreNote,
            }
        }}>
            { children }
        </Provider>
    );
};

export { UiProvider };
export default UIContext;
