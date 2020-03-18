import React, { useContext, useEffect, useState } from 'react';
import './Container.scss';
import { DataContext, UIContext } from '../../contexts';
import NotesList from '../NotesList';
import SingleNote from '../SingleNote';
import AddNoteDialog from './components/AddNoteDialog';
import ConfirmDialog from './components/ConfirmDialog';
import Snackbar from './components/Snackbar/Snackbar';
import Button from '../Shell/components/Button/Button';
import Lang from '../../assets/i18n/';

const Container = ({ cId }) => {
    const { dialog } = useContext(UIContext);
    const { categories } = useContext(DataContext);
    const [categoryTitle, setCategoryTitle] = useState('');
    const [currentCategory, setCurrentCategory] = useState(null);

    useEffect(() => { // find current category
        if (categories) setCurrentCategory([...categories
            .filter((category) => category.id === cId)][0]);
    }, [categories, cId]);

    useEffect(() => { // set category header
        if (currentCategory) {
            setCategoryTitle(cId !== 0 ?
                <React.Fragment><span className="container__category-text">Category:</span> { currentCategory.name }</React.Fragment> :
                currentCategory.name
            );
        }
    }, [currentCategory, cId]);

    const onAddNoteClick = () => {
        /*
            on add-note button click set dialog type and show dialog
         */
        dialog.setVisible(true);
    };

    return (
        <main className="container">
            <div className="container__topbar">
                <h2>{ categoryTitle }</h2>
                <Button
                    type="button"
                    buttonStyle="outlined"
                    className="add-note-button"
                    onClick={ () => onAddNoteClick() }
                >
                    { Lang.common.addNote }
                </Button>
            </div>
            <NotesList cId={ cId } />
            <SingleNote />
            <AddNoteDialog currentCategoryId={ cId } />
            <ConfirmDialog />
            <Snackbar />
        </main>
    );
};

export default Container;
