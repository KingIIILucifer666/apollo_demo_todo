"use client";
import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useFileUpload } from "@nhost/nextjs";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

const CREATE_TODO = gql`
  mutation MyMutation($title: String!, $file_id: uuid, $user_id: uuid!) {
    insert_todos_one(
      object: { title: $title, file_id: $file_id, user_id: $user_id }
    ) {
      id
    }
  }
`;

const InsertTodos = () => {
  const searchParams = useSearchParams();
  const user_id = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [todoAttachment, setTodoAttachment] = useState(null);

  const { upload } = useFileUpload();
  const [insertTodo] = useMutation(CREATE_TODO);

  const handleCreateTodo = async (e) => {
    e.preventDefault();

    let file_id;

    try {
      if (todoAttachment) {
        const { id, error } = await upload({
          file: todoAttachment,
          name: todoAttachment.name,
        });

        file_id = id;

        if (error) {
          console.error("Error uploading file: ", error);
          return;
        }
      }

      await insertTodo({
        variables: { title, file_id: file_id, user_id: user_id },
      });

      toast.success("New Todo Inserted!");
    } catch (error) {
      toast.error("Error Inserting Todo: ", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-green-800 flex flex-col justify-start items-center">
      <div className="h-40 w-40 bg-red-900 rounded-full mt-10 inline-flex justify-center items-center shadow-lg text-lg">
        Insert Todos
      </div>
      <div className="mt-10 bg-black/25 px-80 py-10 text-sm font-serif rounded-lg">
        <form onSubmit={handleCreateTodo} className="flex flex-col gap-3">
          <div className="flex flex-col justify-center items-start gap-2">
            <label htmlFor="Title">Title</label>
            <input
              id="Title"
              type="text"
              className="p-2 bg-black/15 border border-white/10 rounded-lg"
              value={title}
              placeholder="Enter Title"
              onChange={(e) => setTitle(e.target.value)}
              required={true}
            />
          </div>
          <div className="flex flex-col justify-center items-start gap-2">
            <label htmlFor="File">Upload File(Optional)</label>
            <input
              id="File"
              type="file"
              className="py-3 px-3 bg-black/15 border border-white/10 rounded-lg"
              onChange={(e) => setTodoAttachment(e.target.files[0])}
            />
          </div>
          <button type="submit" className="w-max bg-red-800 p-2">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default InsertTodos;
