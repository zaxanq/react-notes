import React, { useCallback, useContext, useEffect } from 'react';
import Sidebar from '../Sidebar';
import Container from '../Container';
import { UIContext } from '../../contexts';

const Shell = () => {
    const { category, shortcuts, singleNote, dialog, sidebar, confirmDialog, snackbar } = useContext(UIContext);

    const handleKeyPressed = useCallback((e) => {
        if (shortcuts.allowed) {
            if (dialog.visible) {
                if (e.key === 'Escape') dialog.setVisible(false);
                else if (e.key === 'Enter') document.querySelector('.add-note-dialog__submit-button').click();
            } else if (confirmDialog.visible) {
                if (e.key === 'Escape') confirmDialog.clear();
                else if (e.key === 'Enter') {
                    confirmDialog.setResult(true);
                    confirmDialog.close();
                }
            } else if (singleNote.visible) {
                if (e.key === 'Escape') singleNote.clear();
                else if (e.key === 'Delete') document.querySelector('.single-note__button--delete').click();
                else if (e.key === 'e') document.querySelector('.single-note__button--edit').click();
            } if (snackbar.visible) {
                const snackbarButton = document.querySelector('.snackbar__control');
                if (e.key === 'Escape') snackbar.clear();
                else if (snackbarButton && e.key === 'Backspace') {
                    e.preventDefault();
                    snackbarButton.click();
                }

            } else {
                if (e.key === 'n') dialog.setVisible(true); // show new note dialog
                else if (e.key === 'c') { // create new category
                    sidebar.setOpened(true);
                    document.querySelector('.add-category').click();
                }
                else if (parseInt(e.key) >= 0) { // if key is a "n" digit, open nth category (if it exists)
                    const selectedCategory = document.querySelectorAll('.category')[e.key];
                    if (selectedCategory) selectedCategory.click();
                }
            }
            console.log(e.key);
        }
    }, [shortcuts, singleNote, dialog, sidebar, confirmDialog]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPressed);
        return () => document.removeEventListener('keydown', handleKeyPressed);
    }, [handleKeyPressed]);

    return (
        <React.Fragment>
            <Sidebar onCategoryClick={ (id) => category.setCurrent(id) } />
            <Container cId={ category.current } />
        </React.Fragment>
    );
};

export default Shell;
