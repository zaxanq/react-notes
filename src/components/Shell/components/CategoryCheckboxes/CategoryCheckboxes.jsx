import React, { useContext } from 'react';
import { DataContext } from '../../../../contexts';

const CategoryCheckboxes = ({ note = null }) => {
    let checkboxes;
    const { categories, update } = useContext(DataContext);

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
        checkboxes = categories.slice(1, categories.length).map( // map each category into checkbox
            (category) => (
                <div key={ category.id }>
                    <input
                        type="checkbox"
                        className="input input--checkbox"
                        id={ `category-checkbox-${ category.id }` }
                        value={ category.name }
                        onChange={ (e) => note ? categoryChecked(category.id, e) : null }
                        defaultChecked={ note ? category.notes.includes(note.id) : false }
                    />
                    <label htmlFor={ `category-checkbox-${ category.id }` }>
                        <span className="category-checkboxes__name">
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
