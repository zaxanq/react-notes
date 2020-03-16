import React, { useContext, useEffect, useRef, useState } from 'react';
import './SingleNote.scss';
import { DataContext, UIContext } from '../../contexts';
import Button from '../Shell/components/Button/Button';
import Lang from '../../assets/i18n/en';
import CategoryCheckboxes from '../Shell/components/CategoryCheckboxes';
import HttpClient, { Api } from '../../services/HttpClient';

const SingleNote = () => {
    const { singleNote } = useContext(UIContext);
    const { notes, setNotes } = useContext(DataContext);
    const [categoriesListVisible, setCategoriesListVisible] = useState(false);
    const [editMode, setEditMode] = useState({ title: false, content: false });
    const [contentHeight, setContentHeight] = useState(0);
    const displayedNote = singleNote.selected;

    const titleInputRef = useRef();
    const contentTextareaRef = useRef();
    let newTitle = '';
    let newContent = displayedNote?.content;

    const noteContent = displayedNote?.content.length > 0 ?
        displayedNote?.content :
        <span className="italic note__no-content">No contents.</span>;

    const clearEditMode = () => setEditMode({ title: false, content: false });

    useEffect(() => {
        if (titleInputRef.current) titleInputRef.current.focus();
    }, [editMode.title]);

    useEffect(() => {
        if (contentTextareaRef.current) {
            contentTextareaRef.current.parentNode.style.height = `${contentHeight}px`;
            contentTextareaRef.current.focus();
        }
    }, [editMode.content]);

    const deleteNote = () => {
        displayedNote.deleted = true;

        (new HttpClient().put(
            `${ Api.Notes }/${ displayedNote.id }`,
            displayedNote,
        ).then(() => {
            setNotes([...notes], displayedNote);
            closeNote(); // close the deleted note
        }));
    };

    const closeNote = () => {
        singleNote.clear();
        clearEditMode();
        setCategoriesListVisible(false);
    };

    const onEdit = () => {
        setEditMode({ title: true, content: true });
    };

    const onQuickEdit = (e, element) => {
        e.stopPropagation();
        if (element === 'content') setContentHeight(document.querySelector('.single-note__content').offsetHeight);
        setEditMode({ ...editMode, [element]: true });
    };

    const onTitleSubmit = (e) => {
        e.preventDefault();
        if (newTitle === '' && newContent === '') {
            deleteNote();
        } else if (displayedNote.title !== newTitle) {
            displayedNote.title = newTitle;

            (new HttpClient().put(
                `${ Api.Notes }/${ displayedNote.id }`,
                displayedNote,
            ).then(() => {
                setNotes([...notes], displayedNote);
                clearEditMode();
            }));
        } else clearEditMode();
    };

    const onCancel = () => {
        clearEditMode();
    };

    const onTextareaBlur = (e) => {
        if (e.relatedTarget === document.querySelector('.single-note__content-cancel')) {
            clearEditMode();
        } else if (displayedNote.content !== newContent) {
            displayedNote.content = newContent;

            (new HttpClient().put(
                `${ Api.Notes }/${ displayedNote.id }`,
                displayedNote,
            ).then(() => {
                setNotes([...notes], displayedNote);
                clearEditMode();
            }));
        } else clearEditMode();
    };

    const onContentChange = (e) => {
        newContent = e.target.value;
    };

    const onKeyDown = (e) => e.key === 'Escape' ? onCancel() : null;

    const onDelete = (e) => {
        if (e) e.stopPropagation();
        deleteNote();
    };

    const onSingleNoteClick = (e) => {
        e.stopPropagation();
        setCategoriesListVisible(false);
    };

    const onCategoriesClick = (e) => {
        e.stopPropagation();
        setCategoriesListVisible(!categoriesListVisible);
    };

    const titleHeading = (
        <h3
            className="title--with-underline single-note__title note__title"
            onDoubleClick={ (e) => onQuickEdit(e, 'title') }
        >
            { displayedNote?.title }
        </h3>
    );

    const titleInput = (
        <form
            className="title--with-underline single-note__title note__title h3"
            onSubmit={ (e) => onTitleSubmit(e) }
        >
            <input type="text"
                   ref={ titleInputRef }
                   className="input input--transparent h3 single-note__title-input"
                   defaultValue={ displayedNote?.title }
                   onClick={ (e) => e.stopPropagation() }
                   onChange={ (e) => newTitle = e.target.value }
                   onBlur={ (e) => onCancel(e) }
            />
        </form>
    );

    const contentParagraph = (
        <p
            className="single-note__content note__content"
            onDoubleClick={ (e) => onQuickEdit(e, 'content') }
        >
            { noteContent }
        </p>
    );

    const contentTextarea = (
        <form
            className="single-note__content-form"
        >
            <textarea
                   ref={ contentTextareaRef }
                   className="input input--transparent single-note__content-textarea"
                   defaultValue={ displayedNote?.content }
                   onClick={ (e) => e.stopPropagation() }
                   onChange={ (e) => onContentChange(e) }
                   onKeyDown={ (e) => onKeyDown(e) }
                   onBlur={ (e) => onTextareaBlur(e) }
            />
            <Button
                type="reset"
                buttonStyle="icon cancel"
                className="single-note__content-cancel"
                onClick={ (e) => onCancel(e) }
            />

        </form>
    );

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
                { editMode.title ? titleInput : titleHeading }
                { editMode.content ? contentTextarea : contentParagraph }
            </article>
        </div>

    );

    return singleNote.visible ? note : '';
};

export default SingleNote;
