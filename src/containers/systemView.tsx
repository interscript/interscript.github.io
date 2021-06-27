import React, { ReactNode, useEffect, useState } from "react";
import { useRouteData } from "react-static";
import styled from "styled-components";
import { Link } from "@reach/router";
import { HeaderMenu } from "../components/HeaderMenu";
import "../../node_modules/react-simple-tree-menu/dist/main.css";
import TreeMenu, {
  defaultChildren,
  TreeMenuItem,
} from "react-simple-tree-menu";
import classNames from "classnames";
import "./systemView.css";

const treeData = [
  {
    key: "first-level-node-1",
    label: "Node 1 at the first level",
    nodes: [
      {
        key: "second-level-node-1",
        label: "Node 1 at the second level",
        nodes: [
          {
            key: "third-level-node-1",
            label: "Last node of the branch",
          },
        ],
      },
    ],
  },
  {
    key: "first-level-node-2",
    label: "Node 2 at the first level",
  },
];

const DEFAULT_PADDING = 0.75;
const ICON_SIZE = 2;
const LEVEL_SPACE = 1.75;

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

const ToggleIcon = ({
  on,
  openedIcon,
  closedIcon,
}: {
  on: boolean;
  openedIcon: ReactNode;
  closedIcon: ReactNode;
}) => (
  <div role="img" aria-label="Toggle" className="rstm-toggle-icon-symbol">
    {on ? openedIcon : closedIcon}
  </div>
);

const ItemComponent: React.FunctionComponent<TreeMenuItem> = ({
  hasNodes = false,
  isOpen = false,
  level = 0,
  onClick,
  toggleNode,
  active,
  focused,
  openedIcon = "-",
  closedIcon = "+",
  label = "unknown",
  children,
  style = {},
}) => (
  <li
    className={classNames(
      "rstm-tree-item",
      `rstm-tree-item-level${level}`,
      { "rstm-tree-item--active": active },
      { "rstm-tree-item--focused": focused }
    )}
    style={{
      paddingLeft: `${
        DEFAULT_PADDING + ICON_SIZE * (hasNodes ? 0 : 1) + level * LEVEL_SPACE
      }rem`,
      ...style,
    }}
    role="button"
    aria-pressed={active}
    onClick={onClick}
  >
    {hasNodes && (
      <div
        className="rstm-toggle-icon"
        onClick={(e) => {
          hasNodes && toggleNode && toggleNode();
          e.stopPropagation();
        }}
      >
        <ToggleIcon
          on={isOpen}
          openedIcon={openedIcon}
          closedIcon={closedIcon}
        />
      </div>
    )}
    {label}
    {children}
  </li>
);

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
            {items.map(({ key, ...props }) => (
              <>
                <Item>
                  <ItemComponent key={key} {...props}>
                    {props.label === "Replace" && (
                      <div className="system-views">
                        <SystemView
                          dangerouslySetInnerHTML={{
                            __html: props.nodeData.from,
                          }}
                        />
                      <SystemView
                        dangerouslySetInnerHTML={{
                          __html: props.nodeData.to,
                        }}
                      />
                      </div>
                    )}
                  </ItemComponent>
                </Item>
              </>
            ))}
          </ul>
        )}
      </TreeMenu>
    </React.Fragment>
  );
};

const SystemView = styled.div`

  left: 5rem;
  table,
  th,
  td {
    border: 1px solid;
    border-collapse: collapse;
  }
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
`;
