import React from 'react';
import './Container.scss';
import Note from '../Note';

const Container = ({ noteId }) => {

    return (
        <main className="content">
            { noteId ? <Note id={ noteId} /> : <span>No notes</span> }
        </main>
    );
};

export default Container;
