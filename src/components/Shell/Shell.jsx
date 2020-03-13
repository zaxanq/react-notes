import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import Container from '../Container';

const Shell = () => {
    const [cId, setcId] = useState(0);

    return (
        <React.Fragment>
            <Sidebar onCategoryClick={(id) => setcId(id) } />
            <Container cId={ cId } />
        </React.Fragment>
    );
};

export default Shell;
