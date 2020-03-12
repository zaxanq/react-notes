import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from './index';

const UIContext = React.createContext(null);

const UiProvider = ({ children }) => {
    const { Provider } = UIContext;

    const [sidebarOpened, setSidebarOpened] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogType, setDialogType] = useState(null);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarContent, setSnackbarContent] = useState({ type: '', text: '' });
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [confirmDialogContent, setConfirmDialogContent] = useState(null);
    const [confirmDialogResult, setConfirmDialogResult] = useState(null);
    const [confirmDialogData, setConfirmDialogData] = useState(null);
    const [visibleSingleNote, setVisibleSingleNote] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [categoryCheckboxes, setCategoryCheckboxes] = useState(null);
    const { categories } = useContext(DataContext);

    const getCategoryCheckboxes = () => {
        setCategoryCheckboxes(categories.slice(1, categories.length).map( // map each category into checkbox
            (category) => (
                <div key={ category.id }>
                    <input type="checkbox" className="input input--checkbox" id={ category.name } value={ category.name } />
                    <label htmlFor={ category.name }>{ category.name }</label>
                </div>
            )
        ));
    };

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

    const clearSelectedNote = () => {
        setSelectedNote(null);
        setVisibleSingleNote(false);
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
                visible: dialogVisible,
                setVisible: setDialogVisible,
                type: dialogType,
                setType: setDialogType,
            },
            singleNote: {
                visible: visibleSingleNote,
                setVisible: setVisibleSingleNote,
                selected: selectedNote,
                setSelected: setSelectedNote,
                clear: clearSelectedNote,
            }
        }}>
            { children }
        </Provider>
    );
};

export { UiProvider };
export default UIContext;
