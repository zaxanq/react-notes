import React, { useContext, useEffect, useState } from 'react';
import './Sidebar.scss';
import Category from './components/Category';
import { DataContext, UIContext } from '../../contexts';
import Lang from '../../assets/i18n/';
import HttpClient, { Api } from '../../services/HttpClient';

const Sidebar = ({ onCategoryClick }) => {
    const { sidebar, snackbar, confirmDialog } = useContext(UIContext);
    const [editedCategoryId, setEditedCategoryId] = useState(null);

    const { categories, setCategories, editMode, setEditMode, clearEditMode, getNextId, isCategoryEmpty } = useContext(DataContext);

    const closeSidebar = () => {
        sidebar.setActive(false);
    };

    const onCategoryNameEdit = (e, id) => {
        e.stopPropagation();

        sidebar.setActive(true);
        setEditedCategoryId(id);
        setEditMode([...editMode]
            .map((categoryMode, index) => index === id ? !categoryMode : false)
        );
    };

    const onCategoryDelete = (e, id) => {
        e.stopPropagation();

        sidebar.setActive(true);
        confirmDialog.show(Lang.confirm.deleteNonEmptyCategory);
    };

    useEffect(() => {
        const editCategoryInput = document.getElementById('editCategory');
        if (editCategoryInput) editCategoryInput.focus();
    }, [editMode]);

    const onCategoryNameCancel = (e) => {
        e.stopPropagation();
        clearEditMode();
    };

    const onCategoryNameSubmit = (e, newName) => {
        e.preventDefault();
        let updatedCategories = [...categories];

        const finishEditing = (isChanged = true) => {
            if (isChanged) setCategories(updatedCategories);
            setEditMode(!editMode);
            setEditedCategoryId(null);
        };

        if (newName === '' && isCategoryEmpty(editedCategoryId)) {
            updatedCategories = updatedCategories.filter((category) => category.id !== editedCategoryId);

            (new HttpClient()).delete(
                `${ Api.Categories }/${ editedCategoryId }`
            ).then(() => finishEditing());
        } else if (newName === '') {
            snackbar.show(Lang.category.cannotRemoveNonEmpty, 'warning');
            finishEditing(false);
        }
         else {
            updatedCategories.forEach((category) => {
                if (category.id === editedCategoryId) {
                    category.name = newName;

                    (new HttpClient()).put(
                        `${Api.Categories}/${editedCategoryId}`,
                        category
                    ).then(() => finishEditing());
                }
            });
        }
    };

    const onAddCategoryClick = () => {
        const newCategory = {
            id: getNextId(categories),
            name: 'New category',
        };

        (new HttpClient()).post(
            Api.Categories,
            newCategory
        ).then(() => setCategories([...categories, newCategory]));
    };

    const renderCategories = () => (
        /*
            Each category of categories list the method maps as a Category component in the sidebar.
         */
        <ul className="sidebar__categories-list">
            { categories.map(category => (
                <Category
                    title={ category.name  }
                    key={ category.id }
                    id={ category.id }
                    editMode={ editMode }
                    setEditMode={ setEditMode }
                    onCategoryClick={ onCategoryClick }
                    onCategoryNameCancel={ (e) => onCategoryNameCancel(e) }
                    onCategoryNameEdit={ (e, id) => onCategoryNameEdit(e, id) }
                    onCategoryNameSubmit={ (e, newName) => onCategoryNameSubmit(e, newName) }
                    onCategoryDelete={ (e, id) => onCategoryDelete(e, id) }
                    closeSidebar={ () => closeSidebar() }
                />
            )) }
        </ul>
    );

    return (
        <React.Fragment>
            <aside
                className={ 'sidebar' + (sidebar.active ? ' sidebar--active' : '') }
                onClick={ () => sidebar.setActive(!sidebar.active) }
            >
                <span
                    className="sidebar__add-category add-category"
                    onClick={ () => onAddCategoryClick() }
                >
                    <i className="add-category__icon fas fa-plus-square"/>
                    <span className="add-category__name">{ Lang.common.addCategory }</span>
                </span>
                { categories ? renderCategories() : [] }
            </aside>
            <div
                className="sidebar-overlay"
                onClick={ () => sidebar.active ? sidebar.setActive(!sidebar.active) : undefined }
            />
        </React.Fragment>
    );
};

export default Sidebar;
