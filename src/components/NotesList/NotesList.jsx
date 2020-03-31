import React, { useContext, useEffect, useState } from 'react';
import './NotesList.scss';
import { DataContext } from '../../contexts';
import Note from '../Note';
import Lang from '../../assets/i18n';

const NotesList = ({ displayedNotes }) => {
    const [notesList, setNotesList] = useState([]);
    const [view, setView] = useState(null);
    const { notes } = useContext(DataContext);

    useEffect(() => {
        if (displayedNotes) setNotesList(displayedNotes.map((note) => <Note data={ note } key={ note.id } />));
    }, [notes, displayedNotes]);

    useEffect(() => {
        setView(notesList.length ? notesList : <p className="notification">{ Lang.notifications.noNotes }</p>);
    }, [notesList]);

    return (
        <div className="notes-list">
            { view }
        </div>
    );
};

export default NotesList;
