import React from 'react';

const SidebarNote = ({ title, onNoteClick, closeSidebar }) => (
    <li className="notes-list__item"
        onClick={ () => { onNoteClick(); closeSidebar() } }
    >
        <i className="notes-list__icon fas fa-sticky-note"/>
        <span className="notes-list__name">{ title }</span>
    </li>
);

export default SidebarNote;
