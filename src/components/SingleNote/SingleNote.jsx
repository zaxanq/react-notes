import React, {useContext, useState} from 'react';
import './SingleNote.scss';
import { UIContext } from '../../contexts';
import Button from '../Shell/components/Button/Button';
import Lang from "../../assets/i18n/en";
import CategoryCheckboxes from "../Shell/components/CategoryCheckboxes";

const SingleNote = () => {
    const [categoriesListVisible, setCategoriesListVisible] = useState(false);
    const { singleNote } = useContext(UIContext);
    const displayedNote = singleNote.selected;

    const closeNote = () => {
        singleNote.clear();
        setCategoriesListVisible(false);
    };

    const onEdit = () => {
        console.log('edit note');
    };

    const onQuickEdit = () => {
        console.log('quick-edit note');
    };

    const onDelete = () => {
        console.log('delete note');
    };

    const onSingleNoteClick = (e) => {
        e.stopPropagation();
        setCategoriesListVisible(false);
    };

    const onCategoriesClick = (e) => {
        e.stopPropagation();
        setCategoriesListVisible(!categoriesListVisible);
    };

    const note = (
        <div
            className="absolute-container single-note-container"
            onClick={ () => closeNote() }
        >
            <article
                className="single-note note"
                onClick={ (e) => onSingleNoteClick(e) }
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
                    <div className="note-categories" onClick={ (e) => onCategoriesClick(e) }>
                        <button className="button button--outlined note-categories__button">{ Lang.common.categories }</button>
                        { categoriesListVisible ?
                            <div
                                className="note-categories__list"
                                onClick={ (e) => e.stopPropagation() }
                            >
                                <CategoryCheckboxes note={ displayedNote } />
                            </div> :
                            ''
                        }
                    </div>
                </div>
                <h3
                    className="title--with-underline single-note__title note__title"
                    onDoubleClick={ () => onQuickEdit() }
                >{ displayedNote?.title }</h3>
                <p className="single-note__contents note__contents">{ displayedNote?.contents }</p>
            </article>
        </div>

    );

    return singleNote.visible ? note : '';
};

export default SingleNote;
