import { gql } from "@apollo/client";

export const GET_USER_TODOS = gql`
  query GetUserTodos($userId: uuid!) {
    todos(where: { user_id: { _eq: $userId } }) {
      id
      title
      completed
      created_at
      updated_at
      file_id
    }
  }
`;

//   MUTATIONS   //

export const CREATE_TODO = gql`
  mutation MyMutation($title: String!, $file_id: uuid, $user_id: uuid!) {
    insert_todos_one(
      object: { title: $title, file_id: $file_id, user_id: $user_id }
    ) {
      id
    }
  }
`;

export const UPDATE_TODO = gql`
  mutation UpdateTodo($id: uuid!, $user_id: uuid!) {
    update_todos(
      where: { id: { _eq: $id }, user_id: { _eq: $user_id } }
      _set: { completed: true }
    ) {
      returning {
        id
        completed
      }
    }
  }
`;

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: uuid!, $user_id: uuid!) {
    delete_todos(where: { id: { _eq: $id }, user_id: { _eq: $user_id } }) {
      returning {
        id
      }
    }
  }
`;

//   SUBSCRIPTIONS   //

export const SUBSCRIBE_TODOS = gql`
  subscription SubscribeTodos($userId: uuid!) {
    todos(where: { user_id: { _eq: $userId } }) {
      id
      title
      completed
      created_at
      updated_at
      file_id
    }
  }
`;
