import React, { useContext } from 'react';
import './Snackbar.scss';
import { UIContext } from '../../../../contexts';
import Button from '../../../Shell/components/Button';

const Snackbar = () => {
    const { snackbar, singleNote } = useContext(UIContext);

    const snackbarControls = () => {
        if (snackbar.content.type === 'delete-confirmation') {
            return <Button
                buttonStyle="icon undo"
                className="snackbar__control"
                type="button"
                onClick={ () => singleNote.restoreNote().then(() => snackbar.clear()) }
            />
        }
    };

    const snackbarElement = (
        <div className={ 'snackbar snackbar--' + snackbar.content.type }>
            <div
                className="snackbar__close"
                onClick={ () => snackbar.clear() }
            />
            <span>{ snackbar.content.text }</span>
            { snackbarControls() }
        </div>
    );

    return snackbar.visible ?
        snackbarElement :
        '';
};

export default Snackbar;
