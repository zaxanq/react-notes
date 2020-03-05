import React, { useContext } from 'react';
import './Snackbar.scss';
import { UIContext } from '../../../../contexts';

const Snackbar = () => {
    const { snackbar } = useContext(UIContext);
    const snackbarElement = (
        <div className={ 'snackbar snackbar--' + snackbar.content.type }>
            <div
                className="snackbar__close"
                onClick={ () => snackbar.clear() }
            />
            <span>{ snackbar.content.text }</span>
        </div>
    );

    return snackbar.visible ?
        snackbarElement :
        '';
};

export default Snackbar;
