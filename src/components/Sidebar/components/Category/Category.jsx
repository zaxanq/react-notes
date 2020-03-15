import React, { useContext, useEffect } from 'react';
import { DataContext, UIContext } from '../../../../contexts';
import HttpClient, { Api } from '../../../../services/HttpClient';
import Lang from '../../../../assets/i18n';

const Category = ({ thisCategory, onCategoryClick }) => {
    const { categories, setCategories, editMode, setEditMode, data } = useContext(DataContext);
    const { sidebar, snackbar, confirmDialog } = useContext(UIContext);

    let newName = '';

    const deleteCategory = () => {
        thisCategory.deleted = true;

        const updatedCategories = [...categories].map((category) => {
            if (category.id === thisCategory.id) category.deleted = true;
            return category;
        });

        (new HttpClient()).put( // send update (soft delete) request
            `${ Api.Categories }/${ thisCategory.id }`,
            thisCategory,
        ).then(() => finishEditing(updatedCategories, true)); // then update local state
    };

    const finishEditing = (updatedCategories, isChanged) => {
        if (isChanged) setCategories(updatedCategories);
        setEditMode([...categories].map(() => false));
    };

    const onNameEdit = (e) => {
        e.stopPropagation();
        sidebar.setOpened(true); // keep the sidebar opened
        setEditMode([...editMode].map((categoryMode, index) => index === thisCategory.id ? !categoryMode : false));
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
        data.clearEditMode();
    };

    const onNameSubmit = (e, newName) => {
        e.preventDefault();
        if (newName === '' && data.isCategoryEmpty(thisCategory.id)) { // if no name and no categories
            deleteCategory(); // delete category
        } else if (newName === '') { // if no name and categories
            snackbar.show(Lang.category.cannotRemoveNonEmpty, 'warning');
            finishEditing(null, false);
        } else { // if new name is submitted
            thisCategory.name = newName;


            (new HttpClient()).put( // send request to update the category
                `${ Api.Categories }/${ thisCategory.id }`,
                thisCategory
            ).then(() => finishEditing([...categories].map( // update local state categories
                (category) => category.id === thisCategory.id ? thisCategory : category
            ), true));
        }
    };

    useEffect(() => { // each time editMode changes
        if (editMode.includes(true)) { // if category edited
            document.getElementById('editCategory').focus(); // focus edit category input
        }
    }, [editMode]);

    useEffect(() => { // each time confirmDialog result changes
        if (confirmDialog.result) { // if category delete confirmed
            deleteCategory(); // delete the category
            confirmDialog.setResult(null);
        }
    }, [confirmDialog.result]);

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

    const categoryTitleSpan = <span className="category__name">{ thisCategory.name }</span>;
    const editCategoryForm = (
        <form onSubmit={ (e) => onNameSubmit(e, newName) }>
            <input
                id="editCategory"
                className="input input--transparent"
                type="text"
                defaultValue={ thisCategory.name }
                onClick={ (e) => e.stopPropagation() }
                onChange={ (e) => newName = e.target.value }
                onBlur={ (e) => onNameCancel(e) }
            />
        </form>
    );

    return (
        <li className="category"
            onClick={ (e) => { onClick(e); } }
        >
            <i className="category__icon fas fa-sticky-note" />
            { editMode[thisCategory.id] && thisCategory.id !== 0 ? editCategoryForm : categoryTitleSpan }
            { thisCategory.id !== 0 ? optionButtons : '' }
        </li>
    );
};

export default Category;
