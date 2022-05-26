import React from 'react';
import { Genealogy } from './Genealogy';

export const TreeTeamView = ({
  response,
  isTree,
  searchNode,
  handleSentData,
  reloadData,
  setTreeGroup,
  setopenAddDialog,
}) => (
  <>
    <div className='businessGroupsTreeView'>
      {response && response.filter && (
        <div className='treePaper'>
          <div className='genealogy-tree'>
            <ul
              className={`${response && response.length > 4 ? 'more' : ''}`}
            >
              {response
                .filter((item) => item.businessGroupsParentId === null)
                .map((node, i) => (
                  <Genealogy
                    key={i}
                    isVisible
                    Parent={node}
                    isTree={isTree}
                    response={response}
                    searchNode={searchNode}
                    handleSentData={handleSentData}
                    reloadData={() => reloadData()}
                    setTreeGroup={(x) => setTreeGroup(x)}
                    setopenAddDialog={() => setopenAddDialog()}
                  />
                ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  </>
);
