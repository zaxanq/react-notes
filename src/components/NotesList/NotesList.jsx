import React, {useContext, useEffect, useState} from 'react';
import './NotesList.scss';
import NotesContext from '../../contexts';
import Note from '../Note';

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

    return (
        <div className="notes-list">
            { notesToDisplay }
        </div>
    );
};

export default NotesList;
