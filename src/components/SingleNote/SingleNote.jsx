import React, { useContext, useEffect, useRef, useState } from 'react';
import './SingleNote.scss';
import { DataContext, UIContext } from '../../contexts';
import Button from '../Shell/components/Button/Button';
import Lang from '../../assets/i18n/en';
import CategoryCheckboxes from '../Shell/components/CategoryCheckboxes';

const SingleNote = () => {
    /*  Available edit scenarios: (qEM = quickEditMode, fEM = fullEditMode)
        * double click on title -> qEM=true
            when blur, cancels -> qEM=false
            when submitted (enter) -> sends request -> qEM=false
        * double click on content -> qEM=true
            when blur -> sends request -> qEM=false
            when cancelled (esc/cancel button) -> qEM=false
        * click on edit button -> fEM=true
            when title input blur -> nothing happens
            when content textarea blur -> nothing happens
            when title blur onto save button -> send request -> fEM=false
            when content blur onto save button -> send request -> fEM=false
            when cancelled (cancel button) -> fEM=false
    */
    const { singleNote, snackbar } = useContext(UIContext);
    const { update } = useContext(DataContext);

    const [edited, setEdited] = useState({ title: false, content: false });
    const [quickEditMode, setQuickEditMode] = useState(false);
    const [fullEditMode, setFullEditMode] = useState(false);

    const [categoriesListVisible, setCategoriesListVisible] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const displayedNote = singleNote.selected;

    const titleInputRef = useRef();
    const contentTextareaRef = useRef();
    let newTitle = displayedNote?.title;
    let newContent = displayedNote?.content;

    const noteContent = displayedNote?.content.length > 0 ?
        displayedNote?.content :
        <span className="italic note__no-content">No contents.</span>;

    useEffect(() => {
        if (titleInputRef.current) titleInputRef.current.focus();
    }, [edited.title]);

    useEffect(() => {
        if (contentTextareaRef.current && !edited.title) {
            contentTextareaRef.current.parentNode.style.height = `${contentHeight}px`;
            contentTextareaRef.current.focus();
        }
    }, [edited.content]);

    const onSingleNoteClick = (e) => {
        e.stopPropagation();
        setCategoriesListVisible(false);
    };

    const onCategoriesClick = (e) => {
        e.stopPropagation();
        setCategoriesListVisible(!categoriesListVisible);
    };

    const onDelete = (e) => { // on delete icon click
        if (e) e.stopPropagation();
        deleteNote();
    };

    const deleteNote = () => {
        displayedNote.deleted = true;

        update.note(displayedNote).then(() => {
            snackbar.show(Lang.notifications.noteRemoved, 'delete-confirmation');
            closeNote(); // close the deleted note
        });
    };

    const closeNote = () => {
        clearEdited(); // clear edited fields
        setQuickEditMode(false); // end quick-edit mode
        setFullEditMode(false); // end full-edit mode
        setCategoriesListVisible(false); // hide categories dropdown
        singleNote.setVisible(false); // hide single note
    };

    const onQuickEdit = (e, element) => { // when double clicked on title or content
        e.stopPropagation();
        setQuickEditMode(true); // set quick-edit mode
        if (element === 'content') { // if content quick-edited, set textarea height to content height
            setContentHeight(document.querySelector('.single-note__content').offsetHeight);
        }
        setEdited({ ...edited, [element]: true }); // set edited mode for edited element
    };

    const onFullEdit = () => { // when edit icon clicked (full edit)
        setFullEditMode(true); // set full-edit mode
        setEdited({ title: true, content: true }); // both elements are now editable
    };

    const onContentChange = (e) => newContent = e.target.value; // pass new content value to variable

    const onContentKeyDown = (e) => e.key === 'Escape' ? onCancel(e) : null; // cancel on Escape

    const onCancel = (e, element, forceClose) => {
        if (fullEditMode) {
            if (e.relatedTarget === document.querySelector('.single-note__content-save') && fullEditMode) {
                displayedNote.title = newTitle;
                displayedNote.content = newContent;

                update.note(displayedNote).then(() => clearEdited());
            }
            else if (e.relatedTarget === document.querySelector('.single-note__content-cancel') || forceClose) {
                // forceClose will close the edition on casual button click
                clearEdited(); // cancel button pressed in onCancel will only happen in fullEditMode
            }
        }
        if (!fullEditMode) {
            setQuickEditMode(false);
            if (element) clearEdited(element);
            else clearEdited(); // stop editing both fields
        }
    };

    const clearEdited = (element = null) => { // clear edited for an element or for all if none specified
        if (quickEditMode && element) {
            setEdited({ ...edited, [element]: false });
            setQuickEditMode(false);
        }
        else if (fullEditMode) {
            setEdited({ title: false, content: false });
            setFullEditMode(false);
        }
        else setEdited({ title: false, content: false });
    };

    const onTextareaBlur = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.relatedTarget === document.querySelector('.single-note__content-cancel')) {
            quickEditMode ? clearEdited('content') : clearEdited();
        }
        else if (displayedNote.content !== newContent && quickEditMode) { // if new content and quick-edit mode
            displayedNote.content = newContent;

            update.note(displayedNote).then(() => clearEdited('content'));
        }
        else if (e.relatedTarget === document.querySelector('.single-note__content-save') && fullEditMode) {
            displayedNote.title = newTitle;
            displayedNote.content = newContent;

            update.note(displayedNote).then(() => clearEdited());
        }
        else if (!fullEditMode) {
            clearEdited();
        }
    };

    const onTitleSubmit = (e) => {
        e.preventDefault();
        if (newTitle === '' && newContent === '') {
            deleteNote();
        } else if (displayedNote.title !== newTitle) {
            if (fullEditMode && displayedNote.content !== newContent) displayedNote.content = newContent;
            displayedNote.title = newTitle;

            update.note(displayedNote).then(() => clearEdited('title'));
        } else clearEdited();
    };

    const titleHeading = (
        <h3
            className="title--with-underline single-note__title note__title"
            onDoubleClick={ (e) => onQuickEdit(e, 'title') }
        >{ displayedNote?.title }</h3>
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
                   onBlur={ (e) => onCancel(e,'title') }
            />
        </form>
    );

    const contentParagraph = (
        <p
            className="single-note__content note__content"
            onDoubleClick={ (e) => onQuickEdit(e, 'content') }
        >{ noteContent }</p>
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
                   onKeyDown={ (e) => onContentKeyDown(e) }
                   onBlur={ (e) => onTextareaBlur(e) }
            />
            <Button
                type="button"
                buttonStyle="icon cancel"
                className="single-note__content-cancel"
                onClick={ (e) => onCancel(e,'content', true) }
            />
            { fullEditMode ?
            <Button
                type="button"
                buttonStyle="icon save"
                className="single-note__content-save"
                onClick={ (e) => onTextareaBlur(e) }
            /> : '' }

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
                                onClick={ () => onFullEdit() }
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
                { edited.title ? titleInput : titleHeading }
                { edited.content ? contentTextarea : contentParagraph }
            </article>
        </div>
    );

    return singleNote.visible ? note : '';
};

export default SingleNote;
