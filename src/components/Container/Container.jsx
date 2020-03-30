import React, { useContext, useEffect, useState } from 'react';
import './Container.scss';
import { DataContext, UIContext } from '../../contexts';
import NotesList from '../NotesList';
import SingleNote from '../SingleNote';
import AddNoteDialog from './components/AddNoteDialog';
import ConfirmDialog from './components/ConfirmDialog';
import Snackbar from './components/Snackbar/Snackbar';
import Button from '../Shell/components/Button/Button';
import Lang from '../../assets/i18n';
import HttpClient, { Api } from "../../services/HttpClient";

const Container = () => {
    const { dialog, note, category } = useContext(UIContext);
    const { notes, setNotes, categories, update } = useContext(DataContext);
    const [categoryTitle, setCategoryTitle] = useState('');
    const [displayedCategory, setDisplayedCategory] = useState(null);
    const cId = category.current;

    useEffect(() => {
        if (!note.deleteMode && note.active.length !== 1) note.setActive([]);
    }, [note.deleteMode]);

    useEffect(() => { // find current category
        if (categories) setDisplayedCategory([...categories.filter((category) => category.id === cId)][0]);
    }, [categories, cId]);

    useEffect(() => { // set category header
        if (displayedCategory) {
            setCategoryTitle(cId !== 0 ?
                <React.Fragment><span className="container__category-text">Category:</span> { displayedCategory.name }</React.Fragment> :
                displayedCategory.name
            );
        }
    }, [displayedCategory, cId]);

    const onContainerClick = () => {
        if (!note.deleteMode) note.setActive([]);
    };

    const onAddNoteClick = () => {
        /*
            on add-note button click set dialog type and show dialog
         */
        dialog.setVisible(true);
    };

    const onDeleteNotesClick = (e) => {
        e.stopPropagation();
        note.setDeleteMode(!note.deleteMode);
    };

    const onConfirmDeletingClick = (e) => {
        e.stopPropagation();
        if (note.active.length === 1) {
            const updatedNote = notes.filter((_note) => _note.id === note.active[0])[0];
            updatedNote.deleted = true;
            update.note(updatedNote).then(() => note.setDeleteMode(false));
        } else if (note.active.length >= 2) {
            const updatedNotes = notes.map((_note) => {
                if (note.active.includes(_note.id)) {
                    _note.deleted = true;

                    update.note(_note); // each note updated separately is not too optimized, but let it be for now
                }
                return _note;
            });
            setNotes(updatedNotes);
            note.setDeleteMode(false);
        } else note.setDeleteMode(false);
    };

    const onRemoveFromCategoryClick = (e) => {
        e.stopPropagation();
    };

    return (
        <main
            className="container"
            onClick={ () => onContainerClick() }
        >
            <div className="container__topbar">
                <h2>{ categoryTitle }</h2>
                <Button
                    type="button"
                    buttonStyle="outlined main"
                    className="add-note-button"
                    onClick={ () => onAddNoteClick() }
                >
                    { Lang.common.addNote }
                </Button>
                <Button
                    type="button"
                    buttonStyle="outlined main"
                    className="delete-notes-button"
                    onClick={ (e) => onDeleteNotesClick(e) }
                >
                    { note.deleteMode ? Lang.common.cancel : Lang.common.deleteNotes }
                </Button>
                { note.deleteMode ?
                    <Button
                        type="button"
                        buttonStyle="outlined main"
                        className="confirm-deleting-button"
                        onClick={ (e) => onConfirmDeletingClick(e) }
                    >
                        { Lang.confirm.deleting }
                    </Button> : ''
                }
                { note.deleteMode && cId ? // cId !== 0
                    <Button
                        type="button"
                        buttonStyle="outlined main"
                        className="remove-from-category-button"
                        onClick={ (e) => onRemoveFromCategoryClick(e) }
                    >
                        { Lang.common.removeFromCategory }
                    </Button> : ''
                }
            </div>
            <NotesList cId={ cId } />
            <SingleNote />
            <AddNoteDialog displayedCategoryId={ cId } />
            <ConfirmDialog />
            <Snackbar />
        </main>
    );
};

export default Container;
