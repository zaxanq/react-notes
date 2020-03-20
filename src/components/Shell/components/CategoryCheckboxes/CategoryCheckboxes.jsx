import React, { useContext } from 'react';
import './CategoryCheckboxes.scss';
import { DataContext } from '../../../../contexts';

const CategoryCheckboxes = ({ note = null, currentCategoryId = null }) => {
    const { categories, update } = useContext(DataContext);
    let checkboxes;
    const defaultChecked = (category) => {
        let checked = false; // by default it should not be checked

        if (note) checked = category.notes.includes(note.id);
        else if (currentCategoryId) checked = currentCategoryId === category.id;

        return checked;
    };

    const categoryChecked = (cId, e) => {
        const updatedCategories = [...categories];

        if (e.target.checked) { // if category checked
            updatedCategories[cId].notes.push(note.id); // add current note to selected category notes
        } else { // if unchecked
            let index = updatedCategories[cId].notes.indexOf(note.id);
            updatedCategories[cId].notes.splice(index, 1); // remove current note from selected category notes
        }

        update.category(updatedCategories[cId]);
    };

    if (categories) {
        checkboxes = categories.slice(1, categories.length)
            .filter((category) => !category.deleted)
            .map((category) => ( // map each category into checkbox
                <div key={ category.id } className="category-checkbox">
                    <input
                        type="checkbox"
                        className="input input--checkbox"
                        id={ `category-checkbox-${ category.id }` }
                        value={ category.name }
                        onChange={ (e) => note ? categoryChecked(category.id, e) : null }
                        defaultChecked={ defaultChecked(category) }
                    />
                    <label htmlFor={ `category-checkbox-${ category.id }` }>
                        <span className="category-checkbox__name">
                            { category.name }
                        </span>
                    </label>
                </div>
            )
        );
    }

    return checkboxes;
};

export default CategoryCheckboxes;
