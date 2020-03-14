import React, { useContext, useEffect } from 'react';
import { DataContext, UIContext } from '../../../../contexts';
import HttpClient, { Api } from '../../../../services/HttpClient';
import Lang from '../../../../assets/i18n';

const Category = ({ thisCategory, onCategoryClick }) => {
    const { categories, setCategories, editMode, setEditMode, data } = useContext(DataContext);
    const { sidebar, snackbar, confirmDialog } = useContext(UIContext);

    let newName = '';

    const deleteCategory = () => {
        const updatedCategories = [...categories].filter((category) => category.id !== thisCategory.id);

        (new HttpClient()).delete( // send delete request
            `${ Api.Categories }/${ thisCategory.id }`
        ).then(() => finishEditing(updatedCategories, true)); // then update local state
    };

    const finishEditing = (updatedCategories, isChanged) => {
        if (isChanged) setCategories(updatedCategories);
        setEditMode([...categories].map(() => false));
    };

    const onNameEdit = (e, cId) => {
        e.stopPropagation();
        sidebar.setOpened(true); // keep the sidebar opened
        setEditMode([...editMode].map((categoryMode, index) => index === cId ? !categoryMode : false));
    };

    const onClick = (e, id) => {
        e.stopPropagation();
        onCategoryClick(id);
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
            deleteCategory(thisCategory.id); // delete category
        } else if (newName === '') { // if no name and categories
            snackbar.show(Lang.category.cannotRemoveNonEmpty, 'warning');
            finishEditing(null, false);
        } else { // if new name is submitted
            const updatedCategory = [...categories].filter( // find category to update
                (category) => category.id === thisCategory.id)[0];
            updatedCategory.name = newName;

            (new HttpClient()).put( // send request to update the category
                `${ Api.Categories }/${ thisCategory.id }`,
                updatedCategory
            ).then(() => finishEditing([...categories].map( // update local state categories
                (category) => category.id === thisCategory.id ? updatedCategory : category
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
            deleteCategory(confirmDialog.data.id); // delete the category
            confirmDialog.setResult(null);
        }
    }, [confirmDialog.result]);

    const optionButtons = (
        <React.Fragment>
            <i className="category__edit category__control fas fa-edit"
               onClick={ (e) => onNameEdit(e, thisCategory.id) }
            />
            <i className="category__delete category__control fas fa-trash"
               onClick={ (e) => onDelete(e, thisCategory.id) }
            />
        </React.Fragment>
    );

    const categoryTitleSpan = <span className="category__name">{ thisCategory.name }</span>;
    const editCategoryForm = (
        <form onSubmit={ (e) => onNameSubmit(e, newName, thisCategory.id) }>
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
            onClick={ (e) => { onClick(e, thisCategory.id); } }
        >
            <i className="category__icon fas fa-sticky-note" />
            { editMode[thisCategory.id] && thisCategory.id !== 0 ? editCategoryForm : categoryTitleSpan }
            { thisCategory.id !== 0 ? optionButtons : '' }
        </li>
    );
};

export default Category;
