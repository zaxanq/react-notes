import React, { useContext } from 'react';
import './Snackbar.scss';
import { UIContext } from '../../../../contexts';

const Snackbar = () => {
    const { snackbarVisible, snackbarContent } = useContext(UIContext);

    return snackbarVisible ?
        <div className={ 'snackbar snackbar--' + snackbarContent.type }>{ snackbarContent.text }</div> :
        '';
};

export default Snackbar;
