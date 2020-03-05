import React from 'react';

const Category = ({ title, onCategoryClick, closeSidebar }) => (
    <li className="categories-list__item"
        onClick={ () => { onCategoryClick(); closeSidebar() } }
    >
        <i className="categories-list__icon fas fa-sticky-note"/>
        <span className="categories-list__name">{ title }</span>
    </li>
);

export default Category;
