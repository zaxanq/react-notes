import React, { useCallback, useContext, useEffect } from 'react';
import Sidebar from '../Sidebar';
import Container from '../Container';
import { UIContext } from '../../contexts';

const Shell = () => {
    const { category, shortcuts, singleNote, dialog, sidebar, confirmDialog, snackbar } = useContext(UIContext);

    const handleKeyPressed = useCallback((e) => {
        if (shortcuts.allowed) {
            if (dialog.visible) { // if AddNoteDialog visible
                if (e.key === 'Escape') dialog.setVisible(false); // Esc = close
                else if (e.key === 'Enter') document.querySelector('.add-note-dialog__submit-button').click(); // Enter = add note
            } else if (confirmDialog.visible) { // if ConfirmDialog visible
                if (e.key === 'Escape') confirmDialog.clear(); // Esc = close
                else if (e.key === 'Enter') { // if Enter & not pressed "Cancel" button = Confirm
                    if (e.target !== document.querySelector('.confirm-dialog__cancel-button')) confirmDialog.setResult(true);
                    confirmDialog.close();
                }
            } else if (singleNote.visible) { // if Note opened
                if (e.key === 'Escape') singleNote.clear(); // Esc = close
                else if (e.key === 'Delete') document.querySelector('.single-note__button--delete').click(); // Del = delete
                else if (e.key === 'e') document.querySelector('.single-note__button--edit').click(); // E = edit
            } else { // if no modal is visible
                if (e.key === 'n') dialog.setVisible(true); // N = new note (open dialog)
                else if (e.key === 'c') { // C = new category
                    sidebar.setOpened(true); // for that open the sidebar
                    document.querySelector('.add-category').click();
                }
                else if (e.key === 's') { // S = toggle sidebar
                    sidebar.setOpened(!sidebar.opened);
                }
                else if (e.key === 'Escape' && sidebar.opened) sidebar.setOpened(false);
                else if (parseInt(e.key) >= 0) { // if key is a "n" digit, open nth category (if it exists)
                    const selectedCategory = document.querySelectorAll('.category')[e.key];
                    if (selectedCategory) selectedCategory.click();
                }
                else if (snackbar.visible) { // snackbar
                    const snackbarButton = document.querySelector('.snackbar__control');
                    if (e.key === 'Escape') snackbar.clear(); // Esc = clear
                    else if (snackbarButton && e.key === 'Backspace') { // if restore button & Backspace = restore
                        e.preventDefault(); // prevent browser to go back to "previous page" in its history
                        snackbarButton.click();
                    }
                }
            }
        }
    }, [shortcuts, singleNote, dialog, sidebar, confirmDialog, snackbar]);

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
