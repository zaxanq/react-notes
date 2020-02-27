import React, {useContext, useEffect, useState} from 'react';
import './Container.scss';
import NotesList from '../NotesList';
import CategoriesContext from "../../contexts/CategoriesContext";
import Lang from "../../assets/i18n/en";
import Button from "../Shell/components/Button";
import HttpClient, {Api} from "../../services/HttpClient";
import NotesContext from "../../contexts";

const Container = ({ categoryId }) => {
    const notes = useContext(NotesContext);

    const categories = useContext(CategoriesContext);
    const [categoryTitle, setCategoryTitle] = useState('');
    const [currentCategory, setCurrentCategory] = useState(null);

    useEffect(() => {
        if (categories) {
            setCurrentCategory([...Object.values(categories)].filter((category) => category.id === categoryId)[0]);
        }
    }, [categories, categoryId]);

    useEffect(() => {
        if (currentCategory) {
            setCategoryTitle(categoryId !== 0 ?
                <React.Fragment><span className="container__category-text">Category:</span> { currentCategory.name }</React.Fragment> :
                currentCategory.name
            );
        }
    }, [currentCategory, categoryId]);

    const onAddNoteClick = () => {
        const notesKeys = [...Object.keys(notes)];
        const newNoteId = parseInt(notesKeys[notesKeys.length - 1]) + 1;

        const newNote = {
            id: newNoteId,
            title: '',
            contents: ''
        };
        (new HttpClient()).put(
            `${Api.Notes}/${newNoteId}`,
            newNote
        );
    };

    return (
        <main className="container">
            <div className="container__topbar">
                <h2>{ categoryTitle }</h2>
                <Button
                    type="button"
                    style="outlined"
                    className="add-note-button"
                    click={ () => onAddNoteClick() }
                >{ Lang.common.addNote }</Button>
            </div>
           <NotesList categoryId={ categoryId } />
        </main>
    );
};

export default Container;
