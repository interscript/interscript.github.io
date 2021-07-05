import classNames from "classnames";
import { getLanguageTitleFrom6392or3 } from "components/isoLang";
import React, { ReactNode } from "react";
import TreeMenu, {
  TreeMenuItem
} from "react-simple-tree-menu";
import { useRouteData } from "react-static";
import styled from "styled-components";
import "../../node_modules/react-simple-tree-menu/dist/main.css";
import { HeaderMenu } from "../components/HeaderMenu";
import { InterscriptMetaData, InterscriptMetaDataMap } from "../meta";
import "./systemView.css";

const DEFAULT_PADDING = 0.75;
const ICON_SIZE = 2;
const LEVEL_SPACE = 1.75;
const RULE_SHOW_LIMIT = 100;

function transformTree(stage: any): any {
  let node: any = {
    key: Math.random().toString(36).substring(7),
    label: stage.type,
    children: null,
    nodeData: null,
  };

  if (stage.children) {
    node.nodes = stage.children.slice(0, RULE_SHOW_LIMIT).map(transformTree);
  }
  // delete stage.children;
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
}) => (
  <li
    className={classNames(
      "rstm-tree-item",
      `rstm-tree-item-level${level}`,
      { "rstm-tree-item--active": isOpen },
      { "rstm-tree-item--focused": focused }
    )}
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
    {label === "Replace" ? " " : label}
    {children}
  </li>
);

const SYSTEM_METADATA = [
  {
    caption: "Authority ID",
    field: "authorityId",
  },
  {
    caption: "Standard ID",
    field: "id",
  },
  {
    caption: "Language",
    field: "language",
  },
  {
    caption: "Source Script",
    field: "sourceScript",
  },
  {
    caption: "Destination Script",
    field: "destinationScript",
  },
  {
    caption: "Name",
    field: "name",
  },
  {
    caption: "URL",
    field: "url",
  },
  {
    caption: "Description",
    field: "description",
  },
];
export default () => {
  const {
    system,
    mapData,
    metaDataMap,
  }: {
    system: string;
    mapData: any;
    metaDataMap: InterscriptMetaDataMap;
  } = useRouteData();

  const stagesTree = mapData.map(transformTree);
  const systemMetaData: InterscriptMetaData = metaDataMap[system];
  console.log(system, systemMetaData);
  
  const metaFieldDelegate = (type: string) => {
    switch (type) {
      case "url":
        return (
          <a href={systemMetaData.url} target="_blank">
            {systemMetaData.url}
          </a>
        );
      case "language":
        const code = systemMetaData.language?.split(":")[1];
        return getLanguageTitleFrom6392or3(code);
      default:
        // @ts-ignore
        return systemMetaData[type] || "";
    }
  };

  const metaInfo = SYSTEM_METADATA.map((info) => (
    <tr key={info.field}>
      <td>{info.caption}</td>
      <td>{metaFieldDelegate(info.field)}</td>
    </tr>
  ));

  return (
    <React.Fragment>
      <HeaderMenu />
      <h3>System Name: {system}</h3>
      <SystemMetaInfo>
        <tbody>{metaInfo}</tbody>
      </SystemMetaInfo>
      <div className="main-wrapper">
        <div className="chart-header">
          <Sub>{systemMetaData.sourceScript}</Sub>
          <Sub>{systemMetaData.destinationScript}</Sub>
          <Sub>{"Condition"}</Sub>
        </div>
        {/*
      Add TreeView */}
        <div className="second-column">
          <TreeMenu data={stagesTree}>
            {({ search, items }) => (
              <ul className="tree">
                {items.map(({ key, ...props }) => (
                  <ItemComponent key={key} {...props}>
                    {props.label === "Replace" && (
                      <div className="system-views">
                        <Sub
                          dangerouslySetInnerHTML={{
                            __html: props.nodeData.from,
                          }}
                        />
                        <Sub
                          dangerouslySetInnerHTML={{
                            __html: props.nodeData.to,
                          }}
                        />
                        <Sub
                          dangerouslySetInnerHTML={{
                            __html: props.nodeData.more,
                          }}
                        />
                      </div>
                    )}
                    {props.label === "Run" && (
                      <a
                        href={`/systems/${props.nodeData.doc}`}
                        target="_blank"
                      >
                        {" " + props.nodeData.doc}
                      </a>
                    )}
                  </ItemComponent>
                ))}
              </ul>
            )}
          </TreeMenu>
        </div>
      </div>
    </React.Fragment>
  );
};

const Sub = styled.div`
  left: 5rem;
  flex: 1;
  table,
  th,
  td {
    border: 1px solid;
    border-collapse: collapse;
  }
  ruby {
    font-weight: bold;
    rt {
      font-size: 9px;
    }
    kbd {
      white-space: pre;
    }
    &::after {
      content: " ";
      white-space: pre;
    }
  }
  text-align: center;
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
`;

const SystemMetaInfo = styled.table`
  border-collapse: collapse;
  tr {
    display: flex;
    flex: row;
    td {
      flex: 1;
      border: 1px solid;
      padding: 1rem 0.75rem;
    }
    td:nth-child(2) {
      flex: 2;
    }
  }
`;
