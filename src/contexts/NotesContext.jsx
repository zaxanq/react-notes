import React, { useEffect, useState } from 'react';
import HttpClient, { Api } from '../services/HttpClient';

const NotesContext = React.createContext({
    notes: [],
    setNotes: () => {}
});

const NotesProvider = ({ children }) => {
    const [notes, setNotes] = useState([]);
    const value = { notes, setNotes };

    useEffect(() => {
        (new HttpClient()).get(Api.Notes)
            .then(json => setNotes(json));
    }, []);

    const { Provider } = NotesContext;

    return (
        <Provider value={ value }>
            { children }
        </Provider>
    );
};

export { NotesProvider };
export default NotesContext;
