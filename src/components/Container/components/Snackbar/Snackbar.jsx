import React, { useContext } from 'react';
import './Snackbar.scss';
import { UIContext } from '../../../../contexts';
import Button from '../../../Shell/components/Button';

const Snackbar = () => {
    const { snackbar, singleNote, category } = useContext(UIContext);
    const indicatorStyle = { animationDuration: `${ snackbar.visibleTime / 1000 }s` };

    const snackbarControls = () => {
        if (snackbar.content.type === 'delete-note-confirmation') {
            return <Button
                buttonStyle="icon undo"
                className="snackbar__control"
                type="button"
                onClick={ () => singleNote.restoreNote().then(() => snackbar.clear()) }
            />
        } else if ( snackbar.content.type === 'delete-category-confirmation') {
            return <Button
                buttonStyle="icon undo"
                className="snackbar__control"
                type="button"
                onClick={ () => category.restore().then(() => snackbar.clear()) }
            />
        }
    };

    const snackbarElement = (
        <div className={ 'snackbar snackbar--' + snackbar.content.type }>
            <div className="snackbar__indicator" style={ indicatorStyle } />
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
