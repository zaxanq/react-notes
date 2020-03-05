import React from 'react';
import Shell from '../Shell';
import { DataProvider, UiProvider } from '../../contexts';

const App = () => (
    <DataProvider>
        <UiProvider>
            <Shell />
        </UiProvider>
    </DataProvider>
);

export default App;
