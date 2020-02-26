import React from 'react';
import './Container.scss';
import NotesList from '../NotesList';

const Container = ({ categoryId }) => {
    return (
        <main className="container">
           <NotesList categoryId={ categoryId ? categoryId : 0 } />
        </main>
    );
};

export default Container;
