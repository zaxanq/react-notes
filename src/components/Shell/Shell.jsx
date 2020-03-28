import React, { useContext } from 'react';
import Sidebar from '../Sidebar';
import Container from '../Container';
import { UIContext } from '../../contexts';

const Shell = () => {
    const { currentCategory, setCurrentCategory } = useContext(UIContext);

    return (
        <React.Fragment>
            <Sidebar onCategoryClick={ (id) => setCurrentCategory(id) } />
            <Container cId={ currentCategory } />
        </React.Fragment>
    );
};

export default Shell;
