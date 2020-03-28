import React, { createRef, useContext, useEffect, useState } from 'react';
import './Note.scss';
import { UIContext } from '../../contexts';
import Lang from "../../assets/i18n/en";

const Note = ({ data }) => {
    const contentLengthToDisplay = 255;
    const { singleNote, notes } = useContext(UIContext);

    const noteContentRef = createRef();

    const [noteTooHigh, setNoteTooHigh] = useState(false);
    const noteWithLongContent = data.content.length > contentLengthToDisplay;

    useEffect(() => {
        if (noteContentRef.current) setNoteTooHigh(noteContentRef.current.offsetHeight > 324);
    }, [noteContentRef]);

    //TODO: Find a way to animate Note removal from DOM

    const content = data.content.length > 0 ?
        data.content :
        <span className="italic note__no-content">No contents.</span>;

    const shortContent = noteWithLongContent ? data.content.substr(0, contentLengthToDisplay) + '...' : content;

    const setActiveNote = (e) => {
        e.stopPropagation();
        notes.setActive(data.id);
    };

    const onNoteClick = (e) => {
        setActiveNote(e);
        singleNote.setSelected(data);
        singleNote.setVisible(true);
    };

    return (
        <article
            className={ 'note' + (notes.active === data.id ? ' selected-note' : '') }
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
            { noteWithLongContent || noteTooHigh ?
                <p onClick={ (e) => onNoteClick(e) } className="note__view-note">{ Lang.note.viewNoteToSeeWhole }</p> :
                ''
            }
        </article>
    );
};

export default Note;
