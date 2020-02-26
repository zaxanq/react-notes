import React, { useEffect, useState } from 'react';
import HttpClient, { Api } from '../services/HttpClient';

const NotesContext = React.createContext(null);

const NotesProvider = ({ children }) => {
    const [notes, setNotes] = useState(null);

    useEffect(() => {
        (new HttpClient()).get(Api.Notes)
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
