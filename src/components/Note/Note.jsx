import React, { createRef, useContext, useEffect, useState } from 'react';
import './Note.scss';
import { UIContext } from '../../contexts';
import Lang from "../../assets/i18n/en";

const Note = ({ data }) => {
    const contentLengthToDisplay = 255;
    const { singleNote } = useContext(UIContext);

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

    const onNoteClick = () => {
        singleNote.setSelected(data);
        singleNote.setVisible(true);
    };

    return (
        <article
            className={ 'note' + (singleNote?.selected?.id === data.id ? ' selected-note' : '') }
            onDoubleClick={ () => onNoteClick() }
            id={ 'note-' + (data.id) }
        >
            <h3
                className="title--with-underline note__title"
                onClick={ () => onNoteClick() }
            >{ data.title }</h3>
            <p
                className="note__content"
                ref={ noteContentRef }
            >{ shortContent }</p>
            { noteWithLongContent || noteTooHigh ?
                <p onClick={ () => onNoteClick() } className="note__view-note">{ Lang.note.viewNoteToSeeWhole }</p> :
                ''
            }
        </article>
    );
};

export default Note;
