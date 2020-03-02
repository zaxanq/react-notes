import React from 'react';
import Shell from '../Shell';
import { NotesProvider, CategoriesProvider, DialogProvider, SnackbarProvider } from '../../contexts';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            snackbarVisible: false,
            snackbarContent: {
                type: '',
                text: '',
            },
        };
    }

    setVisible = (value) => {
        this.setState({
            ...this.state,
            visible: value
        });
    };

    setVisibleSnackbar = (value) => {
        this.setState({
            ...this.state,
            snackbarVisible: value
        });
    };

    setSnackbarContent = (text, type) => {
        this.setState({
            ...this.state,
            snackbarContent: {
                text,
                type,
            }
        });
    };

    render() {
        return (
            <CategoriesProvider>
                <NotesProvider>
                    <DialogProvider value={{ state: this.state, setVisible: this.setVisible }}>
                    <SnackbarProvider value={{state: this.state, setVisibleSnackbar: this.setVisibleSnackbar, setSnackbarContent: this.setSnackbarContent }}>
                        <Shell/>
                    </SnackbarProvider>
                    </DialogProvider>
                </NotesProvider>
            </CategoriesProvider>
        );
    }

}

export default App;
