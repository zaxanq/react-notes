import React, { useEffect, useState } from 'react';
import HttpClient from '../services/HttpClient';

const NOTES_API = 'http://localhost:3001/notes';

const NotesContext = React.createContext(null);

const NotesProvider = ({ children }) => {
    const [notes, setNotes] = useState(null);

    useEffect(() => {
        (new HttpClient()).get(NOTES_API)
            .then(json => {
                setNotes(json);
            });
    }, []);

    const { Provider } = NotesContext;

    return (
        <Provider value={ notes }>
            { children }
        </Provider>
    );
};

export { NotesProvider };
export default NotesContext;
