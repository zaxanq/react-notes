import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../../../contexts';
import HttpClient, { Api } from '../../../../services/HttpClient';

const CategoryCheckboxes = ({ note = null }) => {
    let checkboxes;
    const { categories, setCategories } = useContext(DataContext);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        if (note) setSelectedCategories(categories.filter((category) => category.notes.includes(note.id)));
    }, [note]);

    const categoryChecked = (cId, e) => {
        const updateCategories = [...categories];

        if (e.target.checked) { // if category checked
            updateCategories[cId].notes.push(note.id); // add current note to selected category notes
        } else { // if unchecked
            let index = updateCategories[cId].notes.indexOf(note.id);
            updateCategories[cId].notes.splice(index, 1); // remove current note from selected category notes
        }

        (new HttpClient().put(
            `${Api.Categories}/${cId}`,
            updateCategories[cId],
        ).then(() => setCategories(updateCategories)));
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
