import React, {useContext, useState} from 'react';
import './UpdateNoteDialog.scss';
import {DialogContext, NotesContext, SnackbarContext} from '../../../../contexts';
import Lang from '../../../../assets/i18n';
import DialogType from '../../../Shell/enums/DialogType.enum';
import CategoriesContext from '../../../../contexts/CategoriesContext';
import Button from '../../../Shell/components/Button/Button';
import HttpClient, { Api } from '../../../../services/HttpClient';

const renderDialog = (dialogType, categories, closeDialog, showSnackbar) => {
    /*
        dialogType: DialogType - should the dialog be rendered to add a new note or to edit an existing one
        categories: Category[] - list of categories taken from CategoriesContext
        closeDialog: function - callback on when the dialog is closed, can provide data from the dialog
     */
    const slicedCategories = categories.slice(1, categories.length); // remove "All" category
    const categoryCheckboxes = slicedCategories.map( // map each category into checkbox
        (category) => (
            <div key={ category.id }>
                <input type="checkbox" className="input input--checkbox" id={ category.name } value={ category.name } />
                <label htmlFor={ category.name }>{ category.name }</label>
            </div>
        )
    );

    const handleSubmit = (e) => {
        e.preventDefault();

        const title = document.getElementById('noteTitle').value;
        const contents = document.getElementById('noteContents').value;

        if (!title && !contents) {
            closeDialog(false);
            showSnackbar(Lang.snackbar.noteNotAdded, 'warning');
            return;
        }

        const data = { // collect data from the inputs
            title,
            contents,
            includedIn: [0, ...slicedCategories // add 0th category, as all notes should be included in it
                .filter((category) => document.getElementById(category.name).checked)
                .map(category => category.id)]
        };
        closeDialog(true, data); // return submitted=true & form data
    };

    return (
        <div
            className={ 'dialog-container' }
            onClick={ () => closeDialog(false) } // return submitted=false and close the dialog
        >
            <div
                className="dialog update-note-dialog"
                onClick={ (e) => e.stopPropagation() }
            >
                <h3 className="title--with-underline dialog__title">
                    { dialogType === DialogType.addNote ? Lang.common.addNote : Lang.common.editNote }
                </h3>
                <form onSubmit={ (e) => handleSubmit(e) }>
                    <div className="dialog__form-row">
                        <label className="h3" htmlFor="noteTitle">{ Lang.note.title }</label>
                        <input type="text" id="noteTitle" className="input input--text dialog__input"/>
                    </div>
                    <div className="dialog__form-row">
                        <label className="h3" htmlFor="noteContents">{ Lang.note.contents }</label>
                        <textarea id="noteContents" className="input input--textarea dialog__input"/>
                    </div>
                    <div className="dialog__form-row">
                        <h3>{ Lang.note.categories }</h3>
                        <div className="update-note-dialog__categories-group">
                            { categoryCheckboxes }
                        </div>
                    </div>
                    <Button
                            type="submit"
                            style="stretched"
                            className="button input input--button"
                        >{ Lang.common.addNote }
                    </Button>
                </form>
            </div>
        </div>
    );
};

const UpdateNoteDialog = ({ dialogType }) => {
    const { visible, setVisible } = useContext(DialogContext);
    const { visibleSnackbar, setVisibleSnackbar, setSnackbarContent } = useContext(SnackbarContext);
    const { notes, setNotes } = useContext(NotesContext);
    const categories = useContext(CategoriesContext);

    const closeDialog = (submitted, formData) => {
        setVisible(!visible);
        if (submitted) { // if dialog form was submitted, use form data
            const highestId = parseInt(notes.map((note) => note.id)[notes.length - 1]) + 1; // get next id number

            const newNote = { // create new note object
                id: highestId,
                ...formData
            };

            (new HttpClient()).post( // send request to add new note
                Api.Notes,
                newNote
            ).then(() => setNotes([...notes, newNote])); // add new note to local state as well
        }
    };

    const showSnackbar = (text, type) => {
        setVisibleSnackbar(true);
        setSnackbarContent({ text, type });
    };

    return visible ? renderDialog(dialogType, categories, closeDialog, showSnackbar) : '';
};

export default UpdateNoteDialog;
