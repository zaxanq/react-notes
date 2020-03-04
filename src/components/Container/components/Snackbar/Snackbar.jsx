import React, { useContext } from 'react';
import './Snackbar.scss';
import { SnackbarContext } from '../../../../contexts';

const Snackbar = () => {
    const { visibleSnackbar, setVisibleSnackbar, snackbarContent, setSnackbarContent } = useContext(SnackbarContext);

    return visibleSnackbar ?
        <div className={ 'snackbar snackbar--' + snackbarContent.type }>{ snackbarContent.text }</div> :
        '';
};

export default Snackbar;
