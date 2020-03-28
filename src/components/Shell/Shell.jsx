import React, { useContext } from 'react';
import Sidebar from '../Sidebar';
import Container from '../Container';
import { UIContext } from '../../contexts';

const Shell = () => {
    const { category } = useContext(UIContext);

    return (
        <React.Fragment>
            <Sidebar onCategoryClick={ (id) => category.setCurrent(id) } />
            <Container cId={ category.current } />
        </React.Fragment>
    );
};

export default Shell;
