import React, { useContext } from 'react';
import './UpdateNoteDialog.scss';
import { DialogContext } from '../../../../contexts';
import Lang from '../../../../assets/i18n/en';
import DialogType from '../../../Shell/enums/DialogType.enum';
import CategoriesContext from '../../../../contexts/CategoriesContext';

const dialog = (visible, dialogType, categories, closeDialog) => {
    const categoryCheckboxes = categories.map(
        (category) => (
            <div key={ category.id}>
                <input type="checkbox" id={ category.name } value={ category.name } />
                <label htmlFor={ category.name }>{ category.name }</label>
            </div>
        )
    );

    return (
        <div
            className={ 'dialog-container' + (visible ? ' visible' : '') }
            onClick={ () => closeDialog() }
        >
            <div className="dialog update-note-dialog">
                <h3 className="title--with-underline dialog__title">
                    { dialogType === DialogType.addNote ? Lang.common.addNote : Lang.common.editNote }
                </h3>
                <form>
                    <div className="dialog__form-row">
                        <label className="h3" htmlFor="noteTitle">{ Lang.note.title }</label>
                        <input type="text" id="noteTitle" className="input input--text dialog__input"/>
                    </div>
                    <div className="dialog__form-row">
                        <label className="h3" htmlFor="noteContents">{ Lang.note.contents }</label>
                        <textarea id="noteContents" className="input input--textarea dialog__input"/>
                    </div>
                    <div className="dialog__form-row">
                        <h3>{ Lang.note.categories }</h3>
                        <div className="update-note-dialog__categories-group">
                            { categoryCheckboxes }
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

const UpdateNoteDialog = ({dialogType}) => {
    const {visible, setVisible} = useContext(DialogContext);
    const categories = useContext(CategoriesContext);

    const closeDialog = () => setVisible(!visible);

    return visible ? dialog(visible, dialogType, categories, closeDialog) : '';
};

export default UpdateNoteDialog;
