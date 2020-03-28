import React, { useContext } from 'react';
import './AddNoteDialog.scss';
import { DataContext, UIContext } from '../../../../contexts';
import Button from '../../../Shell/components/Button/Button';
import CategoryCheckboxes from '../../../Shell/components/CategoryCheckboxes';
import Lang from '../../../../assets/i18n';
import HttpClient, { Api } from "../../../../services/HttpClient";

const AddNoteDialog = ({ displayedCategoryId }) => {
    const { dialog, snackbar } = useContext(UIContext);
    const { categories, setCategories, notes, setNotes, data, update } = useContext(DataContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        const title = document.getElementById('noteTitle').value;
        const content = document.getElementById('noteContent').value;

        if (!title.trim() && !content.trim()) { // if title and content are empty
            closeDialog(false); // close the dialog without any actions
            snackbar.show(Lang.snackbar.noteNotAdded, 'warning'); // and display warning snackbar
            return;
        }

        closeDialog(true, { title, content }); // otherwise return form data
    };

    const closeDialog = (submitted, formData) => {
        /* closes dialog and if dialog form was submitted, creates new note and updates categories */
        if (submitted) { // if dialog form was submitted, use form data
            const newNote = { // create new note object
                id: data.getNextId(notes),
                ...formData,
                deleted: false,
            };

            (new HttpClient()).post(
                Api.Notes,
                newNote,
            ).then(() => {
                /* It is crucial to first update notes and then categories, because NotesList useEffect update changes
                    whenever either categories, notes or cId changes, meaning if we first change categories then new note
                    is not yet in local notes state and that will mean an error.
                */
                setNotes([...notes, newNote]);

                let updatedCategories = categories.slice(1, categories.length); // copy categories & remove root category 'All'
                const pushNoteToCategoryAndUpdateCategory = (category) => {
                    /* helper method used to update categories */
                    category.notes.push(newNote.id);

                    update.category(category, false);
                };

                pushNoteToCategoryAndUpdateCategory(categories[0]); // update root category
                updatedCategories = updatedCategories.map(category => {
                    if (!category.deleted && document.getElementById(`category-checkbox-${ category.id }`).checked) { // if this category was selected
                        pushNoteToCategoryAndUpdateCategory(category); // update this category
                    }
                    return category; // whether updated or not, map category to category
                });

                updatedCategories.unshift(categories[0]); // add root category back
                setCategories(updatedCategories); // update local categories state
                dialog.setVisible(!dialog.visible); // only then hide the dialog
            }); // add new note to local state
        } else dialog.setVisible(!dialog.visible); // if not submitted, hide the dialog immediately
    };

    const renderDialog = () => (
        <div
            className="absolute-container dialog-container"
            onDoubleClick={ () => closeDialog(false) }
        >
            <div
                className="dialog add-note-dialog"
                onDoubleClick={ (e) => e.stopPropagation() }
            >
                <h2 className="title--with-underline dialog__title">
                    { Lang.common.addNote }
                </h2>
                <form onSubmit={ (e) => handleSubmit(e) }>
                    <div className="dialog__form-row">
                        <label className="h3" htmlFor="noteTitle">{ Lang.note.title }</label>
                        <input type="text" id="noteTitle" className="input input--text dialog__input"/>
                    </div>
                    <div className="dialog__form-row">
                        <label className="h3" htmlFor="noteContent">{ Lang.note.content }</label>
                        <textarea id="noteContent" className="input input--textarea dialog__input"/>
                    </div>
                    <div className="dialog__form-row">
                        <h3>{ Lang.note.categories }</h3>
                        <div className="add-note-dialog__categories-group">
                            <CategoryCheckboxes currentCategoryId={ displayedCategoryId } />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        buttonStyle="stretched submit"
                        className="button input input--button"
                    >{ Lang.common.addNote }
                    </Button>
                </form>
            </div>
        </div>
    );

    return dialog.visible ? renderDialog() : '';
};

export default AddNoteDialog;
