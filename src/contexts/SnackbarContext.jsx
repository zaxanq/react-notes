import React, { useState } from 'react';

const SnackbarContext = React.createContext({
    visibleSnackbar: false,
    setVisibleSnackbar: () => {},
    snackbarContent: { type: '', text: '' },
    setSnackbarContent: () => {}
});

const SnackbarProvider = ({ children }) => {
    const [visibleSnackbar, setVisibleSnackbar] = useState(false);
    const [snackbarContent, setSnackbarContent] = useState({ type: '', text: '' });
    const value = { visibleSnackbar, setVisibleSnackbar, snackbarContent, setSnackbarContent };

    const { Provider } = SnackbarContext;

    return (
        <Provider value={ value }>
            { children }
        </Provider>
    );
};

export { SnackbarProvider };
export default SnackbarContext;
