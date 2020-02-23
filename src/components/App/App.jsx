import React from 'react';
import Shell from '../Shell';
import { NotesProvider } from '../../contexts/NotesContext';

const App = () => (
    <NotesProvider>
        <Shell />
    </NotesProvider>
);

export default App;
