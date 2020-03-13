import React from 'react';

const Category = ({ title, id, editMode, onCategoryClick, onCategoryNameCancel, onCategoryNameEdit,
                      onCategoryNameSubmit, onCategoryDelete }) => {
    let newName = '';
    const optionButtons = (
        <React.Fragment>
            <i className="category__edit category__control fas fa-edit"
               onClick={ (e) => onCategoryNameEdit(e, id) }
            />
            <i className="category__delete category__control fas fa-trash"
               onClick={ (e) => onCategoryDelete(e, id) }
            />
        </React.Fragment>
    );

    const categoryTitleSpan = <span className="category__name">{ title }</span>;
    const editCategoryForm = (
        <form onSubmit={ (e) => onCategoryNameSubmit(e, newName, id) }>
            <input
                id="editCategory"
                className="input input--transparent"
                type="text"
                defaultValue={ title }
                onClick={ (e) => e.stopPropagation() }
                onChange={ (e) => newName = e.target.value }
                onBlur={ (e) => onCategoryNameCancel(e) }
            />
        </form>
    );

    return (
        <li className="category"
            onClick={ (e) => { onCategoryClick(e, id); } }
        >
            <i className="category__icon fas fa-sticky-note" />
            { editMode[id] && id !== 0 ? editCategoryForm : categoryTitleSpan }
            { id !== 0 ? optionButtons : '' }
        </li>
    );
};

export default Category;
