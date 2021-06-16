import React from 'react';
import { useRouteData } from 'react-static';
import { Link } from '@reach/router';

const SystemList = () => {
  const {
    mapsInfo,
  }: {
    mapsInfo: any;
  } = useRouteData();

  console.log(mapsInfo);
  const list = mapsInfo.data.sort().map((system: string) => (
    <li>
      <Link to={`/system/${system}`} key={system}>
        {system}
      </Link>
    </li>
  ));

  return (
    <div>
      <Link to='/'>Home</Link>
      <h1>System List : {mapsInfo.meta.total} </h1>
      <ul>{list}</ul>
    </div>
  );
};

export default SystemList;
