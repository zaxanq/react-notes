import React, { useContext } from 'react';
import './Sidebar.scss';
import SidebarNote from './components/SidebarNote';
import NotesContext from '../../contexts';

const renderSidebarNotes = (notes, clickedNote) => {
    const setClickedNote = id => {

    };

    return (
        <ul className="sidebar__notes-list notes-list">
            { notes.map(item => (
                <SidebarNote
                    title={ item.title }
                    key={ item.id }
                    onClick={ () => setClickedNote(item.id) }
                />
            )) }
        </ul>
    );
}

const Sidebar = clickedNote => {
    const notes = useContext(NotesContext);

    let notesToRender = [];
    if (notes) {
        if (notes.length > 0) notesToRender = renderSidebarNotes(notes, clickedNote);
    }

    return (
        <aside className="sidebar">
        <span className="sidebar__add-note add-note">
            <i className="add-note__icon fas fa-plus-square"/>
            <span className="add-note__name">Add note</span>
        </span>
            { notesToRender }
        </aside>
    );
};

export default Sidebar;
