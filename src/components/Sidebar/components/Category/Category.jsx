import React, { useContext, useState } from 'react';
import HttpClient, { Api } from '../../../../services/HttpClient';
import { DataContext } from '../../../../contexts';

const Category = ({ title, id, onCategoryClick, closeSidebar }) => {
    const { categories, setCategories } = useContext(DataContext);

    const [editMode, setEditMode] = useState(false);
    let newName = '';

    const categoryTitleSpan = <span className="category__name">{ title }</span>;
    const editCategoryForm = (
        <form onSubmit={ (e) => onSubmit(e) }>
            <input
                type="text"
                defaultValue={ title }
                onClick={ (e) => e.stopPropagation() }
                onChange={ (e) => newName = e.target.value }
            />
        </form>
    );

    const onEdit = (e) => {
        e.stopPropagation();
        setEditMode(!editMode);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const updatedCategories = [...categories];

        updatedCategories.forEach((category) => {
            if (category.id === id) {
                category.name = newName;

                (new HttpClient()).put(
                    `${Api.Categories}/${id}`,
                    category
                ).then(() => {
                    setCategories(updatedCategories);
                    setEditMode(!editMode);
                });
            }
        });
    };

    return (
        <li className="category"
            onClick={ () => { onCategoryClick(); closeSidebar() } }
        >
            <i className="category__icon fas fa-sticky-note" />
            { editMode ? editCategoryForm : categoryTitleSpan }
            <i
                className="category__edit fas fa-edit"
                onClick={ (e) => onEdit(e) }
            />
        </li>
    );
};

export default Category;
