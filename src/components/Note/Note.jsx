import React, {useContext} from 'react';
import './Note.scss';
import NotesContext from '../../contexts';

const Note = ({ id }) => {
    const noteContentLengthToDisplay = 255;
    const notes = useContext(NotesContext);
    const shortenedNoteContent = notes[id].contents.substr(0, noteContentLengthToDisplay) + '...';

    return (
        <article className="note">
            <h3 className="note__title">{ notes[id].title }</h3>
            <p className="note__contents">{ shortenedNoteContent }</p>
        </article>
    );
};

export default Note;
