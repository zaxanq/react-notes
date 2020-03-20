import React, { useContext, useState } from 'react';
import './Sidebar.scss';
import { DataContext, UIContext } from '../../contexts';
import Category from './components/Category';
import Lang from '../../assets/i18n/';

const Sidebar = ({ onCategoryClick }) => {
    const { categories, setCategories, data } = useContext(DataContext);
    const { sidebar } = useContext(UIContext);
    const [activeCategory, setActiveCategory] = useState(0);
    const [newCategoryId, setNewCategoryId] = useState(null);

    const handleCategoryClick = (cId) => {
        setActiveCategory(cId);
        onCategoryClick(cId);
    };

    const onAddCategoryClick = (e) => {
        e.stopPropagation();

        const newCategory = {
            id: data.getNextId(categories),
            name: 'New category',
            notes: [],
            deleted: false,
        };

        setNewCategoryId(newCategory.id);
        setCategories([...categories, newCategory])
    };

    const renderCategories = () => (
        /*
            Each category of categories list the method maps as a Category component in the sidebar.
         */
        <ul className="sidebar__categories-list">
            { categories
                .filter((category) => !category.deleted) // use only not-deleted categories
                .map(category => (
                <Category
                    key={ category.id }
                    thisCategory={ category }
                    onCategoryClick={ (id) => handleCategoryClick(id) }
                    active={ category.id === activeCategory }
                    newCategory={ category.id === newCategoryId }
                />
            )) }
        </ul>
    );

    return (
        <React.Fragment>
            <aside
                className={ 'sidebar' + (sidebar.opened ? ' sidebar--opened' : '') }
                onClick={ () => sidebar.setOpened(!sidebar.opened) }
            >
                <span
                    className="sidebar__add-category add-category"
                    onClick={ (e) => onAddCategoryClick(e) }
                >
                    <i className="add-category__icon fas fa-plus-square"/>
                    <span className="add-category__name">{ Lang.common.addCategory }</span>
                </span>
                { categories ? renderCategories() : [] }
            </aside>
            <div
                className="sidebar-overlay"
                onClick={ () => sidebar.opened ? sidebar.setOpened(!sidebar.opened) : undefined }
            />
        </React.Fragment>
    );
};

export default Sidebar;
