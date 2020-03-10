import React, { useContext } from 'react';
import './UpdateNoteDialog.scss';
import { DataContext, UIContext } from '../../../../contexts';
import Button from '../../../Shell/components/Button/Button';
import HttpClient, { Api } from '../../../../services/HttpClient';
import Lang from '../../../../assets/i18n';
import DialogType from '../../../Shell/enums/DialogType.enum';

const UpdateNoteDialog = ({ dialogType }) => {
    const { dialog, snackbar, common } = useContext(UIContext);
    const { categories, setCategories, notes, setNotes, data } = useContext(DataContext);

    const handleSubmit = (e) => {
        /* on form submit */
        e.preventDefault();
        const title = document.getElementById('noteTitle').value;
        const contents = document.getElementById('noteContents').value;

        if (!title.trim() && !contents.trim()) { // if title and contents are empty
            closeDialog(false); // close the dialog without any actions
            snackbar.show(Lang.snackbar.noteNotAdded, 'warning'); // and display warning snackbar
            return;
        }

        closeDialog(true, { title, contents }); // otherwise return form data
    };
    const closeDialog = (submitted, formData) => {
        /* closes dialog and if dialog form was submitted, creates new note and updates categories */
        dialog.setVisible(!dialog.visible);
        if (submitted) { // if dialog form was submitted, use form data
            const newNote = { // create new note object
                id: data.getNextId(notes),
                ...formData,
            };

            const pushNoteToCategoryAndUpdateCategory = (category) => {
                /* helper method used to update categories */
                category.notes.push(newNote.id);

                (new HttpClient()).put( // send request to update category
                    `${Api.Categories}/${category.id}`,
                    category
                );
            };

            let updatedCategories = categories.slice(1, categories.length); // copy categories & remove root category 'All'
            updatedCategories = updatedCategories.map(category => {
                if (document.getElementById(`category-checkbox-${ category.id }`).checked) { // if this category was selected
                    pushNoteToCategoryAndUpdateCategory(category); // update this category
                }
                return category; // whether updated or not, map category to category
            });

            updatedCategories.unshift(categories[0]); // add root category back
            pushNoteToCategoryAndUpdateCategory(categories[0]); // update root category
            setCategories(updatedCategories); // update local categories state

            (new HttpClient()).post( // send request to add new note
                Api.Notes,
                newNote
            ).then(() => setNotes([...notes, newNote])); // add new note to local state
        }
    };

    const renderDialog = () => {
        if (!common.categoryCheckboxes) common.getCategoryCheckboxes();

        return (
            <div
                className="absolute-container dialog-container"
                onClick={ () => closeDialog(false) }
            >
                <div
                    className="dialog update-note-dialog"
                    onClick={ (e) => e.stopPropagation() }
                >
                    <h2 className="title--with-underline dialog__title">
                        { dialogType === DialogType.addNote ? Lang.common.addNote : Lang.common.editNote }
                    </h2>
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
                                { common.categoryCheckboxes }
                            </div>
                        </div>
                        <Button
                            type="submit"
                            buttonStyle="stretched"
                            className="button input input--button"
                        >{ Lang.common.addNote }
                        </Button>
                    </form>
                </div>
            </div>
        );
    };

    return dialog.visible ? renderDialog() : '';
};

export default UpdateNoteDialog;
