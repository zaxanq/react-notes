import React, { useEffect, useState } from 'react';
import HttpClient, { Api } from '../services/HttpClient';

const CategoriesContext = React.createContext(null);

const CategoriesProvider = ({ children }) => {
    const [categories, setCategories] = useState(null);

    useEffect(() => {
        (new HttpClient()).get(Api.Categories)
            .then(json => setCategories(json));
    }, []);

    const { Provider } = CategoriesContext;

    return (
        <Provider value={ categories }>
            { children }
        </Provider>
    );
};

export { CategoriesProvider };
export default CategoriesContext;
