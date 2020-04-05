import React, { useContext, useEffect, useState } from 'react';
import './NotesList.scss';
import { UIContext } from '../../contexts';
import Note from '../Note';
import Column from './components/Column';

const NotesList = ({ displayedNotes }) => {
    const [view, setView] = useState(null);
    const { column } = useContext(UIContext);
    const [notesListWidth, setNotesListWidth] = useState(null);
    const [columnCount, setColumnCount] = useState(0);
    const [$columns, $setColumns] = useState([]);
    const [displayedNotesCount, setDisplayedNotesCount] = useState(0);
    const maxColumnWidth = 300;

    function debounce(f, wait, immediate) { // debounce function to avoid too many event listener function executions
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) f.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) f.apply(context, args);
        };
    }

    const updateNotesListWidth = debounce(function(){ // debounced function to set (get) NotesList width
        setNotesListWidth(document.querySelector('.notes-list').offsetWidth);
    }, 100);

    useEffect(() => {
        setNotesListWidth(document.querySelector('.notes-list').offsetWidth); // set initial NotesList width
        window.addEventListener('resize', updateNotesListWidth); // add listener
    }, []);

    useEffect(() => {
        if (notesListWidth) { // when NoteList width changes
            setColumnCount(Math.max(Math.floor(notesListWidth / maxColumnWidth), 1)); // set amount of columns
        }
    }, [notesListWidth]);

    useEffect(() => { // changes on columnCount change or when displayedNotes are received / changed
        if (displayedNotes) {const _$columns = []; // temporary $columns
            for (let i = 0; i < columnCount; i++) { // add note to each column (if there is enough)
                if (displayedNotes[i]) { // if i-th note exists, add it to i-th column
                    _$columns.push([<Note data={ displayedNotes[i] } key={ i } />]);
                } else _$columns.push([]);
            }
            setDisplayedNotesCount(columnCount); // displayed notes should be now maximum of number of columns
            $setColumns(_$columns); // set $columns
        }
    }, [columnCount, displayedNotes]);

    useEffect(() => { // when visible notes count, column count or $columns change
        if (displayedNotes) {
            const _view = []; // temporary view (reset)
            for (let i = 0; i < columnCount; i++) {
                _view.push( // add columns (and their children) to temporary view
                    <Column key={ i }>
                        { $columns[i] }
                    </Column>
                );
            }
            setView(_view); // update view - this will trigger effect adding another note
        }
    }, [displayedNotesCount, columnCount, $columns]);

    useEffect(() => { // when column count, view or column.list changes
        const columnsRendered = column.list.every(item => item.offsetHeight !== 0);
        if (columnsRendered && $columns.length && displayedNotesCount !== displayedNotes.length) {
            const _columnsHeight = column.list.map((columnReference) => columnReference.offsetHeight); // get heights
            const $updatedColumns = $columns; // copy $columns
            $updatedColumns[_columnsHeight.indexOf(Math.min(..._columnsHeight))] // add next note to the shortest $column
                .push(<Note data={ displayedNotes[displayedNotesCount] } key={ displayedNotesCount } />);
            setDisplayedNotesCount(displayedNotesCount + 1); // increment displayed (visible) notes
            $setColumns($updatedColumns); // update $columns - this will trigger effect causing setView
            // these two effect will continue triggering each other until displayNotesCount === displayNotes.length
            // or in other words, until all notes are displayed
        }
    }, [columnCount, view, column.list]);

    useEffect(() => { // when columnCount changes - used to re-render notes when amount of columns changes
        if (column.list.length > columnCount) { // if columns number is reduced
            const columnList = column.list;
            columnList.length = columnCount; // cut column.list to length equal columnCount, e.g. 5 -> 3, length=3
            column.setList(columnList); // update column.list - this again triggers effect adding another note
        }
    }, [columnCount]);

    return (
        <div className="notes-list">
            { view }
        </div>
    );
};

export default NotesList;
