import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../../../contexts';
import HttpClient from "../../../../services/HttpClient";

const CategoryCheckboxes = ({ note = null }) => {
    let checkboxes;
    const { categories, notes, setNotes } = useContext(DataContext);
    const [selectedCategory, setSelectedCategory] = useState([]);

    useEffect(() => {
        if (note) setSelectedCategory(note.includedIn);
        return () => {
            console.log('unmount');
            // (new HttpClient().put());
        }
    }, [note]);

    const categoryChecked = (categoryId, e) => {
        if (e.target.checked) { // if category checked
            note.includedIn.push(categoryId);
        } else { // if unchecked
            let index = note.includedIn.indexOf(categoryId);
            note.includedIn.splice(index, index+1);
        }
        setNotes([...(notes.map((item) => item.id === note.id ? note : item))]);
        // console.log(note.includedIn);
    };

    if (categories) {
        checkboxes = categories.slice(1, categories.length).map( // map each category into checkbox
            (category) => (
                <div key={ category.id }>
                    <input
                        type="checkbox"
                        className="input input--checkbox"
                        id={ category.name }
                        value={ category.name }
                        onChange={ (e) => note ? categoryChecked(category.id, e) : null }
                        defaultChecked={ note.includedIn.includes(category.id) }
                    />
                    <label htmlFor={ category.name }>
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
