import React, {useContext, useEffect, useState} from 'react';
import './NotesList.scss';
import { DataContext } from '../../contexts';
import Note from '../Note';
import Lang from '../../assets/i18n/';

const NotesList = ({ cId }) => {
    const { notes } = useContext(DataContext);
    const [notesToDisplay, setNotesToDisplay] = useState([]);

    useEffect(() => {
        if (notes && typeof cId !== 'undefined') { // if notes are received
            setNotesToDisplay(notes
                .filter((note) => note.includedIn.includes(cId)) // filter notes included in cId
                .map((note) => <Note data={ note } key={ note.id } />) // and map them as Note component
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
