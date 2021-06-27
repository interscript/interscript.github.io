import React, { ReactNode, useEffect, useState } from "react";
import { useRouteData } from "react-static";
import styled from "styled-components";
import { Link } from "@reach/router";
import { HeaderMenu } from "../components/HeaderMenu";
import "../../node_modules/react-simple-tree-menu/dist/main.css";
import TreeMenu, {
  defaultChildren,
  ItemComponent,
  TreeMenuItem,
} from "react-simple-tree-menu";
import { InputField } from "components/InputField";
import classNames from "classnames";

interface InterscriptNode {
  class: string;
}
interface InterscriptGroup extends InterscriptNode {
  children: any[];
}

interface InterscriptRuleSub extends InterscriptNode {
  before: any;
  from: any;
  not_before: any;
}

// function InterscriptRuleSubComponent({ nodeData }: any) {
//   const Row = styled.div`
//     border: 2px #cccccc solid;
//   `;

//   const SystemView = styled.div`
//     width: 100vw;
//     position: absolute;
//     left: 5rem;
//     table,
//     th,
//     td {
//       border: 1px solid #0c0c0c;
//       border-collapse: collapse;
//     }
//   `;

//   console.log('render single sub', nodeData);

//   return (
//     <div>Unpack RuleSubComponent here</div>

//     // <SystemView dangerouslySetInnerHTML={{ __html: htmlData }} />
//   );
// }

const DEFAULT_PADDING = 0.75;
const ICON_SIZE = 2;
const LEVEL_SPACE = 1.75;

// const renderInterscriptNode = (item: InterscriptNode): any => {
//   if (item.class === "Interscript::Node::Rule::Sub") {
//     const data = item as InterscriptRuleSub;
//     // return from, after and other props
//     return (
//       <>
//         {data.from && <SingleItemComponent label="from" />}
//       </>
//     );
//   } else if (item.class === "Interscript::Node::Item::Group") {
//     return (item as InterscriptGroup).children.map((singleItem) => {
//       return renderInterscriptNode(singleItem);
//     })
//   }
// };

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

const SingleItemComponent: React.FunctionComponent<any> = ({
  hasNodes = false,
  isOpen = false,
  level = 0,
  onClick,
  toggleNode,
  active,
  focused,
  nodeData,
  openedIcon = "-",
  closedIcon = "+",
  label = "unknown",

  style = {},
}) => {
    console.log('rendering', nodeData);
  
  return (
    <div
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
      <label>{nodeData.class}</label>
      { nodeData.class === 'Interscript::Node::Rule::Sub' && (
        <>
          {/* <label>Interscript::Node::Rule::Sub</label> */}
          
          {nodeData.from && <div><label>from</label><SingleItemComponent 
            label="from"
            nodeData={nodeData.from}
            index={0}
            parent={nodeData}
            level={level+1}
            hasNodes={false}
            focused={nodeData.focused}
            toggleNode={toggleNode}
            /></div>
          }
          {nodeData.to && <div><label>to</label><SingleItemComponent 
            label="to"
            nodeData={nodeData.to}
            index={0}
            parent={nodeData}
            level={level+1}
            hasNodes={false}
            focused={nodeData.focused}
            toggleNode={toggleNode}
            />
            </div>
          }
          {nodeData.before && <div><label>before</label><SingleItemComponent 
            label="before"
            nodeData={nodeData.before}
            index={0}
            parent={nodeData}
            level={level+1}
            hasNodes={false}
            focused={nodeData.focused}
            toggleNode={toggleNode}
            />
            </div>
          }
          {nodeData.after && <div><label>after</label><SingleItemComponent 
            label="after"
            nodeData={nodeData.after}
            index={0}
            parent={nodeData}
            level={level+1}
            hasNodes={false}
            focused={nodeData.focused}
            toggleNode={toggleNode}
            />
            </div>
          }
        </>
      )}
            { nodeData.class === 'Interscript::Node::Group::Parallel' && (
        <>
          {/* <label>Interscript::Node::Group::Parallel</label> */}
          {nodeData.from && <SingleItemComponent 
            label="from"
            nodeData={nodeData.from}
            index={0}
            parent={nodeData}
            level={level+1}
            hasNodes={true}
            focused={nodeData.focused}
            />
      }
        </>
      )}
      { nodeData.class === 'Interscript::Node::Item::Group' && (
        <>
          {/* <label>Interscript::Node::Item::Group</label> */}
          {nodeData.children.map((item: any) => (
            <SingleItemComponent label={item.label}
            nodeData={item}
            openNodes={item.openNodes}
            isOpen={true}
            hasNodes={item.hasNodes}
            active={item.active}
            focused={item.focused}
            index={item.index}
            parent={item.parent}
            toggleNode={item.toggleNode}
            level={item.level+1}
            />
          ))}
        </>
      )}
      { nodeData.class === 'Interscript::Node::Item::Alias' && (
        <>
          {/* <label>Interscript::Node::Item::Alias</label> */}
          <p>Name: <span>{nodeData.name}</span></p>
        </>
      )}
      { nodeData.class === 'Interscript::Node::Item::String' && (
        <>
          <span style={{float: 'right'}}>{nodeData.data}</span>

        </>
      )}
            { nodeData.class === 'Interscript::Node::Rule::Funcall' && (
        <>
          <div>unwrap funcall</div>

        </>
      )}
    </div>
  );
};

function transformTree(stage: any): any {

  let node: any = {
    key: Math.random().toString(36).substring(7),
    label: stage.class,
    nodes: null,
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
  // console.log(system, mapData);
  const stagesTree = mapData.stages.main.children.map(transformTree);
  console.log('tree', stagesTree);
  console.log(mapData.stages.main);
  // const stagesTree = mapData.stages.main.children.map((stage) => {
  //   return {
  //     ke
  //   }
  // })
  return (
    <React.Fragment>
      <HeaderMenu />
      {/* Add TreeView */}
      <TreeMenu data={stagesTree}>
        {({ search, items }) => (
          <div>
            {/* <InputField
              onChange={(e) => search(e.target.value)}
              placeholder="Type and search"
            /> */}
            {items.map((item) => {
              return (

                <SingleItemComponent
                  label={item.label}
                  nodeData={item.nodeData}
                  openNodes={item.openNodes}
                  isOpen={item.isOpen}
                  hasNodes={item.hasNodes}
                  active={item.active}
                  focused={item.focused}
                  index={item.index}
                  parent={item.parent}
                  toggleNode={item.toggleNode}
                  level={item.level}
                />
              )
            }
            )}
            {/* {defaultChildren({ search, items })} */}
          </div>
        )}
      </TreeMenu>
    </React.Fragment>
  );
};
