import React from 'react';
import Shell from '../Shell';
import { NotesProvider, CategoriesProvider, DialogProvider } from '../../contexts';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
        }
    }

    setVisible = (value) => {
        this.setState({ visible: value });
    };

    render() {
        return (
            <CategoriesProvider>
                <NotesProvider>
                    <DialogProvider value={ {state: this.state, setVisible: this.setVisible} }>
                        <Shell/>
                    </DialogProvider>
                </NotesProvider>
            </CategoriesProvider>
        );
    }

}

export default App;
