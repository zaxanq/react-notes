import React, {useContext, useState} from 'react';
import './SingleNote.scss';
import { UIContext } from '../../contexts';
import Button from '../Shell/components/Button/Button';
import Lang from "../../assets/i18n/en";

const SingleNote = () => {
    const [categoriesListVisible, setCategoriesListVisible] = useState(false);
    const { singleNote, common } = useContext(UIContext);
    const displayedNote = singleNote.selected;

    const onEdit = () => {
        console.log('edit note');
    };

    const onDelete = () => {
        console.log('delete note');
    };

    const note = (
        <div
            className="absolute-container single-note-container"
            onClick={ () => singleNote.clear() }
        >
            <article
                className="single-note note"
                onClick={ (e) => e.stopPropagation() }
            >
                <div className="single-note__toolbar">
                    <ul className="single-note__options">
                        <li>
                            <Button
                                type="button"
                                buttonStyle="icon edit"
                                className="single-note__button--edit"
                                onClick={ () => onEdit() }
                            />
                        </li>
                        <li>
                            <Button
                                type="button"
                                buttonStyle="icon delete"
                                className="single-note__button--delete"
                                onClick={ () => onDelete() }
                            />
                        </li>
                    </ul>
                    <div className="note-categories" onClick={ () => setCategoriesListVisible(!categoriesListVisible) }>
                        <button className="button button--outlined note-categories__button">{ Lang.common.categories }</button>
                        { categoriesListVisible ?
                            <ul className="note-categories__list">
                                { common.categoryCheckboxes }
                            </ul> :
                            ''
                        }
                    </div>
                </div>
                <h3 className="title--with-underline single-note__title note__title">{ displayedNote?.title }</h3>
                <p className="single-note__contents note__contents">{ displayedNote?.contents }</p>
            </article>
        </div>

    );

    return singleNote.visible ? note : '';
};

export default SingleNote;
