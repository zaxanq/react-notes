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

const Container = () => {
    const { dialog, note, category } = useContext(UIContext);
    const { notes, setNotes, categories, update } = useContext(DataContext);
    const [categoryTitle, setCategoryTitle] = useState('');
    const [displayedCategory, setDisplayedCategory] = useState(null);
    const [displayedNotes, setDisplayedNotes] = useState(null);
    const [selectedAll, setSelectedAll] = useState(false);
    const cId = category.current;

    useEffect(() => {
        if (note.active && displayedNotes) {
            if (note.active.length === displayedNotes.length)
                setSelectedAll(true); // if all notes selected by hand, selectedAll = true
            else if (note.active.length === 0)
                setSelectedAll(false); // if all notes deselected by hand, selectedAll = false
        }
    }, [note.active, displayedNotes]);

    useEffect(() => {
        if (displayedCategory && notes.length) // change array of note Ids into not deleted notes list
            setDisplayedNotes(displayedCategory.notes.map((noteId) => notes[noteId]).filter((note) => !note.deleted));
    }, [categories, displayedCategory, notes]);

    useEffect(() => { // select/deselect all notes on selectAll change
        displayedCategory && selectedAll ? note.setActive(displayedNotes.map((note) => note.id)) : note.setActive([]);
    }, [selectedAll]);

    useEffect(() => { // clear selection on cancel if there was more than 2 selected notes
        if (!note.deleteMode && note.active.length !== 1) note.setActive([]);
    }, [note.deleteMode]);

    useEffect(() => { // find current category
        if (categories) setDisplayedCategory([...categories.filter((category) => category.id === cId)][0]);
    }, [categories, cId]);

    useEffect(() => { // set category header
        if (displayedCategory) {
            setCategoryTitle(cId !== 0 ?
                <React.Fragment>
                    { displayedCategory.name }
                    { displayedCategory.name.toLowerCase().includes('category') ?
                        '' : <span className="container__category-text"> { Lang.common.category }</span>
                    }
                </React.Fragment> :
                displayedCategory.name
            );
        }
    }, [displayedCategory, categories, cId]);

    const onContainerClick = () => { // deactivate note on background click if not in deleteMode
        if (!note.deleteMode) note.setActive([]);
    };

    const onAddNoteClick = (e) => {
        e.stopPropagation();
        dialog.setVisible(true);
    };

    const onDeleteNotesClick = (e) => {
        e.stopPropagation();
        note.setDeleteMode(!note.deleteMode); // toggle deleteMode
    };

    const onConfirmDeletingClick = (e) => {
        e.stopPropagation();
        if (note.active.length === 1) { // if single note selected, filter it out and update
            const updatedNote = notes.filter((_note) => _note.id === note.active[0])[0];
            updatedNote.deleted = true;
            update.note(updatedNote).then(() => note.setDeleteMode(false));
        } else if (note.active.length >= 2) { // else check all notes for changes
            const updatedNotes = notes.map((_note) => {
                if (note.active.includes(_note.id)) {
                    _note.deleted = true;
                    update.note(_note); // each note updated separately is not too optimized, but let it be for now
                }
                return _note;
            });
            setNotes(updatedNotes);
            note.setDeleteMode(false);
        } else note.setDeleteMode(false); // if no notes selected on delete confirmation
    };

    const onRemoveFromCategoryClick = (e) => {
        e.stopPropagation();
        let updatedCategory = displayedCategory; // remove all active notes from current category "notes" array
        updatedCategory.notes = updatedCategory.notes.filter((noteId) => !note.active.includes(noteId));
        update.category(updatedCategory).then(() => note.setDeleteMode(false));
    };

    const onSelectAllClick = (e) => {
        e.stopPropagation();
        setSelectedAll(!selectedAll);
    };

    return (
        <main
            className="container"
            onClick={ () => onContainerClick() }
        >
            <h2>{ categoryTitle }</h2>
            <div className="container__controls">
                <Button
                    type="button"
                    buttonStyle="outlined main"
                    className="add-note-button"
                    onClick={ (e) => onAddNoteClick(e) }
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
                { note.deleteMode && cId ? // if not "All" category
                    <Button
                        type="button"
                        buttonStyle="outlined main"
                        className="remove-from-category-button"
                        onClick={ (e) => onRemoveFromCategoryClick(e) }
                    >
                        { Lang.common.removeFromCategory }
                    </Button> : ''
                }
                { note.deleteMode ?
                    <Button
                        type="button"
                        buttonStyle="outlined main"
                        className="select-all-button"
                        onClick={ (e) => onSelectAllClick(e) }
                    >
                        { selectedAll ? Lang.common.deselectAll : Lang.common.selectAll }
                    </Button> : ''
                }
            </div>
            <NotesList displayedNotes={ displayedNotes } />
            <SingleNote />
            <AddNoteDialog displayedCategoryId={ cId } />
            <ConfirmDialog />
            <Snackbar />
        </main>
    );
};

export default Container;
