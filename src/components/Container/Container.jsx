import React from 'react';
import './Container.scss';
import Note from '../Note';

const Container = ({ noteId }) => {
    const selectNoteItem = (
        <span className="container__instruction">No note selected. Please select a note from the sidebar or create new.</span>
    );

    return (
        <main className="container">
            { noteId ? <Note id={ noteId } /> : selectNoteItem }
        </main>
    );
};

export default Container;
