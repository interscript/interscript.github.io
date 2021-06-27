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
      { "rstm-tree-item--active": isOpen },
      { "rstm-tree-item--focused": focused }
    )}
    style={{
      paddingLeft: `${DEFAULT_PADDING + ICON_SIZE * (hasNodes ? 0 : 1) + level * LEVEL_SPACE
        }rem`,
      ...style,
    }}
    role="button"
    aria-pressed={active}
    onClick={toggleNode}
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
    metadata
  }: {
    system: string;
    mapData: any;
    metadata: any;
  } = useRouteData();
  console.log(system, metadata[system]);
  const stagesTree = mapData.map(transformTree);
  return (
    <React.Fragment>
      <HeaderMenu />
      <div className="main-wrapper">
        {/* 
      Add TreeView */}
        <div className="first-column">

          <div className="label">
            <span>
              Authority ID
            </span>
          </div>
          <div className="value">
            <span>
              {metadata[system].data.authority_id}
            </span>
          </div>

          <div className="label">
            <span>
              Creation date
            </span>
          </div>
          <div className="value">
            <span>
              {metadata[system].data.creation_date}
            </span>
          </div>
          <div className="label">
            <span>
              Description
            </span>
          </div>
          <div className="value">
            <span>
              {metadata[system].data.description}
            </span>
          </div>
          <div className="label">
            <span>
              Destination script
            </span>
          </div>
          <div className="value">
            <span>
              {metadata[system].data.description_script}
            </span>
          </div>
          <div className="label">
            <span>
              Standard ID
            </span>
          </div>
          <div className="value">
            <span>
              {metadata[system].data.id}
            </span>
          </div>
          <div className="label">
            <span>
              Language
            </span>
          </div>
          <div className="value">
            <span>
              {metadata[system].data.language}
            </span>
          </div>
          <div className="label">
            <span>
              Name
            </span>
          </div>
          <div className="value">
            <span>
              {metadata[system].data.name}
            </span>
          </div>
          <div className="label">
            <span>
              Source script
            </span>
          </div>
          <div className="value">
            <span>
              {metadata[system].data.source_script}
            </span>
          </div>
          <div className="label">
            <span>
              Url
            </span>
          </div>
          <div className="value">
            <span>
              {metadata[system].data.url}
            </span>
          </div>
        </div>
        <div className="second-column">
          <TreeMenu data={stagesTree}>
            {({ search, items }) => (
              <ul className="tree">
                {items.map(({ key, ...props }) => (
                  <>
                    <ItemComponent key={key} {...props}>
                      {props.label === "Replace" && (
                        <div className="system-views">
                          <SystemView
                            dangerouslySetInnerHTML={{
                              __html: props.nodeData.from,
                            }}
                          /> {'->'}
                          <SystemView
                            dangerouslySetInnerHTML={{
                              __html: props.nodeData.to,
                            }}
                          />
                                                    {/* <SystemView
                            dangerouslySetInnerHTML={{
                              __html: props.nodeData.more,
                            }}
                          /> */}
                        </div>
                      )}
                    </ItemComponent>
                  </>
                ))}
              </ul>
            )}
          </TreeMenu>
        </div>

      </div>

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
