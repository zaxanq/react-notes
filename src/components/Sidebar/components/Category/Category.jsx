import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { DataContext, UIContext } from '../../../../contexts';
import Lang from '../../../../assets/i18n';
import HttpClient, { Api } from '../../../../services/HttpClient';

const Category = ({ thisCategory, onCategoryClick, active, newCategory }) => {
    const { categories, setCategories, data, update } = useContext(DataContext);
    const { sidebar, snackbar, confirmDialog, category, shortcuts } = useContext(UIContext);

    const [editMode, setEditMode] = useState(false);

    const finishEditing = useCallback((updatedCategories, isChanged) => {
        if (isChanged) setCategories(updatedCategories);
    }, [setCategories]);

    const deleteCategory = useCallback((cId = thisCategory.id, withRequest = true) => {
        /*
            usually this method doesn't require a parameter as it is deleting this instances' data
            when the deletion happens through confirmDialog it is necessary to specify the cId to be removed
        */
        if (withRequest) {
            const updatedCategories = [...categories].map((_category) => {
                if (_category.id === cId) {
                    _category.deleted = true;
                    category.setDeleted(_category);
                }
                return _category;
            });

            update.category(updatedCategories[cId], false)
                .then(() => {
                    finishEditing(updatedCategories, true);

                    snackbar.show(Lang.notifications.categoryRemoved, 'delete-category-confirmation');

                    if (cId === thisCategory.id) { // if current category deleted, move user to root category
                        category.setCurrent(0);
                    }
                }); // then update local state
        } else { // if deleting newly created category
            const updatedCategories = [...categories].filter((category) => category.id !== cId);
            setCategories(updatedCategories);
            newCategory = null;
        }
    }, [finishEditing, thisCategory]);

    useEffect(() => {
        if (newCategory) setEditMode(true);
    }, [newCategory]);

    useEffect(() => { // each time editMode changes
        if (nameEditRef.current) nameEditRef.current.focus(); // if category edited
    }, [editMode]);

    useEffect(() => { // each time confirmDialog result changes
        if (confirmDialog.result) { // if category delete confirmed
            deleteCategory(confirmDialog.data.id); // delete the category
            confirmDialog.clear(); // hide confirmDialog and remove all data it contained
        }
    }, [confirmDialog.result, confirmDialog, deleteCategory]);

    const nameEditRef = useRef();
    let newName = thisCategory.name;

    const onNameEdit = (e) => {
        e.stopPropagation();
        sidebar.setOpened(true); // keep the sidebar opened
        setEditMode(true);
    };

    const onClick = (e) => {
        e.stopPropagation();
        onCategoryClick(thisCategory.id);
    };

    const onDelete = (e) => {
        e.stopPropagation();
        if (!data.isCategoryEmpty(thisCategory.id)) { // show confirmDialog if category is not empty
            confirmDialog.setData({id: thisCategory.id});
            confirmDialog.show(Lang.confirm.deleteNonEmptyCategory);
        } else deleteCategory(thisCategory.id); // otherwise delete category
    };

    const onNameCancel = (e) => {
        e.stopPropagation();
        setEditMode(false);
        shortcuts.setAllowed(true);

        if (newCategory) deleteCategory(thisCategory.id, false);
    };

    const onNameSubmit = (e, newName) => {
        e.preventDefault();
        if (newName.trim() === '' && data.isCategoryEmpty(thisCategory.id)) { // if no name and no categories
            if (newCategory) deleteCategory(thisCategory.id, false); // delete new category from state only
            else deleteCategory(); // delete category
        } else if (newName.trim() === '') { // if no name and categories
            snackbar.show(Lang.category.cannotRemoveNonEmpty, 'warning');
            finishEditing(null, false);
            if (newCategory) deleteCategory(thisCategory.id, false); // delete new category from state only
        } else if (newCategory) { // if adding completely new category
            thisCategory.name = newName;

            (new HttpClient()).post(
                Api.Categories,
                thisCategory
            ).then(() => {
                setCategories([...categories]
                    .map((category) => category.id === thisCategory.id ? thisCategory : category)
                );
                setEditMode(false);
                shortcuts.setAllowed(true);
            });
        } else { // if existing category edit and new name is submitted
            if (thisCategory.name !== newName.trim()) {
                thisCategory.name = newName;

                update.category(thisCategory, false)
                    .then(() => {
                        finishEditing([...categories]
                            .map((category) => category.id === thisCategory.id ? thisCategory : category), true);
                        setEditMode(false);
                        shortcuts.setAllowed(true);
                    });
            } else {
                setEditMode(false);
                shortcuts.setAllowed(true);
            }
        }
    };

    const optionButtons = (
        <React.Fragment>
            <i className="category__edit category__control fas fa-edit"
               onClick={ (e) => onNameEdit(e) }
            />
            <i className="category__delete category__control fas fa-trash"
               onClick={ (e) => onDelete(e) }
            />
        </React.Fragment>
    );

    const categoryNameSpan = <span className="category__name">{ thisCategory.name }</span>;
    const editCategoryForm = (
        <form onSubmit={ (e) => onNameSubmit(e, newName) }>
            <input
                ref={ nameEditRef }
                id="editCategory"
                className="input input--transparent category__name-input"
                type="text"
                defaultValue={ thisCategory.name }
                onClick={ (e) => e.stopPropagation() }
                onChange={ (e) => newName = e.target.value }
                onFocus={ () => shortcuts.setAllowed(false) }
                onBlur={ (e) => onNameCancel(e) }
            />
        </form>
    );

    return (
        <li className={ 'category' + (active ? ' category--active' : '') }
            onClick={ (e) => { onClick(e); } }
        >
            <i className={ 'category__icon fas fa-folder' + (active ? '-open' : '') } />
            { editMode && thisCategory.id !== 0 ? editCategoryForm : categoryNameSpan }
            { thisCategory.id !== 0 ? optionButtons : '' }
        </li>
    );
};

export default Category;
