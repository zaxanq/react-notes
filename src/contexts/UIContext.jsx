import React, { useCallback, useContext, useEffect, useState } from 'react';
import { DataContext } from '.';

const UIContext = React.createContext(null);

const UiProvider = ({ children }) => {
    const { Provider } = UIContext;
    const { update } = useContext(DataContext);

    const [sidebarOpened, setSidebarOpened] = useState(false);
    const [shortcutsAllowed, setShortcutsAllowed] = useState(false);

    const [currentCategory, setCurrentCategory] = useState(0);
    const [deletedCategory, setDeletedCategory] = useState(null);

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
    const [notesDeleteMode, setNotesDeleteMode] = useState(false);

    const [activeNotes, setActiveNotes] = useState([]);

    const snackbarDuration = 12000;
    const snackbarAnimationsDuration = 300;
    const snackbarVisibleDuration = snackbarDuration - snackbarAnimationsDuration;

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
        }, snackbarAnimationsDuration);
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
        setActiveNotes([selectedNote.id]);
        setSelectedNote(null);

        return update.note(selectedNote);
    };

    const restoreCategory = () => {
        deletedCategory.deleted = false;
        setCurrentCategory(deletedCategory.id);
        setDeletedCategory(null);

        return update.category(deletedCategory);
    };

    useEffect(() => {
        setNotesDeleteMode(false);
    }, [currentCategory]);

    useEffect(() => { // hide snackbar automatically after a delay
        if (snackbarVisible) setSnackbarTimeout(
            setTimeout(() => clearSnackbar(), snackbarVisibleDuration)
        );
    }, [snackbarVisible, snackbarVisibleDuration]);

    return (
        <Provider value={{
            category: {
                current: currentCategory,
                setCurrent: setCurrentCategory,
                deleted: deletedCategory,
                setDeleted: setDeletedCategory,
                restore: restoreCategory,
            },
            shortcuts: {
                allowed: shortcutsAllowed,
                setAllowed: setShortcutsAllowed,
            },
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
                visibleTime: snackbarVisibleDuration,
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
            },
            note: {
                active: activeNotes,
                setActive: setActiveNotes,
                deleteMode: notesDeleteMode,
                setDeleteMode: setNotesDeleteMode,
            }
        }}>
            { children }
        </Provider>
    );
};

export { UiProvider };
export default UIContext;
