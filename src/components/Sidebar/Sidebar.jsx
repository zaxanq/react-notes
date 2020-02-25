import React, { useContext } from 'react';
import './Sidebar.scss';
import SidebarNote from './components/SidebarNote';
import NotesContext from '../../contexts';

const renderSidebarNotes = (notes, onNoteClick) => (
    <ul className="sidebar__notes-list notes-list">
        { Object.values(notes).map(item => (
            <SidebarNote
                title={ item.title }
                key={ item.id }
                onNoteClick={ () => onNoteClick(item.id) }
            />
        )) }
    </ul>
);

const Sidebar = ({onNoteClick}) => {
    const notes = useContext(NotesContext);

    let notesToRender = [];
    if (notes) {
        notesToRender = renderSidebarNotes(notes, onNoteClick);
    }

    return (
        <React.Fragment>
            <aside className="sidebar">
                <span className="sidebar__add-note add-note">
                    <i className="add-note__icon fas fa-plus-square"/>
                    <span className="add-note__name">Add note</span>
                </span>
                { notesToRender }
            </aside>
            <div className="sidebar-overlay"/>
        </React.Fragment>
    );
};

export default Sidebar;
