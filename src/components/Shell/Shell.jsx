import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import Container from '../Container';

const Shell = () => {
    const [noteId, setNoteId] = useState(null);

    const handleNoteClick = id => {
        setNoteId(id);
    };

    return (
        <React.Fragment>
            <Sidebar
                onNoteClick={(id) => handleNoteClick(id) }
            />
            <Container noteId={ noteId } />
        </React.Fragment>
    );
};

export default Shell;
