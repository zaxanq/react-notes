import React, {useContext} from 'react';
import './Note.scss';
import NotesContext from '../../contexts';

const Note = ({ id }) => {
    const notes = useContext(NotesContext);

    return (
        <article className="note">
            <h3 className="note__title">{ notes[id].title }</h3>
            <p className="note__contents">{ notes[id].contents }</p>
        </article>
    );
};

export default Note;
