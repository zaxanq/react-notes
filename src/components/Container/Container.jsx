import React, {useContext, useEffect, useState} from 'react';
import './Container.scss';
import NotesList from '../NotesList';
import DataContext from '../../contexts/DataContext';
import Lang from '../../assets/i18n/';
import Button from '../Shell/components/Button/Button';
import { UIContext } from '../../contexts';
import UpdateNoteDialog from './components/UpdateNoteDialog/UpdateNoteDialog';
import DialogType from '../Shell/enums/DialogType.enum';
import Snackbar from './components/Snackbar/Snackbar';

const Container = ({ categoryId }) => {
    const [dialogType, setDialogType] = useState('');
    const { setVisibleDialog } = useContext(UIContext);

    const categories = useContext(DataContext);
    const [categoryTitle, setCategoryTitle] = useState('');
    const [currentCategory, setCurrentCategory] = useState(null);

    useEffect(() => { // find current category
        if (categories) setCurrentCategory([...Object.values(categories)]
            .filter((category) => category.id === categoryId)[0]
        );
    }, [categories, categoryId]);

    useEffect(() => { // set category header
        if (currentCategory) {
            setCategoryTitle(categoryId !== 0 ?
                <React.Fragment><span className="container__category-text">Category:</span> { currentCategory.name }</React.Fragment> :
                currentCategory.name
            );
        }
    }, [currentCategory, categoryId]);

    const onAddNoteClick = () => {
        /*
            on add-note button click set dialog type and show dialog
         */
        setDialogType(DialogType.addNote);
        setVisibleDialog(true);
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
                >
                    { Lang.common.addNote }
                </Button>
            </div>
           <NotesList categoryId={ categoryId } />
           <UpdateNoteDialog dialogType={ dialogType } />
           <Snackbar />
        </main>
    );
};

export default Container;
