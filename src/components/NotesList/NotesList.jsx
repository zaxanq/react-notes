import React, { useContext, useEffect, useState } from 'react';
import './NotesList.scss';
import { DataContext } from '../../contexts';
import Note from '../Note';
import Lang from '../../assets/i18n';

const NotesList = ({ cId }) => {
    const { notes, categories } = useContext(DataContext);
    const [notesToDisplay, setNotesToDisplay] = useState([]);

    useEffect(() => {
        if (categories.length !== 0 && notes.length !== 0 && typeof cId !== 'undefined') { // if categories are received
            setNotesToDisplay(categories[cId].notes
                .map((noteId) => <Note data={ notes.filter((note) => note.id === noteId)[0] } key={ noteId } />) // and map them as Note component
            );
        }
    }, [notes, cId]);

    const notesList = notesToDisplay.length > 0 ? // if notesToDisplay contain notes, display them
        notesToDisplay :
        <p className="notification">{ Lang.notifications.noNotes }</p>; // otherwise display notification

    return (
        <div className="notes-list">
            { notesList }
        </div>
    );
};

export default NotesList;
