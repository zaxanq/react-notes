import React, { createRef, useContext, useEffect, useState } from 'react';
import './Note.scss';
import { UIContext } from '../../contexts';
import Lang from '../../assets/i18n/en';

const Note = ({ data }) => {
    const contentLengthToDisplay = 255;
    const { singleNote, note } = useContext(UIContext);

    const noteContentRef = createRef();

    const [noteTooHigh, setNoteTooHigh] = useState(false);
    const [contentTooLong, setContentTooLong] = useState(false);
    const [content, setContent] = useState(null);

    useEffect(() => {
        setContent(data.content.length > 0 ?
            data.content :
            <span className="italic note__no-content">No contents.</span>
        );
        setContentTooLong(data.content.length > contentLengthToDisplay);
    }, [data.content]);

    useEffect(() => {
        if (noteContentRef.current) setNoteTooHigh(noteContentRef.current.offsetHeight > 324);
    }, [noteContentRef]);

    //TODO: Find a way to animate Note removal from DOM

    const shortContent = contentTooLong ? data.content.substr(0, contentLengthToDisplay) + '...' : content;

    const setActiveNote = (e) => {
        e.stopPropagation();
        if (!note.deleteMode) note.setActive([data.id]);
        else {
            if (note.active.includes(data.id)) note.setActive(note.active.filter((noteId) => noteId !== data.id));
            else note.setActive([...note.active, data.id]);
        }
    };

    const onNoteClick = (e) => {
        if (!note.deleteMode) {
            setActiveNote(e);
            singleNote.setSelected(data);
            singleNote.setVisible(true);
        }
    };

    return (
        <article
            className={ 'note' + (note.deleteMode ? ' note--delete-mode' : '') + (note.active.includes(data.id) ? ' selected-note' : '') }
            onClick={ (e) => setActiveNote(e) }
            onDoubleClick={ (e) => onNoteClick(e) }
            id={ 'note-' + (data.id) }
        >
            <h3
                className="title--with-underline note__title"
                onClick={ (e) => onNoteClick(e) }
            >{ data.title }</h3>
            <p
                className="note__content"
                ref={ noteContentRef }
            >{ shortContent }</p>
            { contentTooLong || noteTooHigh ?
                <p onClick={ (e) => onNoteClick(e) }
                   className="note__view-note">{ Lang.note.viewNoteToSeeWhole }</p> :
                ''
            }
        </article>
    );
};

export default Note;
