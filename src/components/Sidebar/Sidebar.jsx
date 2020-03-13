import React, { useContext, useEffect, useState } from 'react';
import './Sidebar.scss';
import Category from './components/Category';
import { DataContext, UIContext } from '../../contexts';
import Lang from '../../assets/i18n/';
import HttpClient, { Api } from '../../services/HttpClient';

const Sidebar = ({ handleCategoryClick }) => {
    const { notes, setNotes, categories, setCategories, editMode, setEditMode, clearEditMode, getNextId, isCategoryEmpty } = useContext(DataContext);
    const { sidebar, snackbar, confirmDialog } = useContext(UIContext);
    const [editedCategoryId, setEditedCategoryId] = useState(null);

    useEffect(() => {
        const editCategoryInput = document.getElementById('editCategory');
        if (editCategoryInput) editCategoryInput.focus();
    }, [editMode, categories]);

    useEffect(() => {
        if (confirmDialog.result) {
            setNotes([...notes].map((note) => {
                if (note.includedIn.includes(confirmDialog.data.id)) {
                    note.includedIn.splice(note.includedIn.indexOf(confirmDialog.data.id), 1);
                }
                return {
                    ...note,
                    includedIn: note.includedIn,
                };
            }));

            console.log(notes);

            // (new HttpClient()).put(
            //     `${ Api.Notes }`,
            //     notes
            // );

            deleteCategory(confirmDialog.data.id);
            confirmDialog.setResult(null);
        }
    }, [notes, confirmDialog.result]);


    const deleteCategory = (cId = editedCategoryId) => {
        const updatedCategories = [...categories].filter((category) => category.id !== cId);

        (new HttpClient()).delete(
            `${ Api.Categories }/${ cId }`
        ).then(() => finishEditing(updatedCategories));
    };

    const finishEditing = (updatedCategories, isChanged = true) => {
        if (isChanged) setCategories(updatedCategories);
        setEditMode(!editMode);
        setEditedCategoryId(null);
    };

    const onCategoryNameEdit = (e, cId) => {
        e.stopPropagation();

        sidebar.setActive(true);
        setEditedCategoryId(cId);
        setEditMode([...editMode].map((categoryMode, index) => index === cId ? !categoryMode : false));
    };

    const onCategoryClick = (e, id) => {
        e.stopPropagation();
        handleCategoryClick(id);
    };

    const onCategoryDelete = (e, cId) => {
        e.stopPropagation();

        if (!isCategoryEmpty(cId)) {
            confirmDialog.setData({ id: cId });
            confirmDialog.show(Lang.confirm.deleteNonEmptyCategory);
        }
        else deleteCategory(cId);
    };

    const onCategoryNameCancel = (e) => {
        e.stopPropagation();
        clearEditMode();
    };

    const onCategoryNameSubmit = (e, newName) => {
        e.preventDefault();

        if (newName === '' && isCategoryEmpty(editedCategoryId)) {
            deleteCategory();
        } else if (newName === '') {
            snackbar.show(Lang.category.cannotRemoveNonEmpty, 'warning');
            finishEditing(null,false);
        } else {
            const updatedCategories = [...categories];
            updatedCategories.forEach((category) => {
                if (category.id === editedCategoryId) {
                    category.name = newName;

                    (new HttpClient()).put(
                        `${Api.Categories}/${editedCategoryId}`,
                        category
                    ).then(() => finishEditing(updatedCategories));
                }
            });
        }
    };

    const onAddCategoryClick = (e) => {
        e.stopPropagation();

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
                className={ 'sidebar' + (sidebar.active ? ' sidebar--active' : '') }
                onClick={ () => sidebar.setActive(!sidebar.active) }
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
                onClick={ () => sidebar.active ? sidebar.setActive(!sidebar.active) : undefined }
            />
        </React.Fragment>
    );
};

export default Sidebar;
