import React, {useContext, useEffect, useState} from 'react';
import './NotesList.scss';
import NotesContext from '../../contexts';
import Note from '../Note';
import Lang from '../../assets/i18n/en';

const NotesList = ({ categoryId }) => {
    const notes = useContext(NotesContext);
    const [notesToDisplay, setNotesToDisplay] = useState([]);

    useEffect(() => {
        if (notes && typeof categoryId !== 'undefined') {
            setNotesToDisplay([...Object.values(notes)]
                .filter((note) => note.includedIn.includes(categoryId))
                .map((note) => <Note data={ note } key={ note.id } />)
            );
        }
    }, [notes, categoryId]);

    const notesList = notesToDisplay.length > 0 ?
        notesToDisplay : <p className="notification">{ Lang.notifications.noNotes }</p>;

    return (
        <div className="notes-list">
            { notesList }
        </div>
    );
};

export default NotesList;