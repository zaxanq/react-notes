import React from 'react';
import './Note.scss';

const Note = ({ data }) => {
    const noteContentLengthToDisplay = 255;

    const shortenedNoteContent = data.contents.length > noteContentLengthToDisplay
        ? data.contents.substr(0, noteContentLengthToDisplay) + '...'
        : data.contents;

    return (
        <article className="note">
            <h3 className="title--with-underline note__title">{ data.title }</h3>
            <p className="note__contents">{ shortenedNoteContent }</p>
        </article>
    );
};

export default Note;
