import React, { useContext, useEffect, useState } from 'react';
import './Container.scss';
import { DataContext, UIContext } from '../../contexts';
import Snackbar from './components/Snackbar/Snackbar';
import NotesList from '../NotesList';
import UpdateNoteDialog from './components/UpdateNoteDialog/UpdateNoteDialog';
import ConfirmDialog from "./components/ConfirmDialog";
import Button from '../Shell/components/Button/Button';
import Lang from '../../assets/i18n/';
import DialogType from '../Shell/enums/DialogType.enum';

const Container = ({ cId }) => {
    const { dialog } = useContext(UIContext);
    const { categories } = useContext(DataContext);

    const [dialogType, setDialogType] = useState('');
    const [categoryTitle, setCategoryTitle] = useState('');
    const [currentCategory, setCurrentCategory] = useState(null);

    useEffect(() => { // find current category
        if (categories) setCurrentCategory([...Object.values(categories)]
            .filter((category) => category.id === cId)[0]
        );
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
        setDialogType(DialogType.addNote);
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
                    click={ () => onAddNoteClick() }
                >
                    { Lang.common.addNote }
                </Button>
            </div>
           <NotesList cId={ cId } />
           <UpdateNoteDialog dialogType={ dialogType } />
           <ConfirmDialog />
           <Snackbar />
        </main>
    );
};

export default Container;
