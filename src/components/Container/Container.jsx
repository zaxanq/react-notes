import React from 'react';
import './Container.scss';
import NotesList from '../NotesList';

const Container = ({ categoryId }) => {
    return (
        <main className="container">
           <NotesList categoryId={ categoryId } />
        </main>
    );
};

export default Container;
