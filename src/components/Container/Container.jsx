import React, {useContext, useEffect, useState} from 'react';
import './Container.scss';
import NotesList from '../NotesList';
import CategoriesContext from '../../contexts/CategoriesContext';
import Lang from '../../assets/i18n/';
import Button from '../Shell/components/Button/Button';
import {NotesContext, DialogContext} from '../../contexts';
import UpdateNoteDialog from './components/UpdateNoteDialog/UpdateNoteDialog';
import DialogType from '../Shell/enums/DialogType.enum';

const Container = ({ categoryId }) => {
    const [ dialogType, setDialogType ] = useState('');
    const { setVisible } = useContext(DialogContext);

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
