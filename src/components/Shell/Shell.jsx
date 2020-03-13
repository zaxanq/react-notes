import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import Container from '../Container';

const Shell = () => {
    const [categoryId, setCategoryId] = useState(0);

    return (
        <React.Fragment>
            <Sidebar handleCategoryClick={ (id) => setCategoryId(id) } />
            <Container cId={ categoryId } />
        </React.Fragment>
    );
};

export default Shell;
