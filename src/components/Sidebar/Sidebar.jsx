import React, { useContext, useState } from 'react';
import './Sidebar.scss';
import Category from './components/Category';
import CategoriesContext from '../../contexts/CategoriesContext';

const Sidebar = ({ onCategoryClick }) => {
    const [active, setActive] = useState(false);
    const [deactivate, setDeactivate] = useState(false);
    const categories = useContext(CategoriesContext);

    const closeSidebar = () => {
        setDeactivate(true);

        setTimeout(() => setActive(false), 0);
        setTimeout(() => setDeactivate(false), 200);
    };

    const renderCategories = () => (
        <ul className="sidebar__categories-list categories-list">
            { Object.values(categories).map(category => (
                <Category
                    title={ category.name  }
                    key={ category.id }
                    onCategoryClick={ () => onCategoryClick(category.id) }
                    closeSidebar={ () => closeSidebar() }
                />
            )) }
        </ul>
    );

    return (
        <React.Fragment>
            <aside
                className={ 'sidebar' + (active ? ' active' : '') + (deactivate ? ' deactivate' : '') }
                onClick={ () => setActive(!active) }
            >
                <span className="sidebar__add-category add-category">
                    <i className="add-category__icon fas fa-plus-square"/>
                    <span className="add-category__name">Add category</span>
                </span>
                { categories ? renderCategories() : [] }
            </aside>
            <div className="sidebar-overlay"/>
        </React.Fragment>
    );
};

export default Sidebar;
