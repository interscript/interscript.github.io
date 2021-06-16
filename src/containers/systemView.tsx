import React from 'react';
import { useRouteData } from 'react-static';
import styled from 'styled-components';
import { Link } from '@reach/router';

export default () => {
  const {
    system,
    htmlData,
  }: {
    system: string;
    htmlData: string;
  } = useRouteData();

  console.log(system);
  return (
    <React.Fragment>
      <Link to='/system/'>Back to List</Link>
      <SystemView dangerouslySetInnerHTML={{ __html: htmlData }} />
    </React.Fragment>
  );
};

const SystemView = styled.div`
  width: 100vw;
  position: absolute;
  left: 5rem;
  table,
  th,
  td {
    border: 1px solid;
    border-collapse: collapse;
  }
`;
