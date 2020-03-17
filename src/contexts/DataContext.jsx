import React, { useEffect, useState, useCallback } from 'react';
import HttpClient, { Api } from '../services/HttpClient';

const DataContext = React.createContext(null);

const DataProvider = ({ children }) => {
    const { Provider } = DataContext;

    const [categories, setCategories] = useState([]);
    const [notes, setNotes] = useState([]);
    const [editMode, setEditMode] = useState([...categories].map(() => false));

    const isCategoryEmpty = (cId) => categories.filter((category) => category.id === cId)[0].notes.length === 0;

    const clearEditMode = useCallback(() => {
        setEditMode([...categories].map(() => false))
    }, [categories]);

    const getNextId = (ofWhat) => parseInt(ofWhat.map((item) => item.id)[ofWhat.length - 1]) + 1;

    useEffect(() => {
        (new HttpClient()).get(Api.Categories).then(json => setCategories(json));
    }, []);

    useEffect(() => {
        (new HttpClient()).get(Api.Notes).then(json => setNotes(json));
    }, []);

    useEffect(() => {
        if (categories.length !== 0) clearEditMode();
    }, [categories, clearEditMode]);

    const updateNote = (note, updateState = true) => {
        return (new HttpClient()).put(
            `${ Api.Notes }/${ note.id }`,
            note,
        ).then(() => {
            if (updateState) setNotes([...notes, note])
        });
    };

    const updateCategory = (updatedCategory, updateState = true) => {
        return (new HttpClient()).put(
            `${ Api.Categories }/${ updatedCategory.id }`,
            updatedCategory,
        ).then(() => {
            if (updateState) {
                setCategories(categories
                    .map((category) => category.id === updatedCategory.id ? updatedCategory : category)
                );
            }
        });
    };

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
            update: {
                note: updateNote,
                category: updateCategory,
            }
        }}>
            { children }
        </Provider>
    );
};

export { DataProvider };
export default DataContext;
