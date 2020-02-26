import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import Container from '../Container';

const Shell = () => {
    const [categoryId, setCategoryId] = useState(null);

    const handleCategoryClick = id => setCategoryId(id);

    return (
        <React.Fragment>
            <Sidebar onCategoryClick={(id) => handleCategoryClick(id) } />
            <Container categoryId={ categoryId } />
        </React.Fragment>
    );
};

export default Shell;
