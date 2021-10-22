import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';

// Data
import { PLAYER_FIELDS } from '../../../lib/queries/player.queries';

// Components
import EditPlayerContainer from './edit-player.container';
import { IEditPlayerProps } from './edit-player.interface';

const GET_EDIT_PLAYER = gql`
  query GetEditPlayer($playerId: ID!) {
    player(_id: $playerId) {
      ...PlayerFields
    }
  }

  ${PLAYER_FIELDS}
`;

const UPDATE_PLAYER = gql`
  mutation UpdatePlayer($_id: ID!, $data: UpdatePlayerInput!) {
    updatePlayer(_id: $_id, data: $data) {
      ...PlayerFields
    }
  }

  ${PLAYER_FIELDS}
`;

interface IEditPlayerGraphQL {
  playerId: string;
}

const EditPlayerGraphQL: React.FC<IEditPlayerGraphQL> = ({ playerId }) => {
  const { data, loading, error } = useQuery(GET_EDIT_PLAYER, {
    variables: { playerId },
    fetchPolicy: 'cache-and-network'
  });

  const player = data && data.player;

  const [mutation]  = useMutation(UPDATE_PLAYER);

  const updatePlayerMutation = (data: IEditPlayerProps) => mutation({
    variables: { data, _id: playerId },
    optimisticResponse: {
      __typename: 'Mutation',
      updatePlayer: {
        __typename: 'Player',
        ...data
      }
    }
  });

  return <EditPlayerContainer
    player={player}
    updatePlayerMutation={updatePlayerMutation}
    loading={loading}
    fetchError={Boolean(error)}
  />;
};

export default EditPlayerGraphQL;
