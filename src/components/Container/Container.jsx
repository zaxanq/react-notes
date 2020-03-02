import React, {useContext, useEffect, useState} from 'react';
import './Container.scss';
import NotesList from '../NotesList';
import CategoriesContext from '../../contexts/CategoriesContext';
import Lang from '../../assets/i18n/en';
import Button from '../Shell/components/Button/Button';
import HttpClient, {Api} from '../../services/HttpClient';
import {NotesContext, DialogProvider, DialogContext} from '../../contexts';
import UpdateNoteDialog from './components/UpdateNoteDialog/UpdateNoteDialog';
import DialogType from "../Shell/enums/DialogType.enum";

const Container = ({ categoryId }) => {
    const [ dialogType, setDialogType ] = useState('');
    const { visible, setVisible } = useContext(DialogContext);
    const { notes, setNotes } = useContext(NotesContext);

    const categories = useContext(CategoriesContext);
    const [categoryTitle, setCategoryTitle] = useState('');
    const [currentCategory, setCurrentCategory] = useState(null);

    useEffect(() => {
        if (categories) setCurrentCategory([...Object.values(categories)].filter((category) => category.id === categoryId)[0]);
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
        setDialogType(DialogType.addNote);
        setVisible(true);
    };
        // setVisible(true);

        // console.log(visible);
        // const notesIds = notes.map((note) => note.id);

        // const newNote = {
        //     id: parseInt(notesIds[notesIds.length - 1]) + 1,
        //     title: '',
        //     contents: '',
        //     includedIn: [0]
        // };
        //
        // console.log(newNote);
        // (new HttpClient()).post(
        //     Api.Notes,
        //     newNote
        // ).then(
        //     // () => console.log([...notes, newNote]));
        //     () => setNotes([...notes, newNote]));
    // };

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
           <UpdateNoteDialog dialogType={ dialogType } />
        </main>
    );
};

export default Container;
