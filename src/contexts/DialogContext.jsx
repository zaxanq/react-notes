import React, { useState } from 'react';

const DialogContext = React.createContext({
    visible: false,
    setVisible: () => {}
});

const DialogProvider = ({ children }) => {
    const [visible, setVisible] = useState(false);
    const value = { visible, setVisible };

    const { Provider } = DialogContext;

    return (
        <Provider value={ value }>
            { children }
        </Provider>
    );
};

export { DialogProvider };
export default DialogContext;
