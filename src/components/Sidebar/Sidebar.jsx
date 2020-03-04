import React, { useContext, useState } from 'react';
import './Sidebar.scss';
import Category from './components/Category';
import { CategoriesContext } from '../../contexts';
import Lang from '../../assets/i18n/';

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
        /*
            Each category of categories list the method maps as a Category component in the sidebar.
         */
        <ul className="sidebar__categories-list categories-list">
            { categories.map(category => (
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
                    <span className="add-category__name">{ Lang.common.addCategory }</span>
                </span>
                { categories ? renderCategories() : [] }
            </aside>
            <div
                className="sidebar-overlay"
                onClick={ () => active ? setActive(!active) : undefined }
            />
        </React.Fragment>
    );
};

export default Sidebar;
