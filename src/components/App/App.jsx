import React from 'react';
import Shell from '../Shell';
import { NotesProvider } from '../../contexts/NotesContext';
import { CategoriesProvider } from "../../contexts/CategoriesContext";

const App = () => (
    <CategoriesProvider>
        <NotesProvider>
            <Shell />
        </NotesProvider>
    </CategoriesProvider>
);

export default App;
