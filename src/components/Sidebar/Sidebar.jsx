import React, { useContext, useState } from 'react';
import './Sidebar.scss';
import SidebarNote from './components/SidebarNote';
import NotesContext from '../../contexts';

const renderSidebarNotes = (notes, onNoteClick, closeSidebar) => (
    <ul className="sidebar__notes-list notes-list">
        { Object.values(notes).map(item => (
            <SidebarNote
                title={ item.title }
                key={ item.id }
                onNoteClick={ () => onNoteClick(item.id) }
                closeSidebar={ () => closeSidebar() }
            />
        )) }
    </ul>
);

const Sidebar = ({onNoteClick}) => {
    const notes = useContext(NotesContext);
    const [active, setActive] = useState(false);
    const [deactivate, setDeactivate] = useState(false);

    const closeSidebar = () => {
        setDeactivate(true);

        setTimeout(() => {
            setActive(false);
        }, 0);

        setTimeout(() => {
            setDeactivate(false);
        }, 200);
    };

    return (
        <React.Fragment>
            <aside
                className={ 'sidebar' + (active ? ' active' : '') + (deactivate ? ' deactivate' : '') }
                onClick={ () => setActive(!active) }
            >
                <span className="sidebar__add-note add-note">
                    <i className="add-note__icon fas fa-plus-square"/>
                    <span className="add-note__name">Add note</span>
                </span>
                { notes ? renderSidebarNotes(notes, onNoteClick, closeSidebar) : [] }
            </aside>
            <div className="sidebar-overlay"/>
        </React.Fragment>
    );
};

export default Sidebar;
