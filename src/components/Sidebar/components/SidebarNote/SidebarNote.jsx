import React from 'react';

const SidebarNote = ({ title }) => (
    <li className="notes-list__item">
        <i className="notes-list__icon fas fa-sticky-note"/>
        <span className="notes-list__name">{ title }</span>
    </li>
);

export default SidebarNote;
