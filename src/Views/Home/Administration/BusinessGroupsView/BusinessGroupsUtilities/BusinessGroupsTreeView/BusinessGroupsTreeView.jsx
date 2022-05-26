import React from 'react';
import Genealogy from './Genealogy';

const TreeViewGroups = (props) =>
// const filterByParents = (props.response && props.response.result && props.response.result.length > 0 && props.response.result.filter((item) => !item.businessGroupsParentId).length > 3);
(
  <div className='businessGroupsTreeView'>
    {props.response && props.response.result && (
      <div className='treePaper'>
        <div className='genealogy-tree'>
          <ul className={(props.response.totalCount > 4) ? 'more' : ''}>
            {props.response &&
              props.response.result
                .filter((item) => item.businessGroupsParentId === null)
                .map((node, i) => (
                  <Genealogy
                    key={i}
                    Parent={node}
                    isVisible
                    isTree={props.isTree}
                    response={props.response}
                    searchNode={props.searchNode}
                    handleSentData={props.handleSentData}
                    reloadData={() => props.reloadData()}
                    setTreeGroup={(x) => props.setTreeGroup(x)}
                    setopenAddDialog={() => props.setopenAddDialog()}
                  />
                ))}
          </ul>
        </div>
      </div>
    )}
  </div>
);
export default TreeViewGroups;
