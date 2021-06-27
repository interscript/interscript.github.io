import React, { useEffect, useState } from 'react';
import { useRouteData } from 'react-static';
import styled from 'styled-components';
import { Link } from '@reach/router';
import { HeaderMenu } from '../components/HeaderMenu';
import '../../node_modules/react-simple-tree-menu/dist/main.css';
import TreeMenu, { defaultChildren, ItemComponent } from 'react-simple-tree-menu';

const treeData = [
  {
    key: 'first-level-node-1',
    label: 'Node 1 at the first level',
    nodes: [
      {
        key: 'second-level-node-1',
        label: 'Node 1 at the second level',
        nodes: [
          {
            key: 'third-level-node-1',
            label: 'Last node of the branch',
          },
        ],
      },
    ],
  },
  {
    key: 'first-level-node-2',
    label: 'Node 2 at the first level',
  },
];

function transformTree(stage: any): any {

  let node: any = {
    key: Math.random().toString(36).substring(7),
    label: stage.type,
    children: null,
    nodeData: null,
  };

  if (stage.children) {
    node.nodes = stage.children.map(transformTree);
  }
  delete stage.children;
  node.nodeData = stage;

  return node;
}

export default () => {
  const {
    system,
    mapData,
  }: {
    system: string;
    mapData: any;
  } = useRouteData();
  console.log(system, mapData);
  const stagesTree = mapData.map(transformTree);
  console.log(stagesTree);
  return (
    <React.Fragment>
      <HeaderMenu />
      {/* Add TreeView */}
      <TreeMenu data={stagesTree}>
        {({ search, items }) => (
        <ul>
          {items.map(({key, ...props}) => (
            <>
            {console.log(props)}
            <ItemComponent key={key} {...props} />
            { props.label === 'Replace' && <div>unwrap replace</div>}
            </>
          ))}
        </ul>
        )}
      </TreeMenu>
      {/* <SystemView dangerouslySetInnerHTML={{ __html: htmlData }} /> */}
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
