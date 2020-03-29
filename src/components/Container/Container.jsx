import React, { useContext, useEffect, useState } from 'react';
import './Container.scss';
import { DataContext, UIContext } from '../../contexts';
import NotesList from '../NotesList';
import SingleNote from '../SingleNote';
import AddNoteDialog from './components/AddNoteDialog';
import ConfirmDialog from './components/ConfirmDialog';
import Snackbar from './components/Snackbar/Snackbar';
import Button from '../Shell/components/Button/Button';
import Lang from '../../assets/i18n';

const Container = ({ cId }) => {
    const { dialog, notes } = useContext(UIContext);
    const { categories } = useContext(DataContext);
    const [categoryTitle, setCategoryTitle] = useState('');
    const [displayedCategory, setDisplayedCategory] = useState(null);

    useEffect(() => { // find current category
        if (categories) setDisplayedCategory([...categories.filter((category) => category.id === cId)][0]);
    }, [categories, cId]);

    useEffect(() => { // set category header
        if (displayedCategory) {
            setCategoryTitle(cId !== 0 ?
                <React.Fragment><span className="container__category-text">Category:</span> { displayedCategory.name }</React.Fragment> :
                displayedCategory.name
            );
        }
    }, [displayedCategory, cId]);

    const onAddNoteClick = () => {
        /*
            on add-note button click set dialog type and show dialog
         */
        dialog.setVisible(true);
    };

    return (
        <main
            className="container"
            onClick={ () => notes.setActive(null) }
        >
            <div className="container__topbar">
                <h2>{ categoryTitle }</h2>
                <Button
                    type="button"
                    buttonStyle="outlined main"
                    className="add-note-button"
                    onClick={ () => onAddNoteClick() }
                >
                    { Lang.common.addNote }
                </Button>
            </div>
            <NotesList cId={ cId } />
            <SingleNote />
            <AddNoteDialog displayedCategoryId={ cId } />
            <ConfirmDialog />
            <Snackbar />
        </main>
    );
};

export default Container;
