import React, {useContext} from 'react';
import './Note.scss';
import {UIContext} from "../../contexts";

const Note = ({ data }) => {
    const noteContentLengthToDisplay = 255;
    const { singleNote } = useContext(UIContext);

    const shortenedNoteContent = data.contents.length > noteContentLengthToDisplay
        ? data.contents.substr(0, noteContentLengthToDisplay) + '...'
        : data.contents;

    const onNoteClick = () => {
        singleNote.setSelected(data);
        singleNote.setVisible(true);
    };

    return (
        <article className={ 'note' + (singleNote?.selected?.id === data.id ? ' selected-note' : '') }>
            <h3
                className="title--with-underline note__title"
                onClick={ () => onNoteClick() }
            >{ data.title }</h3>
            <p className="note__contents">{ shortenedNoteContent }</p>
        </article>
    );
};

export default Note;
