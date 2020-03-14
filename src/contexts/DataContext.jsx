import React, { useEffect, useState } from 'react';
import HttpClient, { Api } from '../services/HttpClient';

const DataContext = React.createContext(null);

const DataProvider = ({ children }) => {
    const { Provider } = DataContext;

    const [categories, setCategories] = useState([]);
    const [notes, setNotes] = useState([]);
    const [editMode, setEditMode] = useState([...categories].map(() => false));

    const isCategoryEmpty = (cId) => categories.filter((category) => category.id === cId)[0].notes.length === 0;

    const clearEditMode = () => setEditMode([...categories].map(() => false));

    const getNextId = (ofWhat) => parseInt(ofWhat.map((item) => item.id)[ofWhat.length - 1]) + 1;

    useEffect(() => {
        (new HttpClient()).get(Api.Categories).then(json => setCategories(json));
    }, []);

    useEffect(() => {
        (new HttpClient()).get(Api.Notes).then(json => setNotes(json));
    }, []);

    useEffect(() => {
        if (categories.length !== 0) clearEditMode();
    }, [categories]);

    return (
        <Provider value={{
            categories, setCategories,
            notes, setNotes,
            editMode, setEditMode,
            data: {
                getNextId,
                isCategoryEmpty,
                clearEditMode,
            },
        }}>
            { children }
        </Provider>
    );
};

export { DataProvider };
export default DataContext;
