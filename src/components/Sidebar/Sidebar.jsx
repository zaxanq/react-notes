import React, { useContext, useEffect, useState } from 'react';
import './Sidebar.scss';
import { DataContext, UIContext } from '../../contexts';
import Category from './components/Category';
import HttpClient, { Api } from '../../services/HttpClient';
import Lang from '../../assets/i18n/';

const Sidebar = ({handleCategoryClick}) => {
    const {categories, setCategories, editMode, setEditMode, clearEditMode, getNextId, isCategoryEmpty} = useContext(DataContext);
    const {sidebar, snackbar, confirmDialog} = useContext(UIContext);
    const [editedCategoryId, setEditedCategoryId] = useState(null);

    useEffect(() => { // each time editMode changes
        if (editMode.includes(true)) { // if category edited
            document.getElementById('editCategory').focus(); // focus edit category input
        }
    }, [editMode]);

    useEffect(() => { // each time confirmDialog result changes
        if (confirmDialog.result) { // if category delete confirmed
            deleteCategory(confirmDialog.data.id); // delete the category
            confirmDialog.setResult(null);
        }
    }, [confirmDialog.result]);

    const deleteCategory = (cId) => {
        const updatedCategories = [...categories].filter((category) => category.id !== cId); // removed deleted category

        (new HttpClient()).delete( // send delete request
            `${ Api.Categories }/${ cId }`
        ).then(() => finishEditing(updatedCategories, true)); // then update local state
    };

    const finishEditing = (updatedCategories, isChanged) => {
        if (isChanged) setCategories(updatedCategories);
        setEditMode([...categories].map(() => false));
        setEditedCategoryId(null);
    };

    const onCategoryNameEdit = (e, cId) => {
        e.stopPropagation();
        sidebar.setOpened(true); // keep the sidebar opened
        setEditedCategoryId(cId); // set edited category id
        setEditMode([...editMode].map((categoryMode, index) => index === cId ? !categoryMode : false));
    };

    const onCategoryClick = (e, id) => {
        e.stopPropagation();
        handleCategoryClick(id);
    };

    const onCategoryDelete = (e, cId) => {
        e.stopPropagation();
        if (!isCategoryEmpty(cId)) { // show confirmDialog if category is not empty
            confirmDialog.setData({id: cId});
            confirmDialog.show(Lang.confirm.deleteNonEmptyCategory);
        } else deleteCategory(cId); // otherwise delete category
    };

    const onCategoryNameCancel = (e) => {
        e.stopPropagation();
        clearEditMode();
    };

    const onCategoryNameSubmit = (e, newName) => {
        e.preventDefault();
        if (newName === '' && isCategoryEmpty(editedCategoryId)) { // if no name and no categories
            deleteCategory(editedCategoryId); // delete category
        } else if (newName === '') { // if no name and categories
            snackbar.show(Lang.category.cannotRemoveNonEmpty, 'warning');
            finishEditing(null, false);
        } else { // if new name is submitted
            const updatedCategory = [...categories].filter( // find category to update
                (category) => category.id === editedCategoryId)[0];
            updatedCategory.name = newName;

            (new HttpClient()).put( // send request to update the category
                `${ Api.Categories }/${ editedCategoryId }`,
                updatedCategory
            ).then(() => finishEditing([...categories].map( // update local state categories
                (category) => category.id === editedCategoryId ? updatedCategory : category
            ), true));
        }
    };

    const onAddCategoryClick = (e) => {
        e.stopPropagation();

        const newCategory = {
            id: getNextId(categories),
            name: 'New category',
            notes: [],
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
                    title={ category.name }
                    key={ category.id }
                    id={ category.id }
                    editMode={ editMode }
                    setEditMode={ setEditMode }
                    onCategoryClick={ (e, id) => onCategoryClick(e, id) }
                    onCategoryNameCancel={ (e) => onCategoryNameCancel(e) }
                    onCategoryNameEdit={ (e, id) => onCategoryNameEdit(e, id) }
                    onCategoryNameSubmit={ (e, newName) => onCategoryNameSubmit(e, newName) }
                    onCategoryDelete={ (e, id) => onCategoryDelete(e, id) }
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
