import React, { useContext, useEffect, useRef } from 'react';
import { UIContext } from '../../../../contexts';

const Column = ({ children }) => {
    const thisColumn = useRef();
    const { column } = useContext(UIContext);

    useEffect(() => {
        const columnList = column.list;
        columnList.push(thisColumn.current);
        column.setList(columnList);
    }, [column.list]);

    return (
      <div className="column" ref={ thisColumn }>
          { children }
      </div>
    );
};

export default Column;
