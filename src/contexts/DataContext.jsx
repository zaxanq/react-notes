import React, { useEffect, useState } from 'react';
import HttpClient, { Api } from '../services/HttpClient';

const DataContext = React.createContext(null);

const DataProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [notes, setNotes] = useState([]);

    const { Provider } = DataContext;

    const getNextId = ( ofWhat ) => parseInt(ofWhat.map((item) => item.id)[ofWhat.length - 1]) + 1;

    useEffect(() => {
        (new HttpClient()).get(Api.Categories)
            .then(json => setCategories(json));
    }, []);

    useEffect(() => {
        (new HttpClient()).get(Api.Notes)
            .then(json => setNotes(json));
    }, []);

    return (
        <Provider value={{
            categories, setCategories,
            notes, setNotes,
            getNextId
        }}>
            { children }
        </Provider>
    );
};

export { DataProvider };
export default DataContext;
