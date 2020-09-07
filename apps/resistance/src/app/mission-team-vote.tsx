import React from 'react';

interface MisstionTeamVoteProps {
  onApprove: () => void;
  onReject: () => void;
}

export const MissionTeamVote: React.FC<MisstionTeamVoteProps> = ({ onApprove, onReject }) => {

  return (
    <>
      <button onClick={onApprove}>Approve</button>
      <button onClick={onReject}>Reject</button>
    </>
  )
}
