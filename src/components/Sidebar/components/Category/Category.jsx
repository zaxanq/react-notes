import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { DataContext, UIContext } from '../../../../contexts';
import Lang from '../../../../assets/i18n';

const Category = ({ thisCategory, onCategoryClick, active }) => {
    const { categories, setCategories, data, update } = useContext(DataContext);
    const { sidebar, snackbar, confirmDialog } = useContext(UIContext);

    const [editMode, setEditMode] = useState(false);

    const nameEditRef = useRef();
    let newName = thisCategory.name;

    const finishEditing = useCallback((updatedCategories, isChanged) => {
        if (isChanged) setCategories(updatedCategories);
    }, [categories, setCategories]);

    const deleteCategory = useCallback((cId = thisCategory.id) => {
        /*
            usually this method doesn't require a parameter as it is deleting this instances' data
            when the deletion happens through confirmDialog it is necessary to specify the cI to be removed
        */
        const updatedCategories = [...categories].map((category) => {
            if (category.id === cId) category.deleted = true;
            return category;
        });

        update.category(updatedCategories[cId], false)
            .then(() => finishEditing(updatedCategories, true)); // then update local state
    }, [categories, finishEditing, thisCategory]);

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
    };

    const onNameSubmit = (e, newName) => {
        e.preventDefault();
        if (newName === '' && data.isCategoryEmpty(thisCategory.id)) { // if no name and no categories
            deleteCategory(); // delete category
        } else if (newName === '') { // if no name and categories
            snackbar.show(Lang.category.cannotRemoveNonEmpty, 'warning');
            finishEditing(null, false);
        } else { // if new name is submitted
            if (thisCategory.name !== newName.trim()) {
                thisCategory.name = newName;

                update.category(thisCategory, false)
                    .then(() => {
                        finishEditing([...categories]
                            .map((category) => category.id === thisCategory.id ? thisCategory : category), true);
                        setEditMode(false);
                    });
            } else {
                setEditMode(false);
            }
        }
    };

    useEffect(() => { // each time editMode changes
        if (nameEditRef.current) nameEditRef.current.focus(); // if category edited
    }, [editMode]);

    useEffect(() => { // each time confirmDialog result changes
        if (confirmDialog.result) { // if category delete confirmed
            deleteCategory(confirmDialog.data.id); // delete the category
            confirmDialog.clear(); // hide confirmDialog and remove all data it contained
        }
    }, [confirmDialog.result, deleteCategory, confirmDialog]);

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
